"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { productsService } from "@/services/products.service";
import { useLocalProducts } from "@/store/local-products";

/**
 * Custom hook to fetch a single product by ID, with 404 detection and local overlay integration.
 * 
 * @param {string|number} id - The product ID
 * @param {object} [options] - Options such as { delay }
 */
export function useProduct(id, { delay = 0 } = {}) {
  const {
    isProductDeleted,
    getLocallyAddedProduct,
    getProductWithOverlay,
    isInitialized,
  } = useLocalProducts();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setIsNotFound(true);
      setIsLoading(false);
      return;
    }

    // 1. If product is marked as deleted in local overlay
    if (isProductDeleted(id)) {
      setIsNotFound(true);
      setIsLoading(false);
      setProduct(null);
      return;
    }

    // 2. If product is in locally added list
    const locallyAdded = getLocallyAddedProduct(id);
    if (locallyAdded) {
      setProduct(locallyAdded);
      setIsNotFound(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    // 3. Otherwise fetch from API
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setIsNotFound(false);

    try {
      const data = await productsService.getProductById(
        id,
        { delay },
        { signal: controller.signal }
      );

      if (!data || !data.id) {
        setIsNotFound(true);
        setProduct(null);
      } else {
        // Overlay any local edits
        const overlaid = getProductWithOverlay(data);
        if (!overlaid) {
          setIsNotFound(true);
          setProduct(null);
        } else {
          setProduct(overlaid);
          setIsNotFound(false);
        }
      }
    } catch (err) {
      if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
        return;
      }

      if (err?.status === 404) {
        setIsNotFound(true);
        setProduct(null);
      } else {
        setError(err?.message || "Failed to load product details");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, delay, isProductDeleted, getLocallyAddedProduct, getProductWithOverlay]);

  useEffect(() => {
    if (isInitialized) {
      fetchProduct();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProduct, isInitialized]);

  return {
    product,
    isLoading: isLoading || !isInitialized,
    isNotFound,
    error,
    refetch: fetchProduct,
  };
}
