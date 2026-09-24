"use client";

import { useState, useEffect, useCallback } from "react";
import { productsService } from "@/services/products.service";

/**
 * Custom hook to fetch and provide the list of categories.
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async (signal) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productsService.getCategories({ signal });
      setCategories(data);
    } catch (err) {
      if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
        setError(err?.message || "Failed to load categories");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refetch: () => fetchCategories(),
  };
}
