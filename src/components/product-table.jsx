"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Eye,
  Edit2,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProductTable({
  products = [],
  currentQueryString = "",
  onEdit,
  onDelete,
}) {
  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="gap-1 text-[11px] font-semibold">
          <XCircle className="size-3" />
          Out of Stock
        </Badge>
      );
    }
    if (stock < 10) {
      return (
        <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 gap-1 text-[11px] font-semibold bg-amber-500/5">
          <AlertCircle className="size-3" />
          Low ({stock})
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1 text-[11px] font-medium">
        <CheckCircle2 className="size-3 text-emerald-500" />
        {stock} in stock
      </Badge>
    );
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/40 text-xs">
          <TableRow>
            <TableHead className="w-16 text-center">Image</TableHead>
            <TableHead className="min-w-[220px]">Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
            const originalPrice = hasDiscount
              ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
              : null;

            return (
              <TableRow
                key={product.id}
                className="group transition-colors hover:bg-muted/30"
              >
                {/* Thumbnail */}
                <TableCell className="text-center p-2.5">
                  <div className="relative size-12 mx-auto overflow-hidden rounded-xl border border-border/60 bg-muted/20 flex items-center justify-center">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        sizes="48px"
                        className="object-contain p-1 transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-[10px] text-muted-foreground font-semibold">
                        No img
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Title and Brand */}
                <TableCell className="font-medium">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.id}${currentQueryString}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {product.title}
                      </Link>
                      {product.isLocal && (
                        <Badge className="bg-sky-500/15 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 text-[10px] px-1.5 py-0">
                          Local Added
                        </Badge>
                      )}
                      {product.isEdited && !product.isLocal && (
                        <Badge variant="outline" className="text-muted-foreground text-[10px] px-1.5 py-0 border-primary/30">
                          Edited
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.brand ? product.brand : "Generic"} • ID #{product.id}
                    </span>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className="capitalize font-medium text-xs bg-muted/20 border-border/70"
                  >
                    {product.category}
                  </Badge>
                </TableCell>

                {/* Price */}
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-foreground">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      )}
                    </div>
                    {originalPrice && (
                      <span className="text-[11px] text-muted-foreground line-through">
                        ${originalPrice}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Rating */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-500">
                      <Star className="size-3.5 fill-amber-500" />
                    </div>
                    <span className="text-xs font-semibold">
                      {Number(product.rating || 0).toFixed(1)}
                    </span>
                  </div>
                </TableCell>

                {/* Stock */}
                <TableCell>
                  {getStockBadge(product.stock)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={
                        <Link
                          href={`/products/${product.id}${currentQueryString}`}
                          aria-label={`View details of ${product.title}`}
                        />
                      }
                      title="View Details"
                    >
                      <Eye className="size-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(product)}
                      title="Edit Product"
                      aria-label={`Edit ${product.title}`}
                    >
                      <Edit2 className="size-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(product)}
                      title="Delete Product"
                      aria-label={`Delete ${product.title}`}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
