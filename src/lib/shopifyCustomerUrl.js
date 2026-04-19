/**
 * Customer / account area on the Shopify-hosted storefront.
 * New Customer Accounts redirect to shopify.com/{store-id}/account
 *
 * Store ID confirmed via redirect trace: 97477787952
 * Optional override: VITE_SHOPIFY_ACCOUNT_URL in .env
 */
export function getCustomerAccountUrl() {
  const override = import.meta.env.VITE_SHOPIFY_ACCOUNT_URL?.trim();
  if (override) return override;
  // Shopify New Customer Accounts URL (confirmed via 302 redirect trace)
  return `https://shopify.com/97477787952/account`;
}
