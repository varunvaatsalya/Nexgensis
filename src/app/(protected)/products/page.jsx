"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, Sparkles, FilterX, HelpCircle, Loader2, RefreshCw } from "lucide-react";

import {
  parseProductQueryParams,
  buildProductQueryString,
  clampPage,
} from "@/lib/query-params";
import { useProducts } from "@/hooks/use-products";
import { SearchInput } from "@/components/search-input";
import { CategoryFilter } from "@/components/category-filter";
import { SortSelect } from "@/components/sort-select";
import { PageSizeSelect } from "@/components/page-size-select";
import { Pagination } from "@/components/pagination";
import { ProductList } from "@/components/product-list";
import { ProductFormDialog } from "@/components/product-form";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function ProductsDashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. URL search params is the SINGLE source of truth
  const params = useMemo(() => {
    return parseProductQueryParams(searchParams);
  }, [searchParams]);

  // Current query string to pass to details links so back-button preserves filter state
  const currentQueryString = useMemo(() => {
    return buildProductQueryString(params);
  }, [params]);

  // 2. Fetch products using custom hook
  const {
    products,
    total,
    totalPages,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useProducts(params);

  // 3. Modals state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] = useState(null);

  // 4. Edge Case #3: Page clamping check
  // If the user lands on ?page=999, clamp to last page without an infinite loop
  useEffect(() => {
    if (!isLoading && totalPages > 0 && params.page > totalPages) {
      const clamped = clampPage(params.page, totalPages);
      if (clamped !== params.page) {
        const newQuery = buildProductQueryString({ ...params, page: clamped });
        router.replace(`${pathname}${newQuery}`, { scroll: false });
      }
    }
  }, [isLoading, totalPages, params, router, pathname]);

  // URL updater helper
  const updateQueryParams = (newParams) => {
    const updated = { ...params, ...newParams };
    const newQuery = buildProductQueryString(updated);
    router.replace(`${pathname}${newQuery}`, { scroll: false });
  };

  // Handlers for URL filters
  const handleSearchChange = (newQ) => {
    // Changing search resets page to 1 and clears category (mutual exclusivity)
    updateQueryParams({
      q: newQ,
      category: "",
      page: 1,
    });
  };

  const handleCategoryChange = (newCategory) => {
    // Changing category resets page to 1 and clears search query (mutual exclusivity)
    updateQueryParams({
      category: newCategory,
      q: "",
      page: 1,
    });
  };

  const handleSortChange = ({ sortBy, order }) => {
    updateQueryParams({ sortBy, order, page: 1 });
  };

  const handlePageSizeChange = (newPageSize) => {
    updateQueryParams({ limit: newPageSize, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateQueryParams({ page: newPage });
  };

  const handleResetFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  // CRUD Dialog triggers
  const handleOpenAddDialog = () => {
    setSelectedProductForEdit(null);
    setFormOpen(true);
  };

  const handleOpenEditDialog = (product) => {
    setSelectedProductForEdit(product);
    setFormOpen(true);
  };

  const handleOpenDeleteDialog = (product) => {
    setSelectedProductForDelete(product);
    setDeleteDialogOpen(true);
  };

  const hasActiveFilters = Boolean(params.q || params.category || params.sortBy);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Product Catalog
            </h1>
            {isFetching && !isLoading && (
              <Badge variant="outline" className="gap-1.5 text-xs text-muted-foreground animate-pulse">
                <Loader2 className="size-3 animate-spin text-primary" />
                Updating
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage inventory, search products, update catalog details and monitor stock levels.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handleOpenAddDialog}
            className="gap-2 font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs backdrop-blur-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Left: Search input */}
          <SearchInput
            value={params.q}
            onChange={handleSearchChange}
            isSearching={isFetching && Boolean(params.q)}
          />

          {/* Right: Category, Sort, and Reset */}
          <div className="flex flex-wrap items-center gap-2.5">
            <CategoryFilter
              value={params.category}
              onChange={handleCategoryChange}
            />

            <SortSelect
              sortBy={params.sortBy}
              order={params.order}
              onChange={handleSortChange}
            />

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 px-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground gap-1.5"
                title="Reset all filters"
              >
                <FilterX className="size-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mutual Exclusivity and Active Filter Feedback */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="size-3.5 text-primary shrink-0" />
            <span>
              {params.q ? (
                <span>
                  Filtering by search: <strong className="text-foreground font-semibold">"{params.q}"</strong> (category filter paused)
                </span>
              ) : params.category ? (
                <span>
                  Filtered by category: <strong className="text-foreground capitalize font-semibold">{params.category}</strong>
                </span>
              ) : (
                <span>Search and category filters operate independently for accurate server pagination.</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <PageSizeSelect
              value={params.limit}
              onChange={handlePageSizeChange}
            />
          </div>
        </div>
      </div>

      {/* Main Products List (Responsive Table/Grid) */}
      <ProductList
        products={products}
        isLoading={isLoading}
        error={error}
        pageSize={params.limit}
        currentQueryString={currentQueryString}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
        onRetry={refetch}
        onResetFilters={handleResetFilters}
      />

      {/* Server Pagination */}
      {!isLoading && !error && products.length > 0 && (
        <Pagination
          currentPage={params.page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={params.limit}
          onPageChange={handlePageChange}
        />
      )}

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={selectedProductForEdit}
        onSuccess={() => refetch()}
      />

      {/* Delete Confirmation Alert Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        product={selectedProductForDelete}
        onDeleted={() => refetch()}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center p-20 gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading products dashboard...</p>
        </div>
      }
    >
      <ProductsDashboardContent />
    </Suspense>
  );
}
