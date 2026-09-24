"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchInput({
  value = "",
  onChange,
  isSearching = false,
  placeholder = "Search by title, brand, description...",
  className = "",
}) {
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const timeoutRef = useRef(null);

  // Synchronize localValue during render if external value changes (pure render state synchronization)
  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  // Cancel any active debounce timeout when external value prop changes (e.g. Reset Filters)
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [value]);

  const handleChange = (e) => {
    const nextVal = e.target.value;
    setLocalValue(nextVal);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(nextVal);
    }, 500);
  };

  const handleClear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setLocalValue("");
    onChange("");
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative flex-1 min-w-[240px] max-w-md ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        {isSearching ? (
          <Loader2 className="size-4 animate-spin text-primary" />
        ) : (
          <Search className="size-4" />
        )}
      </div>

      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-9 pr-9 h-9 bg-background/60 border-border/80 text-sm focus-visible:ring-primary/20"
        aria-label="Search products"
      />

      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
