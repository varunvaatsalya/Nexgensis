"use client";

import React, { useState, useRef } from "react";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";

import { productsService } from "@/services/products.service";
import { useLocalProducts } from "@/store/local-products";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteConfirmDialog({
  product,
  open,
  onOpenChange,
  onDeleted,
}) {
  const { deleteLocalProduct } = useLocalProducts();
  const [isDeleting, setIsDeleting] = useState(false);
  const isDeletingRef = useRef(false);

  const handleDelete = async () => {
    if (!product || isDeletingRef.current) return;

    isDeletingRef.current = true;
    setIsDeleting(true);

    try {
      // Call real API endpoint (DummyJSON DELETE simulation)
      await productsService.deleteProduct(product.id);

      // Apply to local overlay
      deleteLocalProduct(product.id);

      toast.success(`"${product.title}" was deleted successfully.`);

      onOpenChange(false);
      if (onDeleted) onDeleted(product.id);
    } catch (err) {
      toast.error(err?.message || "Could not delete product.");
    } finally {
      isDeletingRef.current = false;
      setIsDeleting(false);
    }
  };

  if (!product) return null;

  return (
    <AlertDialog open={open} onOpenChange={(val) => !isDeleting && onOpenChange(val)}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Trash2 className="size-5" />
          </div>
          <AlertDialogTitle className="text-xl font-bold">
            Delete Product
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to delete <strong className="text-foreground">{product.title}</strong> (ID: #{product.id})? This action will remove the product from your inventory catalog.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel disabled={isDeleting} className="rounded-xl">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl font-medium gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Product
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
