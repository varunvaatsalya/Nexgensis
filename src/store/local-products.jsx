"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const STORAGE_KEY = "nexgensis_local_products_overlay_v1";

const DEFAULT_OVERLAY = {
  added: [],
  edited: {},
  deleted: [],
};

const LocalProductsContext = createContext(null);

export function LocalProductsProvider({ children }) {
  // Use lazy initializer function to read initial state safely
  const [overlay, setOverlay] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error("Failed to parse local products from localStorage", e);
      }
    }
    return DEFAULT_OVERLAY;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
    } catch (e) {
      console.error("Failed to save local products to localStorage", e);
    }
  }, [overlay]);

  /**
   * Add a newly created product to the local overlay.
   */
  const addLocalProduct = useCallback((productData) => {
    const localId = productData.id || 900000 + (Date.now() % 100000);
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
      const newAdded = prev.added.filter((p) => String(p.id) !== normalizedId);
      const newEdited = { ...prev.edited };
      delete newEdited[normalizedId];

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
      let filteredApi = apiProducts
        .filter((item) => !overlay.deleted.includes(String(item.id)))
        .map((item) => {
          const edited = overlay.edited[String(item.id)];
          return edited ? { ...item, ...edited, isEdited: true } : item;
        });

      let matchingAdded = overlay.added.filter((p) => {
        if (overlay.deleted.includes(String(p.id))) return false;

        if (category && p.category && p.category.toLowerCase() !== category.toLowerCase()) {
          return false;
        }

        if (q) {
          const query = q.toLowerCase();
          const titleMatch = p.title && p.title.toLowerCase().includes(query);
          const descMatch = p.description && p.description.toLowerCase().includes(query);
          const brandMatch = p.brand && p.brand.toLowerCase().includes(query);
          if (!titleMatch && !descMatch && !brandMatch) return false;
        }

        return true;
      });

      const deletedFromApiCount = overlay.deleted.filter(
        (delId) => !overlay.added.some((p) => String(p.id) === String(delId))
      ).length;

      const adjustedTotal = Math.max(0, apiTotal + matchingAdded.length - deletedFromApiCount);

      let mergedProducts = [...filteredApi];
      if (page === 1 && matchingAdded.length > 0) {
        mergedProducts = [...matchingAdded, ...filteredApi];
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

  const clearLocalOverlay = useCallback(() => {
    setOverlay(DEFAULT_OVERLAY);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const value = useMemo(
    () => ({
      overlay,
      isInitialized: true,
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
