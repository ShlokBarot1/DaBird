/**
 * Shop filters use lowercase keys: "hats", "shirts", "bobbles".
 * Shopify "Product type" and Tags often differ (e.g. "T-Shirts", "Hat", "Beanies").
 * This normalizes and matches flexibly so admin does not need exact strings.
 */
const CATEGORY_ALIASES = {
  hats: ['hat', 'hats', 'cap', 'caps', 'bucket', 'visor', 'snapback', 'dad hat', 'headwear'],
  shirts: [
    'shirt',
    'shirts',
    'tee',
    'tees',
    't-shirt',
    'tshirt',
    'top',
    'tops',
    'hoodie',
    'hoodies',
    'hood',
    'sweatshirt',
    'sweat',
    'crew',
    'crewneck',
    'polo',
    'longsleeve',
    'tank',
    'apparel',
    'outerwear',
    'fleece',
    'pullover',
  ],
  bobbles: ['bobble', 'bobbles', 'beanie', 'beanies', 'knit', 'skull', 'winter'],
};

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function tokens(s) {
  return norm(s)
    .split(/[\s,/&]+/)
    .map((t) => t.replace(/[^a-z0-9-]/g, ''))
    .filter(Boolean);
}

function haystackMatches(haystack, needles) {
  const h = norm(haystack);
  if (!h) return false;
  return needles.some((n) => {
    if (!n) return false;
    if (h === n) return true;
    if (h.includes(n) || n.includes(h)) return true;
    const ht = tokens(h);
    const nt = tokens(n);
    return nt.some((t) => ht.includes(t)) || ht.some((t) => nt.includes(t));
  });
}

/**
 * @param {{ productType?: string, tags?: string[] }} product
 * @param {string} filterKey e.g. "all products", "hats"
 */
export function productMatchesShopCategory(product, filterKey) {
  const key = norm(filterKey);
  if (!key || key === 'all products') return true;

  const type = norm(product.productType);
  const tags = (product.tags || []).map(norm);

  const needles = [key, ...(CATEGORY_ALIASES[key] || [])].filter(Boolean);

  if (haystackMatches(type, needles)) return true;
  return tags.some((tag) => haystackMatches(tag, needles));
}
