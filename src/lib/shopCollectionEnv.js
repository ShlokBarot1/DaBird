/**
 * Optional: set collection *handles* (URL slug from Shopify admin, not the display title).
 * When set, that shop tab lists exactly what is in the collection — same as Online Store.
 *
 * VITE_SHOPIFY_COLLECTION_HATS=hats
 * VITE_SHOPIFY_COLLECTION_SHIRTS=shirts
 * VITE_SHOPIFY_COLLECTION_BOBBLES=bobbles
 */
export const SHOP_TAB_COLLECTION_HANDLES = {
  hats: import.meta.env.VITE_SHOPIFY_COLLECTION_HATS?.trim() || '',
  shirts: import.meta.env.VITE_SHOPIFY_COLLECTION_SHIRTS?.trim() || '',
  bobbles: import.meta.env.VITE_SHOPIFY_COLLECTION_BOBBLES?.trim() || '',
};
