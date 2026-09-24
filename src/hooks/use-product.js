"use client";

import { useState, useEffect, useCallback } from "react";
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
  } = useLocalProducts();

  const [apiProduct, setApiProduct] = useState(null);
  const [isLoadingApi, setIsLoadingApi] = useState(true);
  const [isApiNotFound, setIsApiNotFound] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Derive local overlay statuses purely
  const isDeleted = Boolean(id && isProductDeleted(id));
  const locallyAdded = id ? getLocallyAddedProduct(id) : null;
  const isInvalidId = !id;

  const shouldFetchFromApi = Boolean(id && !isDeleted && !locallyAdded);

  useEffect(() => {
    if (!shouldFetchFromApi) {
      return;
    }

    let ignore = false;
    const controller = new AbortController();

    productsService
      .getProductById(id, { delay }, { signal: controller.signal })
      .then((data) => {
        if (!ignore) {
          if (!data || !data.id) {
            setIsApiNotFound(true);
            setApiProduct(null);
          } else {
            setApiProduct(data);
            setIsApiNotFound(false);
            setApiError(null);
          }
          setIsLoadingApi(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
            return;
          }
          if (err?.status === 404) {
            setIsApiNotFound(true);
            setApiProduct(null);
          } else {
            setApiError(err?.message || "Failed to load product details");
          }
          setIsLoadingApi(false);
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id, delay, shouldFetchFromApi, reloadKey]);

  const refetch = useCallback(() => {
    setIsLoadingApi(true);
    setReloadKey((k) => k + 1);
  }, []);

  // Compute final product and status
  if (isInvalidId || isDeleted) {
    return {
      product: null,
      isLoading: false,
      isNotFound: true,
      error: null,
      refetch,
    };
  }

  if (locallyAdded) {
    return {
      product: locallyAdded,
      isLoading: false,
      isNotFound: false,
      error: null,
      refetch,
    };
  }

  const overlaidProduct = apiProduct ? getProductWithOverlay(apiProduct) : null;

  return {
    product: overlaidProduct,
    isLoading: isLoadingApi,
    isNotFound: isApiNotFound || (!isLoadingApi && !overlaidProduct),
    error: apiError,
    refetch,
  };
}
