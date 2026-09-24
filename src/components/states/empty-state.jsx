"use client";

import React from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "No products found",
  description = "No products match your current search or category filters.",
  onReset,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/90 bg-card/40 p-8 sm:p-12 text-center">
      <div className="relative size-44 sm:size-52 mb-4 drop-shadow-sm">
        <Image
          src="/illustrations/empty-product.svg"
          alt="No products illustration"
          fill
          priority
          className="object-contain"
        />
      </div>
      <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">
        {title}
      </h3>
      <p className="max-w-md text-sm text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="gap-2 font-semibold shadow-xs"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Filters</span>
        </Button>
      )}
    </div>
  );
}
