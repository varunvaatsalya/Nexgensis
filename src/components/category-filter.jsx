"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Filter, Search, Check, ChevronDown, X, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

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
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 220,
    openUpwards: false,
  });

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Calculate coordinates for portal positioning
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < 280 && rect.top > 280;

    setDropdownPosition({
      top: openUpwards ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: Math.max(220, rect.width),
      openUpwards,
    });
  }, []);

  // Update position on open and scroll/resize
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
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
      }, 60);
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
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
  };

  const toggleOpen = () => {
    if (disabled || isLoading) return;
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled || isLoading}
        onClick={toggleOpen}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-full justify-between gap-2 bg-background border-border text-sm font-medium pl-3 pr-9 shadow-xs hover:bg-muted/60 text-left font-normal cursor-pointer"
        )}
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
      </button>

      {/* Right controls: Clear (X) button + Chevron */}
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none z-10">
        {selectedCategory && (
          <button
            type="button"
            onClick={handleClear}
            className="pointer-events-auto rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
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

      {/* Portaled Solid Dropdown Popup */}
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: dropdownPosition.openUpwards ? "auto" : `${dropdownPosition.top}px`,
              bottom: dropdownPosition.openUpwards
                ? `${window.innerHeight - dropdownPosition.top}px`
                : "auto",
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: 99999,
            }}
            className="rounded-2xl border border-border/90 bg-popover text-popover-foreground shadow-2xl ring-1 ring-black/10 dark:ring-white/10 animate-in fade-in-0 zoom-in-95 duration-100 overflow-hidden"
            role="listbox"
          >
            {/* Search Input Bar */}
            <div className="p-2 border-b border-border/60 bg-muted/40">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories..."
                  className="h-8 w-full rounded-xl bg-background pl-8 pr-7 text-xs border border-border/80 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories Scrollable List */}
            <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 bg-popover scrollbar-thin">
              {showAllOption && !searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSelect("all")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    !value || value === "all"
                      ? "bg-primary/15 text-primary font-semibold"
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
                          ? "bg-primary/15 text-primary font-semibold"
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

            {/* Bottom Footer Info */}
            <div className="px-3 py-1.5 border-t border-border/50 bg-muted/30 text-[10px] text-muted-foreground flex justify-between items-center select-none">
              <span>{filteredCategories.length} categories</span>
              <span className="font-mono text-[9px] opacity-70">ESC to close</span>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
