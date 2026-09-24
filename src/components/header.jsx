import React from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";

export function Header() {
  return (
    <header className="w-full border-b border-border/80 bg-background/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link
            href="/products"
            className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
              <Package className="size-5" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Nexgensis
            </span>
            <Badge
              variant="outline"
              className="hidden sm:inline-flex text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 border-primary/30 text-primary"
            >
              Admin
            </Badge>
          </Link>
        </div>

        {/* Right side interactive controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
