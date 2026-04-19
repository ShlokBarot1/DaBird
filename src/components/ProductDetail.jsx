import { useState, useRef, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import { AnimatePresence, motion } from 'framer-motion';
import SizeChartModal from './SizeChartModal';
import { shopifyClient } from '../lib/shopify';
import { GET_PRODUCT_BY_HANDLE_QUERY } from '../lib/queries';
import { useCart } from '../lib/cart';
import './ProductDetail.css';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [openAccordion, setOpenAccordion] = useState(null);
  const [cartText, setCartText] = useState('ADD TO CART');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const { addToCart } = useCart();

  // Ref on the inline CTA buttons — when they scroll out of view, show sticky bar
  const inlineCtaRef = useRef(null);
  const pdLeftRef = useRef(null);
  const imageRefs = useRef([]);

  const getHandleFromHash = () => {
    const hash = window.location.hash;
    const parts = hash.split('/');
    return (parts[1] || '').split('?')[0]?.trim() || '';
  };

  const [productHandle, setProductHandle] = useState(getHandleFromHash);

  useEffect(() => {
    const sync = () => setProductHandle(getHandleFromHash());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      if (!productHandle) {
        setProduct(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setProduct(null);
      setOpenAccordion(null);
      imageRefs.current = [];

      try {
        const { data } = await shopifyClient.request(GET_PRODUCT_BY_HANDLE_QUERY, {
          variables: { handle: productHandle },
        });

        if (cancelled) return;

        if (data.productByHandle) {
          const p = data.productByHandle;
          const variants = p.variants.edges.map(({ node }) => ({
            id: node.id,
            title: node.title,
            available: node.availableForSale,
            price: node.price.amount,
            imageUrl: node.image?.url || null,
            colorHex: node.colorHex?.value || null,
            options: node.selectedOptions.reduce((acc, opt) => {
              acc[opt.name.toLowerCase()] = opt.value.toLowerCase();
              return acc;
            }, {}),
          }));

          const colorHexMap = {};
          variants.forEach(v => {
            if (v.options.color && v.colorHex) {
              colorHexMap[v.options.color] = v.colorHex;
            }
          });

          const optionMap = {};
          variants.forEach(v => {
            Object.entries(v.options).forEach(([name, value]) => {
              if (!optionMap[name]) optionMap[name] = new Set();
              optionMap[name].add(value);
            });
          });

          const options = {};
          Object.entries(optionMap).forEach(([name, values]) => {
            options[name] = [...values];
          });

          const productData = {
            id: p.id,
            title: p.title,
            handle: p.handle,
            description: p.description,
            descriptionHtml: p.descriptionHtml,
            price: parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2),
            images: p.images.edges.map(({ node }) => node.url),
            variants,
            options,
            colorHexMap,
          };

          setProduct(productData);

          const firstAvailable = variants.find(v => v.available) || variants[0];
          if (firstAvailable) {
            setSelectedOptions(firstAvailable.options);
            setSelectedVariant(firstAvailable);
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [productHandle]);

  // Update selected variant when options change
  useEffect(() => {
    if (!product) return;
    const match = product.variants.find(v =>
      Object.entries(selectedOptions).every(([key, val]) => v.options[key] === val)
    );
    if (match) setSelectedVariant(match);
  }, [selectedOptions, product]);

  // Scroll to variant image when variant changes
  useEffect(() => {
    if (loading || !product) return;

    const scrollHandler = () => {
      if (selectedVariant?.imageUrl && pdLeftRef.current) {
        const idx = product.images.findIndex(imgUrl => imgUrl === selectedVariant.imageUrl);

        if (idx !== -1 && imageRefs.current[idx]) {
          const targetImg = imageRefs.current[idx];
          const container = pdLeftRef.current;

          if (window.innerWidth <= 1024) {
            container.scrollTo({
              left: targetImg.offsetLeft,
              behavior: 'smooth'
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            targetImg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    };

    // Use a small timeout to ensure DOM elements (imageRefs) are populated after render
    const timer = setTimeout(scrollHandler, 100);
    return () => clearTimeout(timer);
  }, [selectedVariant, product, loading]);

  useEffect(() => {
    const el = inlineCtaRef.current;
    if (!el || loading) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, product?.id]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setCartText('ADDING...');
    await addToCart(selectedVariant.id, 1);
    setCartText('ADDED TO CART!');
    setTimeout(() => setCartText('ADD TO CART'), 2000);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    setCartText('REDIRECTING...');
    const next = await addToCart(selectedVariant.id, 1, { openDrawer: false });
    if (next?.checkoutUrl) {
      window.location.href = next.checkoutUrl;
      return;
    }
    setCartText('ADD TO CART');
  };

  const toggleAccordion = (name) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  const handleOptionChange = (optionName, value) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const handleScrollDots = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const active = Math.round(scrollLeft / width);
    setActiveSlide(active);
  };

  if (loading) {
    return <div className="product-detail-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><p>loading product...</p></div>;
  }

  if (!product) {
    return <div className="product-detail-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><p>product not found</p></div>;
  }

  return (
    <>
      <div className="product-detail-page">
        <div className="pd-left-container">
          <div className="pd-left" onScroll={handleScrollDots} ref={pdLeftRef}>
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.title} - image ${i + 1}`}
                className="pd-slider-img"
                ref={el => imageRefs.current[i] = el}
                loading={i < 2 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            ))}
          </div>
          <div className="pd-carousel-dots">
            {product.images.map((_, i) => (
              <span key={i} className={`pd-dot ${activeSlide === i ? 'active' : ''}`} />
            ))}
          </div>
        </div>

        <div className="pd-right">
          <div className="pd-info-sticky">
            <div className="pd-header">
              <div className="pd-title-wrapper">
                <h1 className="pd-title">{product.title}</h1>
                <div className="pd-reviews-brief">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                    ))}
                  </div>
                  <span>4.9 (120+ reviews)</span>
                </div>
              </div>
              <div className="pd-price-wrapper">
                <span className="pd-price">$ {selectedVariant?.price ? parseFloat(selectedVariant.price).toFixed(2) : product.price}</span>
                <span className="pd-urgency-tag">SELLING FAST</span>
              </div>
            </div>

            {product.descriptionHtml ? (
              <div className="pd-description" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            ) : (
              <p className="pd-description">{product.description}</p>
            )}


            <div className="pd-options-container">
              {/* Dynamically render options from Shopify (color, size, etc.) */}
              {Object.entries(product.options).map(([optionName, values]) => {
                if (optionName.toLowerCase() === 'title') return null;
                return (
                  <div className="pd-option-group" key={optionName}>
                    <div className="option-header-row">
                      <span className="option-label">{optionName.toUpperCase()}: {selectedOptions[optionName] ? selectedOptions[optionName].toUpperCase() : ''}</span>
                      {optionName === 'size' && (
                        <span className="size-guide" style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem' }} onClick={() => setShowSizeChart(true)}>Size Guide</span>
                      )}
                    </div>
                    <div className={optionName === 'color' ? 'color-buttons' : 'size-buttons'}>
                      {values.map(value => {
                        // Check if this option combination has an available variant
                        const testOptions = { ...selectedOptions, [optionName]: value };
                        const matchingVariant = product.variants.find(v =>
                          Object.entries(testOptions).every(([k, val]) => v.options[k] === val)
                        );
                        const isAvailable = matchingVariant?.available !== false;
                        const isSelected = selectedOptions[optionName] === value;

                        if (optionName === 'color') {
                          const customHex = product.colorHexMap?.[value];
                          const backgroundColor = customHex || (value === 'white' ? '#fff' : value === 'black' ? '#000' : value === 'navy' ? '#1a1a5e' : value);

                          return (
                            <button
                              key={value}
                              className={`color-block-btn bg-${value} ${isSelected ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}`}
                              onClick={() => isAvailable && handleOptionChange(optionName, value)}
                              aria-label={value}
                              disabled={!isAvailable}
                              style={{ backgroundColor }}
                            />
                          );
                        }

                        return (
                          <button
                            key={value}
                            className={`size-btn ${isSelected ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}`}
                            onClick={() => isAvailable && handleOptionChange(optionName, value)}
                            disabled={!isAvailable}
                          >
                            {value.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Inline CTA — observed to trigger sticky bar */}
              <div className="add-to-cart-row" ref={inlineCtaRef}>
                <button
                  className={`add-to-cart-btn massive ${cartText !== 'ADD TO CART' && cartText !== 'REDIRECTING...' ? 'success' : ''}`}
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.available || cartText === 'redirecting...'}
                >
                  {selectedVariant?.available === false ? 'SOLD OUT' : cartText}
                </button>
                <button
                  type="button"
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={!selectedVariant?.available || cartText === 'redirecting...'}
                >
                  BUY NOW
                </button>
              </div>

            {/* CRO: Trust Badges */}
            <div className="pd-trust-badges">
              <div className="trust-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 7v9c0 5 9 6 9 6s9-1 9-6V7l-9-5z" /></svg>
                <span>Certified safe & secure checkout</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      {product?.handle ? (
        <ProductGrid
          title="suggested products"
          isStatic
          excludeHandles={[product.handle]}
        />
      ) : null}

      {/* Sticky bottom bar — appears when inline CTA scrolls out of view */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            className="sticky-cart-bar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="sticky-cart-info">
              <img src={selectedVariant?.imageUrl || product.images[0] || ''} alt="product" className="sticky-thumb" />
              <div className="sticky-meta">
                <span className="sticky-name">{product.title}</span>
                <span className="sticky-variant">
                  {Object.values(selectedOptions).join(' · ')}
                </span>
              </div>
            </div>
            <div className="sticky-cart-actions">
              <button
                className={`add-to-cart-btn sticky-btn ${cartText !== 'ADD TO CART' ? 'success' : ''}`}
                onClick={handleAddToCart}
                disabled={!selectedVariant?.available || cartText === 'redirecting...'}
              >
                {selectedVariant?.available === false ? 'SOLD OUT' : cartText}
              </button>
              <button
                className="buy-now-btn sticky-btn"
                onClick={handleBuyNow}
                disabled={!selectedVariant?.available || cartText === 'redirecting...'}
              >
                BUY NOW
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSizeChart && <SizeChartModal onClose={() => setShowSizeChart(false)} />}
      </AnimatePresence>
    </>
  );
};

export default ProductDetail;
