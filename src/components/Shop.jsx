import { useState, useEffect, useMemo } from 'react';
import './Shop.css';
import { shopifyClient } from '../lib/shopify';
import { GET_PRODUCTS_QUERY, GET_COLLECTION_PRODUCTS_QUERY, GET_COLLECTIONS_QUERY } from '../lib/queries';
import { mapProductNodeToShop } from '../lib/shopifyProductMap';
import { fallbackProductVisuals } from '../lib/siteImages';

const [v0, v1, v2, v3] = fallbackProductVisuals;

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: 'db signature hoodie [blue]',
    code: 'db-hood_b',
    price: '$ 120.00',
    tags: ['shirts'],
    productType: 'shirts',
    image: v0.image,
    hoverImage: v0.hoverImage,
  },
  {
    id: 2,
    title: 'db monogram tee [white]',
    code: 'db-tee_w',
    price: '$ 65.00',
    tags: ['shirts'],
    productType: 'shirts',
    image: v1.image,
    hoverImage: v1.hoverImage,
  },
  {
    id: 3,
    title: 'db flight beanie [grey]',
    code: 'db-bean_g',
    price: '$ 45.00',
    tags: ['bobbles'],
    productType: 'bobbles',
    image: v2.image,
    hoverImage: v2.hoverImage,
  },
  {
    id: 4,
    title: 'db essentials tee [navy]',
    code: 'db-tee_n',
    price: '$ 55.00',
    tags: ['shirts'],
    productType: 'shirts',
    image: v3.image,
    hoverImage: v3.hoverImage,
  },
  {
    id: 5,
    title: 'db logo beanie [black]',
    code: 'db-bean_b',
    price: '$ 45.00',
    tags: ['bobbles'],
    productType: 'bobbles',
    image: v0.image,
    hoverImage: v0.hoverImage,
  },
  {
    id: 6,
    title: 'db logo cap [blue]',
    code: 'db-cap_b',
    price: '$ 40.00',
    tags: ['hats'],
    productType: 'hats',
    image: v1.image,
    hoverImage: v1.hoverImage,
  },
];

const ShopCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);


  return (
    <div
      className="shop-card"
      onClick={() => (window.location.hash = `#product/${product.handle || ''}`)}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="shop-image-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={product.image} alt={product.title} className="shop-base-img" />
        <img
          src={product.hoverImage}
          alt={product.title}
          className={`shop-hover-img ${isHovered ? 'visible' : ''}`}
        />
      </div>
      <div className="shop-details">
        <span className="shop-title">{product.title}</span>
        <span className="shop-price">{product.price}</span>
      </div>
    </div>
  );
};

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [collectionByTab, setCollectionByTab] = useState({});
  const [activeFilter, setActiveFilter] = useState('all products');
  const [dynamicFilters, setDynamicFilters] = useState(['all products']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const { data } = await shopifyClient.request(GET_PRODUCTS_QUERY);
        if (cancelled) return;

        const mapped = data.products.edges.map(({ node }) => mapProductNodeToShop(node));
        setAllProducts(mapped);

        // Fetch all collections
        const { data: colsData } = await shopifyClient.request(GET_COLLECTIONS_QUERY, {
          variables: { first: 20 },
        });
        if (cancelled) return;
        
        const collections = colsData?.collections?.edges || [];
        const nextFilters = ['all products'];
        const nextCollections = {};

        await Promise.all(
          collections.map(async ({ node: collection }) => {
            const tabName = collection.title.toLowerCase();
            nextFilters.push(tabName);
            
            try {
              const { data: cdata } = await shopifyClient.request(GET_COLLECTION_PRODUCTS_QUERY, {
                variables: { handle: collection.handle, first: 100 },
              });
              if (cancelled) return;

              const col = cdata?.collection;
              if (col) {
                nextCollections[tabName] = col.products.edges.map(({ node }) => mapProductNodeToShop(node));
              } else {
                nextCollections[tabName] = [];
              }
            } catch (e) {
              console.error(`[Shop] Collection "${collection.handle}" failed:`, e);
              nextCollections[tabName] = [];
            }
          })
        );

        if (!cancelled) {
          setDynamicFilters(nextFilters);
          setCollectionByTab(nextCollections);
        }
      } catch (err) {
        console.error('Failed to fetch products from Shopify, using fallback:', err);
        if (!cancelled) {
          setAllProducts(FALLBACK_PRODUCTS);
          setDynamicFilters(['all products']);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [];
    if (activeFilter === 'all products') {
      list = allProducts;
    } else if (Object.prototype.hasOwnProperty.call(collectionByTab, activeFilter)) {
      list = collectionByTab[activeFilter];
    }
    
    return [...list].sort((a, b) => {
      const isBobbleHead = (p) => {
        const titleText = (p.title || '').toLowerCase();
        const handleText = (p.handle || '').toLowerCase();
        return titleText.includes('bobble head') || 
               titleText.includes('bobblehead') || 
               handleText.includes('bobble-head') || 
               handleText.includes('bobblehead');
      };

      const aIsBobble = isBobbleHead(a);
      const bIsBobble = isBobbleHead(b);

      if (aIsBobble && !bIsBobble) return -1;
      if (!aIsBobble && bIsBobble) return 1;
      return 0;
    });
  }, [activeFilter, allProducts, collectionByTab]);

  return (
    <section id="our-shop" className="shop-section">
      <div className="shop-header">
        <div className="shop-header-left">
          {dynamicFilters.map((filter) => (
            <button
              key={filter}
              className={activeFilter === filter ? 'active' : ''}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="shop-header-center" style={{ justifyContent: 'center' }}>
          <span style={{ fontSize: '1.25rem', textTransform: 'uppercase', color: '#0A2540' }}>Dabird Collection</span>
        </div>
        <div className="shop-header-right">
          <span>({filteredProducts.length})</span>
        </div>
      </div>

      {loading ? (
        <div className="shop-loading">loading products...</div>
      ) : (
        <div className="shop-grid">
          {filteredProducts.map((product) => (
            <ShopCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Shop;
