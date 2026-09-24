"use client";

import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-6 ring-8 ring-primary/5">
        <Compass className="size-10" />
      </div>

      <span className="text-sm font-bold uppercase tracking-widest text-primary mb-2">
        404 Error
      </span>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
        Page Not Found
      </h1>

      <p className="max-w-md text-sm text-muted-foreground mb-8 leading-relaxed">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/products">
          <Button variant="default" className="gap-2 font-semibold">
            <Home className="size-4" />
            <span>Go to Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
