"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const STORAGE_KEY = "nexgensis_local_products_overlay_v1";

const LocalProductsContext = createContext(null);

export function LocalProductsProvider({ children }) {
  const [overlay, setOverlay] = useState({
    added: [], // array of locally added product objects
    edited: {}, // map of id -> edited product fields
    deleted: [], // array of deleted product IDs (strings or numbers)
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setOverlay(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load local products overlay from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync to localStorage on change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
    } catch (e) {
      console.error("Failed to save local products overlay to localStorage", e);
    }
  }, [overlay, isInitialized]);

  /**
   * Add a newly created product to the local overlay.
   */
  const addLocalProduct = useCallback((productData) => {
    const localId = productData.id || 900000 + Date.now() % 100000;
    const newProduct = {
      ...productData,
      id: localId,
      isLocal: true,
      createdAt: new Date().toISOString(),
    };

    setOverlay((prev) => ({
      ...prev,
      added: [newProduct, ...prev.added.filter((p) => p.id !== localId)],
    }));

    return newProduct;
  }, []);

  /**
   * Update an existing product in the local overlay.
   */
  const updateLocalProduct = useCallback((id, updatedData) => {
    const normalizedId = String(id);

    setOverlay((prev) => {
      // Check if product is in 'added' array
      const existingAddedIndex = prev.added.findIndex((p) => String(p.id) === normalizedId);
      if (existingAddedIndex >= 0) {
        const newAdded = [...prev.added];
        newAdded[existingAddedIndex] = {
          ...newAdded[existingAddedIndex],
          ...updatedData,
        };
        return {
          ...prev,
          added: newAdded,
        };
      }

      // Otherwise record in edited map
      const currentEdited = prev.edited[normalizedId] || {};
      return {
        ...prev,
        edited: {
          ...prev.edited,
          [normalizedId]: {
            ...currentEdited,
            ...updatedData,
          },
        },
      };
    });
  }, []);

  /**
   * Mark a product as deleted in the local overlay.
   */
  const deleteLocalProduct = useCallback((id) => {
    const normalizedId = String(id);

    setOverlay((prev) => {
      // Remove from added if it was locally created
      const newAdded = prev.added.filter((p) => String(p.id) !== normalizedId);
      
      // Clean up from edited
      const newEdited = { ...prev.edited };
      delete newEdited[normalizedId];

      // Add to deleted if not already there
      const newDeleted = prev.deleted.includes(normalizedId)
        ? prev.deleted
        : [...prev.deleted, normalizedId];

      return {
        added: newAdded,
        edited: newEdited,
        deleted: newDeleted,
      };
    });
  }, []);

  /**
   * Check if a product ID has been locally deleted.
   */
  const isProductDeleted = useCallback(
    (id) => {
      return overlay.deleted.includes(String(id));
    },
    [overlay.deleted]
  );

  /**
   * Get single product merged with local overlay.
   */
  const getProductWithOverlay = useCallback(
    (apiProduct) => {
      if (!apiProduct) return null;
      const idStr = String(apiProduct.id);

      if (overlay.deleted.includes(idStr)) {
        return null;
      }

      const editedData = overlay.edited[idStr];
      if (editedData) {
        return { ...apiProduct, ...editedData, isEdited: true };
      }

      return apiProduct;
    },
    [overlay]
  );

  /**
   * Look up a product from the locally added list by ID.
   */
  const getLocallyAddedProduct = useCallback(
    (id) => {
      return overlay.added.find((p) => String(p.id) === String(id)) || null;
    },
    [overlay.added]
  );

  /**
   * Apply local overlay (added, edited, deleted) onto API products list and calculate adjusted total.
   */
  const applyOverlayToList = useCallback(
    (apiProducts = [], apiTotal = 0, { page = 1, limit = 10, q = "", category = "" } = {}) => {
      // 1. Filter out deleted products from API response
      let filteredApi = apiProducts
        .filter((item) => !overlay.deleted.includes(String(item.id)))
        .map((item) => {
          const edited = overlay.edited[String(item.id)];
          return edited ? { ...item, ...edited, isEdited: true } : item;
        });

      // 2. Find matching locally added products
      let matchingAdded = overlay.added.filter((p) => {
        // If deleted locally, exclude
        if (overlay.deleted.includes(String(p.id))) return false;

        // If category filter is active, check match
        if (category && p.category && p.category.toLowerCase() !== category.toLowerCase()) {
          return false;
        }

        // If search query is active, check match
        if (q) {
          const query = q.toLowerCase();
          const titleMatch = p.title && p.title.toLowerCase().includes(query);
          const descMatch = p.description && p.description.toLowerCase().includes(query);
          const brandMatch = p.brand && p.brand.toLowerCase().includes(query);
          if (!titleMatch && !descMatch && !brandMatch) return false;
        }

        return true;
      });

      // 3. Compute adjusted total
      // Count how many deleted items belonged to API
      const deletedFromApiCount = overlay.deleted.filter(
        (delId) => !overlay.added.some((p) => String(p.id) === String(delId))
      ).length;

      const adjustedTotal = Math.max(0, apiTotal + matchingAdded.length - deletedFromApiCount);

      // 4. If on page 1 and no search/category or items match, prepend locally added items
      let mergedProducts = [...filteredApi];
      if (page === 1 && matchingAdded.length > 0) {
        // Prepend added products to top of page 1
        mergedProducts = [...matchingAdded, ...filteredApi];
        // Slice to limit for clean page sizing if desired, but showing added at top
        if (mergedProducts.length > limit) {
          mergedProducts = mergedProducts.slice(0, limit);
        }
      }

      return {
        products: mergedProducts,
        total: adjustedTotal,
        addedCount: matchingAdded.length,
      };
    },
    [overlay]
  );

  /**
   * Reset local storage overlay.
   */
  const clearLocalOverlay = useCallback(() => {
    setOverlay({ added: [], edited: {}, deleted: [] });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const value = useMemo(
    () => ({
      overlay,
      isInitialized,
      addLocalProduct,
      updateLocalProduct,
      deleteLocalProduct,
      isProductDeleted,
      getProductWithOverlay,
      getLocallyAddedProduct,
      applyOverlayToList,
      clearLocalOverlay,
    }),
    [
      overlay,
      isInitialized,
      addLocalProduct,
      updateLocalProduct,
      deleteLocalProduct,
      isProductDeleted,
      getProductWithOverlay,
      getLocallyAddedProduct,
      applyOverlayToList,
      clearLocalOverlay,
    ]
  );

  return (
    <LocalProductsContext.Provider value={value}>
      {children}
    </LocalProductsContext.Provider>
  );
}

export function useLocalProducts() {
  const context = useContext(LocalProductsContext);
  if (!context) {
    throw new Error("useLocalProducts must be used within a LocalProductsProvider");
  }
  return context;
}
