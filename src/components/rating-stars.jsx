"use client";

import React from "react";
import { Star } from "lucide-react";

/**
 * RatingStars component that accurately fills stars proportionally to the decimal rating value.
 *
 * @param {number} rating - Decimal rating value (e.g. 4.3, 4.8)
 * @param {number} maxStars - Total stars count (default 5)
 * @param {string} size - Star icon size ("xs", "sm", "md", "lg")
 * @param {boolean} showValue - Whether to show numeric rating alongside stars
 * @param {string} className - Optional container styling classes
 */
export function RatingStars({
  rating = 0,
  maxStars = 5,
  size = "sm",
  showValue = false,
  className = "",
}) {
  const numericRating = Number(rating) || 0;

  const sizeClasses = {
    xs: "size-3",
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5",
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, index) => {
          // Calculate fill percentage for each star (0% to 100%)
          const fillPercentage = Math.max(
            0,
            Math.min(100, (numericRating - index) * 100)
          );

          return (
            <div key={index} className="relative inline-block leading-none">
              {/* Background Outline / Empty Star */}
              <Star
                className={`${currentSizeClass} text-muted-foreground/30 stroke-[1.5] fill-muted/30`}
              />

              {/* Foreground Yellow/Amber Filled Star Layer */}
              {fillPercentage > 0 && (
                <div
                  className="absolute top-0 left-0 overflow-hidden leading-none select-none"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star
                    className={`${currentSizeClass} fill-amber-400 text-amber-400 stroke-amber-400 stroke-[1.5]`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showValue && (
        <span className="font-semibold text-xs text-foreground tabular-nums">
          {numericRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
