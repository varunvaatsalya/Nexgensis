"use client";

import React, { useState, use, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Boxes,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  MoreVertical,
} from "lucide-react";

import { useProduct } from "@/hooks/use-product";
import { ProductGallery } from "@/components/product-gallery";
import { ProductReviews } from "@/components/product-reviews";
import { ProductFormDialog } from "@/components/product-form";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RatingStars } from "@/components/rating-stars";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "cn";
import ProductNotFound from "../not-found";

function ProductDetailContent({ id }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Rebuild the query string so the back button preserves user search/pagination/filters
  const backQuery = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const { product, isLoading, isNotFound, refetch } = useProduct(id);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="relative size-48 sm:size-56 mb-4 drop-shadow-sm">
          <Image
            src="/illustrations/load-product.svg"
            alt="Loading product specifications"
            fill
            priority
            className="object-contain"
          />
        </div>
        <h3 className="text-base font-bold text-foreground tracking-tight mb-1">
          Loading Product Specifications
        </h3>
        <p className="max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed flex items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-sky-400" />
          <span>Fetching details from catalog...</span>
        </p>
      </div>
    );
  }

  if (isNotFound || !product) {
    return <ProductNotFound />;
  }

  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const originalPrice = hasDiscount
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="gap-1.5 font-semibold text-xs px-2.5 py-1">
          <XCircle className="size-3.5" />
          Out of Stock
        </Badge>
      );
    }
    if (stock < 10) {
      return (
        <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 gap-1.5 font-semibold text-xs bg-amber-500/5 px-2.5 py-1">
          <AlertCircle className="size-3.5" />
          Low Inventory ({stock} left)
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1.5 font-medium text-xs px-2.5 py-1">
        <CheckCircle2 className="size-3.5 text-emerald-500" />
        In Stock ({stock} available)
      </Badge>
    );
  };

  const handleDeleteSuccess = () => {
    router.push(`/products${backQuery}`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Back Navigation Bar + Actions */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/products${backQuery}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-2 font-medium text-muted-foreground hover:text-foreground -ml-2 sm:ml-0"
          )}
        >
          <ArrowLeft className="size-4" />
          <span>Back to Products</span>
        </Link>

        {/* Mobile Actions Dropdown / Popover */}
        <div className="flex sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5 font-semibold text-xs h-8 px-2.5 cursor-pointer shadow-xs"
              )}
              aria-label="Product options"
            >
              <MoreVertical className="size-3.5" />
              <span>Options</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1.5 shadow-lg">
              <DropdownMenuItem
                onClick={() => setFormOpen(true)}
                className="cursor-pointer gap-2 font-medium text-xs py-2"
              >
                <Edit2 className="size-3.5 text-muted-foreground" />
                <span>Edit Product</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive gap-2 font-medium text-xs py-2"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Product</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFormOpen(true)}
            className="gap-1.5 font-semibold"
          >
            <Edit2 className="size-3.5" />
            <span>Edit Product</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="gap-1.5 font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5">
          <ProductGallery
            images={product.images || []}
            thumbnail={product.thumbnail}
            title={product.title}
            discountPercentage={product.discountPercentage}
          />
        </div>

        {/* Right Column: Product Overview & Meta (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header & Badges */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="capitalize font-semibold text-xs px-2.5 py-0.5 bg-primary/5 text-primary border-primary/20">
                {product.category}
              </Badge>
              {product.brand && (
                <Badge variant="secondary" className="font-medium text-xs px-2.5 py-0.5">
                  Brand: {product.brand}
                </Badge>
              )}
              {product.isLocal && (
                <Badge className="bg-sky-500/15 text-sky-600 dark:text-sky-400 text-xs px-2.5 py-0.5">
                  Local Item
                </Badge>
              )}
              {product.isEdited && !product.isLocal && (
                <Badge variant="outline" className="text-xs px-2.5 py-0.5 border-primary/40">
                  Locally Modified
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
              <div className="flex items-center gap-2">
                <RatingStars rating={product.rating || 0} size="md" showValue={true} />
                <span className="text-xs text-muted-foreground font-normal">
                  ({product.reviews ? product.reviews.length : 0} reviews)
                </span>
              </div>
              <span>•</span>
              <span className="font-mono text-xs">SKU: {product.sku || `PRD-${product.id}`}</span>
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <Card className="border-border/80 bg-muted/20 shadow-xs">
            <CardContent className="p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-foreground">
                    ₹{Number(product.price).toFixed(2)}
                  </span>
                  {originalPrice && (
                    <span className="text-base text-muted-foreground line-through">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Special promotional discount of {Math.round(product.discountPercentage)}% applied
                  </p>
                )}
              </div>

              <div>{getStockBadge(product.stock)}</div>
            </CardContent>
          </Card>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </h3>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specification Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3.5">
              <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-foreground">Warranty</p>
                <p className="text-muted-foreground">
                  {product.warrantyInformation || "1 year standard manufacturer warranty"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3.5">
              <Truck className="size-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-foreground">Shipping Policy</p>
                <p className="text-muted-foreground">
                  {product.shippingInformation || "Ships in 1-2 business days with express tracking"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3.5">
              <RotateCcw className="size-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-foreground">Return Policy</p>
                <p className="text-muted-foreground">
                  {product.returnPolicy || "30 days no-hassle return policy"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3.5">
              <Boxes className="size-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-foreground">Minimum Order</p>
                <p className="text-muted-foreground">
                  {product.minimumOrderQuantity ? `${product.minimumOrderQuantity} units` : "1 unit"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="pt-6">
        <ProductReviews reviews={product.reviews || []} />
      </div>

      {/* Product Form Modal (Edit) */}
      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={product}
        onSuccess={() => refetch()}
      />

      {/* Delete Confirmation Alert Dialog */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteDialogOpen}
        product={product}
        onDeleted={handleDeleteSuccess}
      />
    </div>
  );
}

export default function ProductDetailPage({ params }) {
  // Unwrap params using React.use() in App Router
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
          <div className="relative size-48 sm:size-56 mb-4 drop-shadow-sm">
            <Image
              src="/illustrations/load-product.svg"
              alt="Loading product specifications"
              fill
              priority
              className="object-contain"
            />
          </div>
          <h3 className="text-base font-bold text-foreground tracking-tight mb-1">
            Loading Product Specifications
          </h3>
          <p className="max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed flex items-center justify-center gap-2">
            <Loader2 className="size-3.5 animate-spin text-primary" />
            <span>Fetching details from catalog...</span>
          </p>
        </div>
      }
    >
      <ProductDetailContent id={id} />
    </Suspense>
  );
}
