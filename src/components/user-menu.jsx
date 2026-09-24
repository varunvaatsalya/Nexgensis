"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import { toast } from "react-toastify";

import { getAuthUser, clearAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const router = useRouter();

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
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full p-1 pl-2 text-sm font-medium outline-none ring-offset-background transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        aria-label="User account menu"
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
  );
}
