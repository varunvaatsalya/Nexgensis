export const ALLOWED_PAGE_SIZES = [10, 20, 50];
export const DEFAULT_PAGE_SIZE = 10;
export const ALLOWED_SORT_FIELDS = ["title", "price", "rating", "stock", "id", "discountPercentage"];
export const ALLOWED_SORT_ORDERS = ["asc", "desc"];

/**
 * Parses and sanitizes URL search parameters into a safe, normalized object.
 * 
 * @param {URLSearchParams|object} searchParams - ReadonlyURLSearchParams or plain object
 * @returns {object} Clean sanitized parameters
 */
export function parseProductQueryParams(searchParams) {
  const getParam = (key) => {
    if (!searchParams) return null;
    if (typeof searchParams.get === "function") {
      return searchParams.get(key);
    }
    return searchParams[key] ?? null;
  };

  // 1. Sanitize Page
  const rawPage = getParam("page");
  let page = parseInt(rawPage, 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // 2. Sanitize Limit (Page Size)
  const rawLimit = getParam("limit");
  let limit = parseInt(rawLimit, 10);
  if (isNaN(limit) || !ALLOWED_PAGE_SIZES.includes(limit)) {
    limit = DEFAULT_PAGE_SIZE;
  }

  // 3. Sanitize Search Query 'q'
  const rawQ = getParam("q");
  const q = rawQ ? rawQ.trim() : "";

  // 4. Sanitize Category (Mutually exclusive with search 'q')
  const rawCategory = getParam("category");
  let category = rawCategory ? rawCategory.trim().toLowerCase() : "";
  // If search query is present, category is cleared to satisfy mutual exclusivity
  if (q && category) {
    category = "";
  }

  // 5. Sanitize Sort Field
  const rawSortBy = getParam("sortBy");
  let sortBy = "";
  if (rawSortBy && ALLOWED_SORT_FIELDS.includes(rawSortBy.trim())) {
    sortBy = rawSortBy.trim();
  }

  // 6. Sanitize Sort Order
  const rawOrder = getParam("order");
  let order = "asc";
  if (rawOrder && ALLOWED_SORT_ORDERS.includes(rawOrder.trim().toLowerCase())) {
    order = rawOrder.trim().toLowerCase();
  }

  // 7. Optional debug/testing delay (in ms)
  const rawDelay = getParam("delay");
  let delay = 0;
  if (rawDelay) {
    const parsedDelay = parseInt(rawDelay, 10);
    if (!isNaN(parsedDelay) && parsedDelay > 0 && parsedDelay <= 10000) {
      delay = parsedDelay;
    }
  }

  return {
    page,
    limit,
    q,
    category,
    sortBy,
    order,
    delay,
  };
}

/**
 * Builds a query string from parameters, omitting default or empty values.
 * 
 * @param {object} params 
 * @returns {string} Clean URL search query string (e.g. "?page=2&limit=20")
 */
export function buildProductQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }
  if (params.limit && params.limit !== DEFAULT_PAGE_SIZE && ALLOWED_PAGE_SIZES.includes(Number(params.limit))) {
    searchParams.set("limit", String(params.limit));
  }
  if (params.q && params.q.trim()) {
    searchParams.set("q", params.q.trim());
  } else if (params.category && params.category.trim()) {
    searchParams.set("category", params.category.trim());
  }
  if (params.sortBy && ALLOWED_SORT_FIELDS.includes(params.sortBy)) {
    searchParams.set("sortBy", params.sortBy);
    if (params.order && ALLOWED_SORT_ORDERS.includes(params.order)) {
      searchParams.set("order", params.order);
    }
  }
  if (params.delay && Number(params.delay) > 0) {
    searchParams.set("delay", String(params.delay));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/**
 * Clamp page number between 1 and totalPages.
 */
export function clampPage(page, totalPages) {
  if (totalPages <= 0) return 1;
  if (page < 1) return 1;
  if (page > totalPages) return totalPages;
  return page;
}
