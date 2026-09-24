"use client";

import React from "react";
import { Filter, Layers } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CategoryFilter({
  value = "",
  onChange,
  disabled = false,
  className = "",
}) {
  const { categories, isLoading } = useCategories();

  const handleValueChange = (val) => {
    // "all" translates to empty string
    onChange(val === "all" ? "" : val);
  };

  return (
    <div className={`relative min-w-[180px] ${className}`}>
      <Select
        value={value || "all"}
        onValueChange={handleValueChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="h-9 w-full bg-background/60 border-border/80 text-sm font-medium">
          <div className="flex items-center gap-2 truncate">
            <Filter className="size-3.5 text-muted-foreground shrink-0" />
            <SelectValue placeholder="Category: All" />
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-72">
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.slug} value={cat.slug}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
