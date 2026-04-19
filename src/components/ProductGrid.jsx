import { useRef, useState, useEffect } from 'react';
import { fallbackProductVisuals } from '../lib/siteImages';
import './ProductGrid.css';

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: 'DB SIGNATURE HOODIE [BLUE/WHITE]',
    code: '(DB-HOOD_B)',
    price: '$ 120.00',
    handle: '',
    tags: [],
    image: fallbackProductVisuals[0].image,
    hoverImage: fallbackProductVisuals[0].hoverImage,
  },
  {
    id: 2,
    title: 'DB MONOGRAM TEE [WHITE/BLUE]',
    code: '(DB-TEE_W)',
    price: '$ 65.00',
    handle: '',
    tags: [],
    image: fallbackProductVisuals[1].image,
    hoverImage: fallbackProductVisuals[1].hoverImage,
  },
  {
    id: 3,
    title: 'DB FLIGHT BEANIE [GREY]',
    code: '(DB-BEAN_G)',
    price: '$ 45.00',
    handle: '',
    tags: [],
    image: fallbackProductVisuals[2].image,
    hoverImage: fallbackProductVisuals[2].hoverImage,
  },
  {
    id: 4,
    title: 'DB ESSENTIALS SWEATPANTS',
    code: '(DB-PANT_BLK)',
    price: '$ 95.00',
    handle: '',
    tags: [],
    image: fallbackProductVisuals[3].image,
    hoverImage: fallbackProductVisuals[3].hoverImage,
  },
];

function mapNodeToCard(node) {
  return {
    id: node.id,
    title: node.title.toUpperCase(),
    code: `(${node.handle?.toUpperCase().replace(/-/g, '_') || ''})`,
    handle: node.handle,
    price: `$ ${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}`,
    image: node.images.edges[0]?.node.url || '',
    hoverImage: node.images.edges[1]?.node.url || node.images.edges[0]?.node.url || '',
    tags: (node.tags || []).map((t) => String(t).toLowerCase()),
  };
}

function excludeByHandles(products, excludeHandles) {
  if (!excludeHandles?.length) return products;
  const set = new Set(excludeHandles.filter(Boolean));
  return products.filter((p) => !set.has(p.handle));
}

const ProductGrid = ({
  title = 'featured products',
  isStatic = false,
  /** Home carousel: use VITE_SHOPIFY_FEATURED_COLLECTION or tag "featured" (override via VITE_SHOPIFY_FEATURED_TAG). */
  featuredOnly = false,
  excludeHandles = [],
}) => {
  const sectionRef = useRef(null);
  const [shouldFetchProducts, setShouldFetchProducts] = useState(false);
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const excludeKey = excludeHandles.join('|');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!('IntersectionObserver' in window)) {
      setShouldFetchProducts(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldFetchProducts(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldFetchProducts) return;

    const excludedHandles = excludeKey ? excludeKey.split('|') : [];
    const featuredCollection = import.meta.env.VITE_SHOPIFY_FEATURED_COLLECTION?.trim();
    const featuredTag = (import.meta.env.VITE_SHOPIFY_FEATURED_TAG || 'featured').toLowerCase();

    const applyFeatured = (list) => {
      if (!featuredOnly) return list;
      if (featuredCollection) return list;
      const tagged = list.filter((p) =>
        p.tags.some((t) => t === featuredTag || t.includes(featuredTag))
      );
      return tagged.length ? tagged : list;
    };

    const fetchProducts = async () => {
      try {
        const [{ shopifyClient }, queries] = await Promise.all([
          import('../lib/shopify'),
          import('../lib/queries'),
        ]);
        const { GET_PRODUCTS_QUERY, GET_COLLECTION_PRODUCTS_QUERY } = queries;

        if (featuredOnly && featuredCollection) {
          const { data } = await shopifyClient.request(GET_COLLECTION_PRODUCTS_QUERY, {
            variables: { handle: featuredCollection, first: 24 },
          });
          const edges = data?.collection?.products?.edges;
          if (edges?.length) {
            const mapped = excludeByHandles(
              edges.map(({ node }) => mapNodeToCard(node)),
              excludedHandles
            );
            if (mapped.length > 0) {
              setProducts(mapped);
              return;
            }
          }
          console.warn(
            `[ProductGrid] Collection "${featuredCollection}" missing or empty; using catalog + featured tag instead.`
          );
        }

        const { data } = await shopifyClient.request(GET_PRODUCTS_QUERY);
        let mapped = data.products.edges.map(({ node }) => mapNodeToCard(node));
        mapped = excludeByHandles(mapped, excludedHandles);
        mapped = applyFeatured(mapped);
        if (mapped.length > 0) setProducts(mapped);
      } catch (err) {
        console.error('Featured products fetch failed, using fallback:', err);
      }
    };

    fetchProducts();
  }, [featuredOnly, excludeKey, shouldFetchProducts]);

  const [isPaused, setIsPaused] = useState(false);

  const displayProducts = isStatic ? products.slice(0, 4) : [...products, ...products];

  return (
    <section id="shop" ref={sectionRef} className="product-section">
      <div className="section-header">
        <h2 className="featured-title">{title}</h2>
      </div>

      {isStatic ? (
        <div className="static-grid-container">
          {displayProducts.map((product, index) => (
            <div
              key={`static-${product.id}-${index}`}
              className="carousel-card static-card"
              onClick={() => (window.location.hash = `#product/${product.handle || ''}`)}
              style={{ cursor: product.handle ? 'pointer' : 'default' }}
            >
              <div className="card-image-wrapper">

                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="product-base-img" 
                  loading="lazy"
                />
                <img 
                  src={product.hoverImage} 
                  alt={product.title} 
                  className="product-hover-img" 
                  loading="lazy"
                />

                <div className="card-info-overlay">
                  <h4 className="card-info-title">{product.title}</h4>
                  <span className="card-info-price">{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="carousel-container">
          <div className={`carousel-track${isPaused ? ' paused' : ''}`}>
            {displayProducts.map((product, index) => (
              <div
                key={`carousel-${product.id}-${index}`}
                className="carousel-card"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onClick={() => (window.location.hash = `#product/${product.handle || ''}`)}
                style={{ cursor: product.handle ? 'pointer' : 'default' }}
              >
                <div className="card-image-wrapper">

                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="product-base-img" 
                    loading="lazy"
                  />
                  <img 
                    src={product.hoverImage} 
                    alt={product.title} 
                    className="product-hover-img" 
                    loading="lazy"
                  />

                  <div className="card-info-overlay">
                    <h4 className="card-info-title">{product.title}</h4>
                    <span className="card-info-price">{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
