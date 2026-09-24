"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Filter, Search, Check, ChevronDown, X, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CategoryFilter({
  value = "",
  onChange,
  disabled = false,
  className = "",
  placeholder = "Category: All",
  showAllOption = true,
}) {
  const { categories, isLoading } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase().trim();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.slug.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  // Find currently selected category name
  const selectedCategory = useMemo(() => {
    if (!value || value === "all") return null;
    return categories.find((c) => c.slug.toLowerCase() === value.toLowerCase());
  }, [categories, value]);

  const handleSelect = (categorySlug) => {
    onChange(categorySlug === "all" ? "" : categorySlug);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div ref={containerRef} className={`relative min-w-[200px] ${className}`}>
      {/* Trigger Button */}
      <Button
        type="button"
        variant="outline"
        disabled={disabled || isLoading}
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-9 w-full justify-between gap-2 bg-background/60 border-border/80 text-sm font-medium px-3 shadow-xs hover:bg-muted/50"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2 truncate">
          <Filter className="size-3.5 text-muted-foreground shrink-0" />
          {isLoading ? (
            <span className="text-muted-foreground text-xs flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" />
              Loading...
            </span>
          ) : selectedCategory ? (
            <span className="truncate font-semibold text-foreground capitalize">
              {selectedCategory.name}
            </span>
          ) : (
            <span className="text-muted-foreground truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedCategory && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Clear category"
              aria-label="Clear category"
            >
              <X className="size-3.5" />
            </button>
          )}
          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </Button>

      {/* Dropdown Popup with Search */}
      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[240px] rounded-2xl border border-border/80 bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/5 backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-100 overflow-hidden"
          role="listbox"
        >
          {/* Search Header */}
          <div className="p-2 border-b border-border/50 bg-muted/20">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search category..."
                className="h-8 w-full rounded-xl bg-background/80 pl-8 pr-7 text-xs border border-border/70 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* Categories List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
            {showAllOption && !searchQuery && (
              <button
                type="button"
                onClick={() => handleSelect("all")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                  !value || value === "all"
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <span>All Categories</span>
                {(!value || value === "all") && <Check className="size-3.5 text-primary" />}
              </button>
            )}

            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => {
                const isSelected = value?.toLowerCase() === cat.slug?.toLowerCase();
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => handleSelect(cat.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span className="truncate capitalize">{cat.name}</span>
                    {isSelected && <Check className="size-3.5 text-primary shrink-0 ml-2" />}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No categories found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>

          {/* Footer showing count */}
          <div className="px-3 py-1.5 border-t border-border/40 bg-muted/10 text-[10px] text-muted-foreground flex justify-between items-center">
            <span>{filteredCategories.length} categories</span>
            <span className="font-mono text-[9px] opacity-70">ESC to close</span>
          </div>
        </div>
      )}
    </div>
  );
}
