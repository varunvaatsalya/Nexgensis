"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export function SearchInput({
  value = "",
  onChange,
  isSearching = false,
  placeholder = "Search by title, brand, description...",
  className = "",
}) {
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // Synchronize localValue during render if external value changes (e.g. reset filters)
  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  const debouncedValue = useDebounce(localValue, 500);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

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
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9 h-9 bg-background/60 border-border/80 text-sm focus-visible:ring-primary/20"
        aria-label="Search products"
      />

      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
