"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/rating-stars";

export function ProductCard({
  product,
  currentQueryString = "",
  onEdit,
  onDelete,
}) {
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const originalPrice = hasDiscount
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="gap-1 text-[10px] font-semibold px-2 py-0.5">
          <XCircle className="size-2.5" />
          Out of Stock
        </Badge>
      );
    }
    if (stock < 10) {
      return (
        <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 gap-1 text-[10px] font-semibold bg-amber-500/5 px-2 py-0.5">
          <AlertCircle className="size-2.5" />
          Low ({stock})
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1 text-[10px] font-medium px-2 py-0.5">
        <CheckCircle2 className="size-2.5 text-emerald-500" />
        {stock} in stock
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden border-border/80 bg-card/95 transition-all hover:shadow-md">
      <CardContent className="p-4 space-y-3">
        {/* Top: Image + Info */}
        <div className="flex items-start gap-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/20 flex items-center justify-center">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            ) : (
              <span className="text-xs text-muted-foreground">No image</span>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="outline" className="text-[10px] capitalize px-1.5 py-0">
                {product.category}
              </Badge>
              {product.isLocal && (
                <Badge className="bg-sky-500/15 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 text-[10px] px-1.5 py-0">
                  Local
                </Badge>
              )}
            </div>

            <Link
              href={`/products/${product.id}${currentQueryString}`}
              className="block font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
            >
              {product.title}
            </Link>

            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground pt-0.5">
              <span className="truncate">{product.brand || "Generic"}</span>
              <RatingStars rating={product.rating || 0} size="xs" showValue={true} />
            </div>
          </div>
        </div>

        {/* Pricing & Stock status */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-foreground">
              ₹{Number(product.price).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>

          <div>{getStockBadge(product.stock)}</div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <Link
            href={`/products/${product.id}${currentQueryString}`}
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-1.5 h-8">
              <Eye className="size-3.5" />
              <span>Details</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="size-8 p-0"
            title="Edit"
          >
            <Edit2 className="size-3.5 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(product)}
            className="size-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
