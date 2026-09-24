"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="relative size-64 sm:size-80 drop-shadow-sm">
        <Image
          src="/illustrations/404-Error.svg"
          alt="404 Page Not Found Illustration"
          fill
          priority
          className="object-contain"
        />
      </div>

      <span className="text-xl font-bold uppercase tracking-widest text-primary mb-2">
        Error
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
        Oops! Page Not Found
      </h1>

      <p className="max-w-md text-sm text-muted-foreground mb-6 leading-relaxed">
        The page you are looking for doesn&apos;t exist, was removed, or is temporarily unavailable.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/products">
          <Button variant="default" className="gap-2 font-semibold shadow-xs">
            <Home className="size-4" />
            <span>Return to Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
