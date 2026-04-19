import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { shopifyClient } from '../lib/shopify';
import { SEARCH_PRODUCTS_QUERY } from '../lib/queries';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setSearched(true);
    const q = query.trim();
    try {
      const searchWith = async (searchQuery) => {
        const { data } = await shopifyClient.request(SEARCH_PRODUCTS_QUERY, {
          variables: { query: searchQuery },
        });
        return data?.products?.edges || [];
      };

      let edges = await searchWith(q);
      if (edges.length === 0) {
        edges = await searchWith(`title:*${q}*`);
      }
      const mapped = edges.map(({ node }) => ({
        id: node.id,
        title: node.title,
        handle: node.handle,
        price: `$ ${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}`,
        image: node.images.edges[0]?.node.url || '',
      }));
      setResults(mapped);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleProductClick = (handle) => {
    onClose();
    setQuery('');
    setResults([]);
    setSearched(false);
    window.location.hash = `#product/${handle}`;
  };

  const handleClose = () => {
    onClose();
    setQuery('');
    setResults([]);
    setSearched(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="search-modal"
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" disabled={searching}>
                {searching ? '...' : '→'}
              </button>
              <button type="button" className="search-close" onClick={handleClose}>✕</button>
            </form>

            {searched && (
              <div className="search-results">
                {results.length === 0 ? (
                  <p className="no-results">no products found for "{query}"</p>
                ) : (
                  results.map((product) => (
                    <div
                      key={product.id}
                      className="search-result-item"
                      onClick={() => handleProductClick(product.handle)}
                    >
                      <div className="search-result-image">
                        <img src={product.image} alt={product.title} />
                      </div>
                      <div className="search-result-info">
                        <span className="search-result-title">{product.title}</span>
                        <span className="search-result-price">{product.price}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
