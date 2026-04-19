import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../lib/cart';
import './CartDrawer.css';

const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, goToCheckout, loading } = useCart();

  const SHIPPING_THRESHOLD = 80;
  const remainingForShipping = Math.max(0, SHIPPING_THRESHOLD - parseFloat(cart.totalAmount));

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="cart-drawer-header">
              <h2>your cart ({cart.totalQuantity})</h2>
              <button className="cart-close-btn" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            
            <div className="cart-shipping-banner" style={{ padding: '20px 25px', backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {remainingForShipping > 0 
                  ? `Spend $${remainingForShipping.toFixed(2)} more for free shipping` 
                  : "You've reached free shipping!"}
              </p>
              <div className="shipping-progress-bg" style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                <div 
                  className="shipping-progress-fill" 
                  style={{ 
                    width: `${Math.min(100, (parseFloat(cart.totalAmount) / SHIPPING_THRESHOLD) * 100)}%`, 
                    height: '100%', 
                    backgroundColor: 'hsla(204.39, 79.49%, 38.24%, 1)',
                    transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>
            </div>

            <div className="cart-drawer-body">
              {cart.lines.length === 0 ? (
                <div className="cart-empty">
                  <p>your cart is empty</p>
                  <button className="continue-shopping-btn" onClick={() => { setCartOpen(false); window.location.hash = '#shop'; }}>
                    continue shopping
                  </button>
                </div>
              ) : (
                cart.lines.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.productTitle} />
                    </div>
                    <div className="cart-item-info">
                      <span className="cart-item-title">{item.productTitle}</span>
                      {item.variantTitle !== 'Default Title' && (
                        <span className="cart-item-variant">{item.variantTitle}</span>
                      )}
                      <span className="cart-item-price" style={{ display: 'block', marginTop: '5px', fontWeight: '600' }}>$ {parseFloat(item.price).toFixed(2)}</span>
                      <div className="cart-item-qty-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={loading || item.quantity <= 1}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={loading}>+</button>
                        <button
                          className="cart-item-remove"
                          onClick={() => removeFromCart(item.id)}
                          disabled={loading}
                          style={{ marginLeft: '10px', textDecoration: 'underline' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.lines.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-total">
                  <span>total</span>
                  <span>$ {parseFloat(cart.totalAmount).toFixed(2)}</span>
                </div>
                <button className="checkout-btn" onClick={goToCheckout} disabled={loading}>
                  {loading ? 'processing...' : 'checkout'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
