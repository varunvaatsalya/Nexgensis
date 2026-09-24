"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { productsService } from "@/services/products.service";
import { useLocalProducts } from "@/store/local-products";

/**
 * Custom hook to fetch and manage products list with race condition guards,
 * server-side pagination, debounced search, category filter, and local overlay store.
 * 
 * @param {object} params - { page, limit, q, category, sortBy, order, delay }
 */
export function useProducts({
  page = 1,
  limit = 10,
  q = "",
  category = "",
  sortBy = "",
  order = "asc",
  delay = 0,
} = {}) {
  const { applyOverlayToList } = useLocalProducts();

  const [rawProducts, setRawProducts] = useState([]);
  const [rawTotal, setRawTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  // References for strict race condition guards
  const abortControllerRef = useRef(null);
  const latestRequestIdRef = useRef(0);

  const fetchProducts = useCallback(
    async (signal, requestId) => {
      const skip = Math.max(0, (page - 1) * limit);

      try {
        let result;
        const options = { signal };
        const queryPayload = { limit, skip, sortBy, order, delay };

        if (q && q.trim()) {
          result = await productsService.searchProducts(
            { ...queryPayload, q: q.trim() },
            options
          );
        } else if (category && category.trim()) {
          result = await productsService.getProductsByCategory(
            { ...queryPayload, category: category.trim() },
            options
          );
        } else {
          result = await productsService.getProducts(queryPayload, options);
        }

        // Strict race condition check: ignore if this is not the latest request
        if (requestId === latestRequestIdRef.current) {
          setRawProducts(result?.products || []);
          setRawTotal(result?.total || 0);
          setError(null);
          setIsLoading(false);
          setIsFetching(false);
        }
      } catch (err) {
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
          return;
        }

        if (requestId === latestRequestIdRef.current) {
          setError(err?.message || "Failed to load products. Please check your network and try again.");
          setIsLoading(false);
          setIsFetching(false);
        }
      }
    },
    [page, limit, q, category, sortBy, order, delay]
  );

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentRequestId = ++latestRequestIdRef.current;

    fetchProducts(controller.signal, currentRequestId);

    return () => {
      controller.abort();
    };
  }, [fetchProducts]);

  // Compute merged products and adjusted total from local overlay store
  const { products, total } = applyOverlayToList(rawProducts, rawTotal, {
    page,
    limit,
    q,
    category,
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const refetch = useCallback(() => {
    setIsFetching(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentRequestId = ++latestRequestIdRef.current;
    return fetchProducts(controller.signal, currentRequestId);
  }, [fetchProducts]);

  return {
    products,
    total,
    rawTotal,
    totalPages,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}
