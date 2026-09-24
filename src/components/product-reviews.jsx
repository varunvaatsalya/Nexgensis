"use client";

import React from "react";
import { Star, MessageSquare, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProductReviews({ reviews = [] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <Card className="border-border/80 bg-card">
        <CardContent className="p-8 text-center text-muted-foreground">
          <MessageSquare className="size-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-sm">No customer reviews yet for this product.</p>
        </CardContent>
      </Card>
    );
  }

  const averageRating = (
    reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
  ).toFixed(1);

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
        <div>
          <CardTitle className="text-lg font-bold">Customer Reviews</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Based on {reviews.length} verified ratings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-amber-500">
            <Star className="size-4 fill-amber-500" />
          </div>
          <span className="text-lg font-bold text-foreground">{averageRating}</span>
          <span className="text-xs text-muted-foreground">/ 5.0</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4 divide-y divide-border/40">
        {reviews.map((rev, index) => {
          const initials = (rev.reviewerName || "U")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          const formattedDate = rev.date
            ? new Date(rev.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Recent";

          return (
            <div key={index} className={`space-y-2 ${index > 0 ? "pt-4" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold ring-2 ring-primary/10">
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {rev.reviewerName || "Anonymous Customer"}
                      </span>
                      <Badge variant="secondary" className="text-[10px] font-normal gap-0.5 px-1.5 py-0">
                        <ShieldCheck className="size-2.5 text-emerald-500" />
                        Verified
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      className={`size-3.5 ${
                        sIdx < rev.rating
                          ? "fill-amber-500 text-amber-500"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review text */}
              <p className="text-sm text-foreground/90 pl-12 leading-relaxed">
                "{rev.comment}"
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
