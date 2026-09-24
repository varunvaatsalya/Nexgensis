"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Check, Sparkles, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { productsService } from "@/services/products.service";
import { useCategories } from "@/hooks/use-categories";
import { useLocalProducts } from "@/store/local-products";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const productSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int("Stock must be an integer").min(0, "Stock cannot be negative"),
  category: z.string().min(1, "Please select a category"),
  brand: z.string().optional().default(""),
  discountPercentage: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .optional()
    .default(0),
  thumbnail: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || /^https?:\/\/.+/i.test(val),
      "Must be a valid HTTP/HTTPS URL"
    )
    .default(""),
});

export function ProductFormDialog({
  open,
  onOpenChange,
  product = null, // if provided, mode is EDIT; otherwise ADD
  onSuccess,
}) {
  const isEdit = Boolean(product && product.id);
  const { categories } = useCategories();
  const { addLocalProduct, updateLocalProduct } = useLocalProducts();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      brand: "",
      discountPercentage: 0,
      thumbnail: "",
    },
  });

  // Reset form with product values when dialog opens or product changes
  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          title: product.title || "",
          description: product.description || "",
          price: product.price || 0,
          stock: product.stock !== undefined ? product.stock : 0,
          category: product.category || "",
          brand: product.brand || "",
          discountPercentage: product.discountPercentage || 0,
          thumbnail: product.thumbnail || (product.images?.[0] || ""),
        });
      } else {
        reset({
          title: "",
          description: "",
          price: 0,
          stock: 10,
          category: categories[0]?.slug || "beauty",
          brand: "",
          discountPercentage: 0,
          thumbnail: "",
        });
      }
    }
  }, [open, product, reset, categories]);

  const onSubmit = async (data) => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const payload = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        category: data.category,
        brand: data.brand || undefined,
        discountPercentage: Number(data.discountPercentage || 0),
        thumbnail: data.thumbnail || "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
        images: data.thumbnail ? [data.thumbnail] : [],
        rating: isEdit ? (product.rating || 4.5) : 4.5,
      };

      if (isEdit) {
        // Call PUT /products/{id}
        await productsService.updateProduct(product.id, payload);

        // Update local overlay
        updateLocalProduct(product.id, payload);

        toast.success("Product Updated", {
          description: `"${payload.title}" was updated successfully.`,
        });

        if (onSuccess) onSuccess({ ...product, ...payload });
      } else {
        // Call POST /products/add
        await productsService.addProduct(payload);

        // Add to local overlay
        const created = addLocalProduct(payload);

        toast.success("Product Created", {
          description: `"${payload.title}" was added to catalog.`,
        });

        if (onSuccess) onSuccess(created);
      }

      onOpenChange(false);
    } catch (err) {
      toast.error(isEdit ? "Update Failed" : "Creation Failed", {
        description: err?.message || "Something went wrong.",
      });
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isSubmitting && onOpenChange(val)}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEdit
              ? "Modify details for this product. Changes will immediately update your inventory overlay."
              : "Create a new product item. It will appear at the top of your catalog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">
              Product Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Wireless Noise-Canceling Headphones"
              {...register("title")}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-xs text-destructive font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Provide a detailed overview of the product specifications and benefits..."
              {...register("description")}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-xs text-destructive font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Category & Brand row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-semibold">
                Category <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="category" className="h-9 w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {categories.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-xs text-destructive font-medium">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brand" className="text-xs font-semibold">
                Brand
              </Label>
              <Input
                id="brand"
                placeholder="e.g. Sony, Apple, Nike"
                {...register("brand")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Price, Discount, Stock row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-xs font-semibold">
                Price ($) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="29.99"
                {...register("price")}
                disabled={isSubmitting}
              />
              {errors.price && (
                <p className="text-xs text-destructive font-medium">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="discountPercentage" className="text-xs font-semibold">
                Discount (%)
              </Label>
              <Input
                id="discountPercentage"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="10"
                {...register("discountPercentage")}
                disabled={isSubmitting}
              />
              {errors.discountPercentage && (
                <p className="text-xs text-destructive font-medium">{errors.discountPercentage.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stock" className="text-xs font-semibold">
                Stock Units <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                step="1"
                min="0"
                placeholder="50"
                {...register("stock")}
                disabled={isSubmitting}
              />
              {errors.stock && (
                <p className="text-xs text-destructive font-medium">{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-1.5">
            <Label htmlFor="thumbnail" className="text-xs font-semibold">
              Thumbnail Image URL (Optional)
            </Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="thumbnail"
                type="url"
                placeholder="https://images.unsplash.com/..."
                className="pl-9"
                {...register("thumbnail")}
                disabled={isSubmitting}
              />
            </div>
            {errors.thumbnail && (
              <p className="text-xs text-destructive font-medium">{errors.thumbnail.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  {isEdit ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEdit ? "Save Changes" : "Create Product"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
