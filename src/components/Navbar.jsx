import { lazy, Suspense, useState, useEffect } from 'react';
import { useCart } from '../lib/cart';
import './Navbar.css';

const JoinFamModal = lazy(() => import('./JoinFamModal'));
const SearchModal = lazy(() => import('./SearchModal'));
const AuthModal = lazy(() => import('./AuthModal'));
const ConfirmModal = lazy(() => import('./ConfirmModal'));

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#home');
  const [navTheme, setNavTheme] = useState('white');
  const [showJoinFam, setShowJoinFam] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [customer, setCustomer] = useState(null);
  const { cart, setCartOpen } = useCart();

  useEffect(() => {
    let cancelled = false;

    const loadCustomer = async () => {
      const { getCustomer } = await import('../lib/customerAuth');
      if (!cancelled) {
        getCustomer().then((currentCustomer) => {
          if (!cancelled) setCustomer(currentCustomer);
        });
      }
    };

    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(loadCustomer, { timeout: 2500 })
      : window.setTimeout(loadCustomer, 1500);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash || '#home');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isActive = (path) => {
    if (path === '#shop' && currentHash.startsWith('#product')) return 'active';
    if (path === '#home' && currentHash === '') return 'active';
    return currentHash === path ? 'active' : '';
  };

  // Intelligent overlay listener to toggle theme color based on background proximity and Menu State
  useEffect(() => {
    let rafId;
    const updateHeaderState = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);

      const hash = window.location.hash || '#home';

      if (menuOpen) {
        setNavTheme('blue');
      } else if (hash === '#home') {
        if (scrollY < window.innerHeight - 80) {
          setNavTheme('white');
        } else {
          setNavTheme('blue');
        }
      } else {
        setNavTheme('blue');
      }
    };

    const handleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateHeaderState);
    };

    window.addEventListener('scroll', handleUpdate);
    window.addEventListener('hashchange', handleUpdate);
    window.addEventListener('resize', handleUpdate);

    updateHeaderState();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('hashchange', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [menuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  const handleLoginClick = () => {
    if (customer) {
      setShowSignOutConfirm(true);
    } else {
      setAuthOpen(true);
    }
  };

  const handleSignOut = async () => {
    const { logoutCustomer } = await import('../lib/customerAuth');
    logoutCustomer().then(() => {
      setCustomer(null);
      setShowSignOutConfirm(false);
    });
  };

  return (
    <>
      <div className={`announcement-bar ${scrolled ? 'hidden' : ''}`}>
        <span>FREE US SHIPPING ON ALL ORDERS OVER $80</span>
      </div>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''} theme-${navTheme}`}>
        <div className="navbar-container">
          <div className="navbar-logo">
            <a href="/">Da Bird</a>
          </div>

          <div className="navbar-center" onClick={() => setMenuOpen(true)}>
            <div className="hamburger-lines">
              <div className="menu-line-top"></div>
              <div className="menu-line-bottom"></div>
            </div>
            <span className="menu-hover-text">MENU</span>
          </div>

          <div className="navbar-right">
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button className="icon-btn" aria-label="Profile" onClick={handleLoginClick}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            <button className="icon-btn cart-icon-btn" aria-label="Cart" onClick={() => setCartOpen(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cart.totalQuantity > 0 && (
                <span className="cart-badge">{cart.totalQuantity}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="dropdown-menu">
          <div className="menu-top">
            <div className="menu-links">
              <a href="#home" onClick={() => setMenuOpen(false)} className={isActive('#home')}>HOME</a>
              <a href="#about" onClick={() => setMenuOpen(false)} className={isActive('#about')}>ABOUT US</a>
              <a href="#shop" onClick={() => setMenuOpen(false)} className={isActive('#shop')}>OUR SHOP</a>
              <a href="#contact" onClick={() => setMenuOpen(false)} className={isActive('#contact')}>CONTACT</a>
            </div>

            <div className="menu-close-container">
              <button className="close-btn" onClick={() => setMenuOpen(false)}>CLOSE</button>
            </div>
          </div>

          <div className="menu-bottom">
            <div className="menu-bottom-center">
              <a href="#" onClick={(e) => { e.preventDefault(); setCartOpen(true); setMenuOpen(false); }}>MY CART ({cart.totalQuantity})</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowJoinFam(true); setMenuOpen(false); }}>JOIN THE FLOCK</a>
            </div>
            <div className="menu-bottom-right">
              <a href="https://www.instagram.com/dabirddotnet?igsh=MWZubXdsd2FkZ3JlZA==" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={null}>
        {searchOpen && <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />}

        {showJoinFam && <JoinFamModal onClose={() => setShowJoinFam(false)} />}

        {authOpen && (
          <AuthModal
            isOpen={authOpen}
            onClose={() => setAuthOpen(false)}
            onAuthChange={(c) => setCustomer(c)}
          />
        )}

        {showSignOutConfirm && (
          <ConfirmModal
            isOpen={showSignOutConfirm}
            message={`Sign out of ${customer?.email || 'your account'}?`}
            onConfirm={handleSignOut}
            onCancel={() => setShowSignOutConfirm(false)}
          />
        )}
      </Suspense>
    </>
  );
};

export default Navbar;
