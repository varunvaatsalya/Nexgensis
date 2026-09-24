"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableLoadingSkeleton({ rows = 6 }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-16">Item</TableHead>
            <TableHead className="min-w-[200px]">Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell>
                <Skeleton className="size-12 rounded-xl" />
              </TableCell>
              <TableCell className="space-y-2">
                <Skeleton className="h-4 w-44 rounded-md" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16 rounded-md" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-14 rounded-md" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1.5">
                  <Skeleton className="size-8 rounded-lg" />
                  <Skeleton className="size-8 rounded-lg" />
                  <Skeleton className="size-8 rounded-lg" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function GridLoadingSkeleton({ cards = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-16 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Skeleton className="h-8 flex-1 rounded-lg" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
