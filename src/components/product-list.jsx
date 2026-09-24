"use client";

import React from "react";
import { ProductTable } from "@/components/product-table";
import { ProductCard } from "@/components/product-card";
import { TableLoadingSkeleton, GridLoadingSkeleton } from "@/components/states/loading-state";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";

export function ProductList({
  products = [],
  isLoading = false,
  error = null,
  pageSize = 10,
  currentQueryString = "",
  onEdit,
  onDelete,
  onRetry,
  onResetFilters,
}) {
  // 1. Error State
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="hidden md:block">
          <TableLoadingSkeleton rows={pageSize || 10} />
        </div>
        <div className="block md:hidden">
          <GridLoadingSkeleton cards={6} />
        </div>
      </div>
    );
  }

  // 3. Empty State
  if (!products || products.length === 0) {
    return <EmptyState onReset={onResetFilters} />;
  }

  // 4. Products List (Table for md+, Cards for mobile)
  return (
    <div className="space-y-4">
      {/* Desktop view */}
      <div className="hidden md:block">
        <ProductTable
          products={products}
          currentQueryString={currentQueryString}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {/* Mobile view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currentQueryString={currentQueryString}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
