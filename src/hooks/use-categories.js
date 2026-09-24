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
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    productsService
      .getCategories({ signal: controller.signal })
      .then((data) => {
        if (!ignore) {
          setCategories(data);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore && err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          setError(err?.message || "Failed to load categories");
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [reloadKey]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch,
  };
}
