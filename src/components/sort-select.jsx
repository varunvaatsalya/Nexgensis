"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortSelect({
  sortBy = "",
  order = "asc",
  onChange,
  className = "",
}) {
  // Combine sortBy and order into a single composite key
  const compositeValue = sortBy ? `${sortBy}:${order || "asc"}` : "default";

  const handleValueChange = (val) => {
    if (val === "default") {
      onChange({ sortBy: "", order: "asc" });
    } else {
      const [field, dir] = val.split(":");
      onChange({ sortBy: field, order: dir || "asc" });
    }
  };

  return (
    <div className={`min-w-[170px] ${className}`}>
      <Select value={compositeValue} onValueChange={handleValueChange}>
        <SelectTrigger className="h-9 w-full bg-background/60 border-border/80 text-sm font-medium">
          <div className="flex items-center gap-2 truncate">
            <ArrowUpDown className="size-3.5 text-muted-foreground shrink-0" />
            <SelectValue placeholder="Sort By" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default Sort</SelectItem>
          <SelectItem value="title:asc">Title: A to Z</SelectItem>
          <SelectItem value="title:desc">Title: Z to A</SelectItem>
          <SelectItem value="price:asc">Price: Low to High</SelectItem>
          <SelectItem value="price:desc">Price: High to Low</SelectItem>
          <SelectItem value="rating:desc">Rating: High to Low</SelectItem>
          <SelectItem value="rating:asc">Rating: Low to High</SelectItem>
          <SelectItem value="stock:desc">Stock: High to Low</SelectItem>
          <SelectItem value="stock:asc">Stock: Low to High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
