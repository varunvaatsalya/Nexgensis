"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  Package,
  LogOut,
  User,
  Layers,
} from "lucide-react";
import { toast } from "react-toastify";

import { getAuthUser, clearAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  // Lazy initialize user from localStorage safely
  const [user] = useState(() => {
    if (typeof window !== "undefined") {
      return getAuthUser();
    }
    return null;
  });

  const handleLogout = () => {
    clearAuth();
    toast.success("Signed out successfully. You have been logged out.");
    router.push("/login");
    router.refresh();
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.username || "Admin User";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Nav */}
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
            <Badge variant="outline" className="hidden sm:inline-flex text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 border-primary/30 text-primary">
              Admin
            </Badge>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/products"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/products")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Layers className="size-4" />
              <span>Products</span>
            </Link>
          </nav>
        </div>

        {/* Right side controls: Theme Toggle + User Menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full p-1 pl-2 text-sm font-medium outline-none ring-offset-background transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring"
                />
              }
            >
              {user?.image ? (
                <div className="relative size-8 overflow-hidden rounded-full border border-border">
                  <Image
                    src={user.image}
                    alt={displayName}
                    fill
                    unoptimized
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                  <User className="size-4" />
                </div>
              )}
              <span className="hidden text-xs font-semibold text-foreground md:inline-block max-w-[120px] truncate">
                {displayName}
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-1">
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-foreground">
                    {displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "admin@dummyjson.com"}
                  </p>
                  <div className="pt-1.5">
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      @{user?.username || "admin"}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive gap-2 font-medium"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
