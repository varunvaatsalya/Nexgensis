"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PageSizeSelect({
  value = 10,
  onChange,
  className = "",
}) {
  return (
    <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
      <span className="hidden sm:inline">Show:</span>
      <Select
        value={String(value)}
        onValueChange={(val) => onChange(parseInt(val, 10))}
      >
        <SelectTrigger className="h-8 w-[72px] bg-background/60 border-border/80 text-xs font-semibold">
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
