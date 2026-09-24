"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Failed to load products",
  message = "An error occurred while fetching data from the server.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4 ring-8 ring-destructive/5">
        <AlertTriangle className="size-8" />
      </div>
      <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">
        {title}
      </h3>
      <p className="max-w-md text-sm text-muted-foreground mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="default"
          size="sm"
          onClick={onRetry}
          className="gap-2 font-medium"
        >
          <RefreshCw className="size-3.5" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
}
