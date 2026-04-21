import { useState, useEffect, lazy, Suspense } from 'react';
import ReactPixelModule from 'react-facebook-pixel';
const ReactPixel = ReactPixelModule.default || ReactPixelModule;
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { useCart } from './lib/cart';
import useLenis from './hooks/useLenis';
import './App.css';

// Lazy loaded components for better initial performance
const CartDrawer = lazy(() => import('./components/CartDrawer'));
const HomeHighlights = lazy(() => import('./components/HomeHighlights'));
const CertificateSection = lazy(() => import('./components/CertificateSection'));
const UGCSection = lazy(() => import('./components/UGCSection'));
const ReviewsSection = lazy(() => import('./components/ReviewsSection'));
const ProductGrid = lazy(() => import('./components/ProductGrid'));
const Shop = lazy(() => import('./components/Shop'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const Contact = lazy(() => import('./components/Contact'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const DataPolicy = lazy(() => import('./components/DataPolicy'));
const TermsAndConditions = lazy(() => import('./components/TermsAndConditions'));

const LoadingFallback = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textTransform: 'lowercase', opacity: 0.5 }}>
    loading...
  </div>
);

function App() {
  useLenis();
  
  const [page, setPage] = useState('home');
  const [loadBelowFold, setLoadBelowFold] = useState(false);
  const [loadHomeGrid, setLoadHomeGrid] = useState(false);
  const { cartOpen } = useCart();

  // ✅ Initialize Meta Pixel ONCE on app load
  useEffect(() => {
    ReactPixel.init('905842039006113');
  }, []);

  // ✅ Fire PageView on every page/route change
  useEffect(() => {
    ReactPixel.pageView();
  }, [page]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product')) {
        setPage('product');
      } else if (hash === '#shop') {
        setPage('shop');
      } else if (hash === '#about') {
        setPage('about');
      } else if (hash === '#contact') {
        setPage('contact');
      } else if (hash === '#privacy') {
        setPage('privacy');
      } else if (hash === '#terms') {
        setPage('terms');
      } else {
        setPage('home');
      }
    };
    
    handleHash(); 
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const load = () => setLoadHomeGrid(true);
    const idleId = window.setTimeout(load, 8000);

    window.addEventListener('scroll', load, { once: true, passive: true });
    window.addEventListener('wheel', load, { once: true, passive: true });
    window.addEventListener('touchstart', load, { once: true, passive: true });

    return () => {
      window.clearTimeout(idleId);
      window.removeEventListener('scroll', load);
      window.removeEventListener('wheel', load);
      window.removeEventListener('touchstart', load);
    };
  }, []);

  useEffect(() => {
    const load = () => setLoadBelowFold(true);
    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 2500 })
      : window.setTimeout(load, 1200);

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      {cartOpen && (
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>
      )}
      <main>
        <Suspense fallback={<LoadingFallback />}>
          {page === 'home' && (
            <div className="page-shell">
              <Hero />
              <div className="home-grid-sentinel">
                {loadHomeGrid && (
                  <Suspense fallback={null}>
                    <ProductGrid featuredOnly />
                  </Suspense>
                )}
              </div>
              {loadBelowFold && (
                <Suspense fallback={null}>
                  <CertificateSection />
                  <div style={{ paddingBottom: '15vh' }}></div>
                  <HomeHighlights />
                  <UGCSection />
                  <ReviewsSection />
                </Suspense>
              )}
            </div>
          )}
          {page === 'shop' && (
            <div className="page-shell">
              <Shop />
              <Suspense fallback={null}>
                <ProductGrid />
              </Suspense>
            </div>
          )}
          {page === 'product' && (
            <div className="page-shell">
              <ProductDetail />
            </div>
          )}
          {page === 'about' && (
            <div className="page-shell">
              <AboutUs />
            </div>
          )}
          {page === 'contact' && (
            <div className="page-shell">
              <Contact />
            </div>
          )}
          {page === 'privacy' && (
            <div className="page-shell">
              <DataPolicy />
            </div>
          )}
          {page === 'terms' && (
            <div className="page-shell">
              <TermsAndConditions />
            </div>
          )}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
