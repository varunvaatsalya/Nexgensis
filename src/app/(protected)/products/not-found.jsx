"use client";

import React from "react";
import Link from "next/link";
import { PackageX, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-muted text-muted-foreground mb-6 ring-8 ring-muted/30">
        <PackageX className="size-10" />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-2">
        Product Not Found
      </h1>

      <p className="max-w-md text-sm text-muted-foreground mb-8 leading-relaxed">
        The product you requested could not be found. It may have been deleted,
        moved, or the product ID is invalid.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/products">
          <Button variant="default" className="gap-2 font-semibold">
            <ArrowLeft className="size-4" />
            <span>Back to Products</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
