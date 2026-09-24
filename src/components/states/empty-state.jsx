"use client";

import React from "react";
import { PackageSearch, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "No products found",
  description = "No products match your current search or category filters.",
  onReset,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/90 bg-card/50 p-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4 ring-8 ring-muted/30">
        <PackageSearch className="size-8" />
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
          className="gap-2 font-medium"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Filters</span>
        </Button>
      )}
    </div>
  );
}
