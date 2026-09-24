"use client";

import React from "react";
import { Star } from "lucide-react";

/**
 * Single star rating component with proportional yellow fill based on rating out of 5.
 * (e.g. 4.5 / 5 = 90% filled yellow star).
 *
 * @param {number} rating - Decimal rating value (0 to 5)
 * @param {string} size - Star icon size ("xs", "sm", "md", "lg")
 * @param {boolean} showValue - Whether to show numeric score next to star (default true)
 * @param {string} className - Optional container styling classes
 */
export function RatingStars({
  rating = 0,
  size = "sm",
  showValue = true,
  className = "",
}) {
  const numericRating = Math.max(0, Math.min(5, Number(rating) || 0));
  // Proportional percentage fill out of 5 stars
  const fillPercentage = (numericRating / 5) * 100;

  const sizeClasses = {
    xs: "size-3.5",
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className={`inline-flex items-center gap-1.5 leading-none ${className}`}>
      {/* Single Proportional Star */}
      <div className="relative inline-flex items-center justify-center select-none leading-none">
        {/* Background Empty Star */}
        <Star
          className={`${currentSizeClass} text-muted-foreground/30 fill-muted/30 stroke-[1.5]`}
        />

        {/* Foreground Yellow/Amber Filled Star Layer */}
        {fillPercentage > 0 && (
          <div
            className="absolute top-0 left-0 bottom-0 overflow-hidden leading-none select-none pointer-events-none"
            style={{ width: `${fillPercentage}%` }}
          >
            <Star
              className={`${currentSizeClass} fill-amber-400 text-amber-400 stroke-amber-400 stroke-[1.5]`}
            />
          </div>
        )}
      </div>

      {/* Numeric Score */}
      {showValue && (
        <span className="font-semibold text-xs text-foreground tabular-nums">
          {numericRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export const SingleStarRating = RatingStars;
