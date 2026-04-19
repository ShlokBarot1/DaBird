/** Normalize a Storefront API product node into the shape used by Shop / ProductGrid. */
export function mapProductNodeToShop(node) {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    tags: (node.tags || []).map((t) => String(t).toLowerCase()),
    productType: node.productType?.toLowerCase() || '',
    price: `$ ${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}`,
    image: node.images.edges[0]?.node.url || '',
    hoverImage: node.images.edges[1]?.node.url || node.images.edges[0]?.node.url || '',
    variantId: node.variants.edges[0]?.node.id,
  };
}
