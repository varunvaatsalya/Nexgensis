import apiClient from "@/lib/axios";

/**
 * Service for Product-related API endpoints on DummyJSON.
 */
export const productsService = {
  /**
   * Fetch paginated list of products.
   */
  async getProducts({ limit = 10, skip = 0, sortBy = "", order = "asc", delay = 0 } = {}, options = {}) {
    const params = { limit, skip };
    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order || "asc";
    }
    if (delay && delay > 0) {
      params.delay = delay;
    }

    const response = await apiClient.get("/products", {
      params,
      signal: options.signal,
    });
    return response.data;
  },

  /**
   * Search products by query keyword.
   */
  async searchProducts({ q = "", limit = 10, skip = 0, sortBy = "", order = "asc", delay = 0 } = {}, options = {}) {
    const params = { q: q.trim(), limit, skip };
    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order || "asc";
    }
    if (delay && delay > 0) {
      params.delay = delay;
    }

    const response = await apiClient.get("/products/search", {
      params,
      signal: options.signal,
    });
    return response.data;
  },

  /**
   * Fetch products by category slug.
   */
  async getProductsByCategory({ category, limit = 10, skip = 0, sortBy = "", order = "asc", delay = 0 } = {}, options = {}) {
    const params = { limit, skip };
    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order || "asc";
    }
    if (delay && delay > 0) {
      params.delay = delay;
    }

    const encodedCategory = encodeURIComponent(category);
    const response = await apiClient.get(`/products/category/${encodedCategory}`, {
      params,
      signal: options.signal,
    });
    return response.data;
  },

  /**
   * Fetch list of all product categories.
   * DummyJSON returns an array of objects [{ slug, name, url }, ...] or string list.
   */
  async getCategories(options = {}) {
    const response = await apiClient.get("/products/categories", {
      signal: options.signal,
    });

    const data = response.data;
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === "string") {
          return {
            slug: item,
            name: item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " "),
          };
        }
        return {
          slug: item.slug || item.name,
          name: item.name || item.slug,
          url: item.url,
        };
      });
    }
    return [];
  },

  /**
   * Fetch single product details by ID.
   */
  async getProductById(id, { delay = 0 } = {}, options = {}) {
    const params = {};
    if (delay && delay > 0) {
      params.delay = delay;
    }

    const response = await apiClient.get(`/products/${id}`, {
      params,
      signal: options.signal,
    });
    return response.data;
  },

  /**
   * Add a new product (DummyJSON POST simulation).
   */
  async addProduct(productData, options = {}) {
    const response = await apiClient.post("/products/add", productData, {
      signal: options.signal,
    });
    return response.data;
  },

  /**
   * Update an existing product (DummyJSON PUT simulation).
   */
  async updateProduct(id, productData, options = {}) {
    const response = await apiClient.put(`/products/${id}`, productData, {
      signal: options.signal,
    });
    return response.data;
  },

  /**
   * Delete a product (DummyJSON DELETE simulation).
   */
  async deleteProduct(id, options = {}) {
    const response = await apiClient.delete(`/products/${id}`, {
      signal: options.signal,
    });
    return response.data;
  },
};
