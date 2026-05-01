import { createContext, useContext, useState, useEffect } from 'react';
import { track } from '../utils/track';

const CartContext = createContext();

const CREATE_CART_MUTATION = `
  mutation CreateCart {
    cartCreate {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image { url }
                  price { amount currencyCode }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges { node { url } }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount { amount currencyCode }
        }
      }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image { url }
                  price { amount currencyCode }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges { node { url } }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount { amount currencyCode }
        }
      }
    }
  }
`;

const REMOVE_FROM_CART_MUTATION = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image { url }
                  price { amount currencyCode }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges { node { url } }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount { amount currencyCode }
        }
      }
    }
  }
`;

const UPDATE_CART_MUTATION = `
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image { url }
                  price { amount currencyCode }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges { node { url } }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount { amount currencyCode }
        }
      }
    }
  }
`;

const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                image { url }
                price { amount currencyCode }
                product {
                  title
                  handle
                  images(first: 1) {
                    edges { node { url } }
                  }
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount { amount currencyCode }
      }
    }
  }
`;

function parseCart(cart) {
  if (!cart) return { id: null, checkoutUrl: '', totalQuantity: 0, lines: [], totalAmount: '0.00' };
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    lines: cart.lines.edges.map(({ node }) => ({
      id: node.id,
      quantity: node.quantity,
      variantId: node.merchandise.id,
      variantTitle: node.merchandise.title,
      price: node.merchandise.price.amount,
      productTitle: node.merchandise.product.title,
      productHandle: node.merchandise.product.handle,
      image: node.merchandise.image?.url || node.merchandise.product.images.edges[0]?.node.url || '',
    })),
    totalAmount: cart.cost.totalAmount.amount,
  };
}

async function requestShopify(query, variables) {
  const { shopifyClient } = await import('./shopify');
  return shopifyClient.request(query, variables ? { variables } : undefined);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ id: null, checkoutUrl: '', totalQuantity: 0, lines: [], totalAmount: '0.00' });
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSavedCart = () => {
      const savedCartId = localStorage.getItem('shopify_cart_id');
      if (savedCartId) {
        fetchCart(savedCartId);
      }
    };

    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(loadSavedCart, { timeout: 3000 })
      : window.setTimeout(loadSavedCart, 1500);

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  async function fetchCart(cartId) {
    try {
      const { data } = await requestShopify(GET_CART_QUERY, { cartId });
      if (data.cart) {
        setCart(parseCart(data.cart));
      } else {
        localStorage.removeItem('shopify_cart_id');
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      localStorage.removeItem('shopify_cart_id');
    }
  }

  async function addToCart(variantId, quantity = 1, options = {}) {
    const { openDrawer = true } = options;
    setLoading(true);
    try {
      let cartId = cart.id;

      if (!cartId) {
        const { data } = await requestShopify(CREATE_CART_MUTATION);
        const created = data?.cartCreate?.cart;
        const errs = data?.cartCreate?.userErrors;
        if (errs?.length) {
          console.error('cartCreate userErrors:', errs);
          return null;
        }
        if (!created?.id) {
          console.error('cartCreate: no cart returned');
          return null;
        }
        cartId = created.id;
        localStorage.setItem('shopify_cart_id', cartId);
      }

      const { data } = await requestShopify(ADD_TO_CART_MUTATION, {
        cartId,
        lines: [{ merchandiseId: variantId, quantity }],
      });

      const errs = data?.cartLinesAdd?.userErrors;
      if (errs?.length) {
        console.error('cartLinesAdd userErrors:', errs);
        return null;
      }

      const parsed = parseCart(data.cartLinesAdd.cart);
      setCart(parsed);
      if (openDrawer) setCartOpen(true);
      return parsed;
    } catch (err) {
      console.error('Failed to add to cart:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function removeFromCart(lineId) {
    if (!cart.id) return;
    setLoading(true);
    try {
      const { data } = await requestShopify(REMOVE_FROM_CART_MUTATION, {
        cartId: cart.id,
        lineIds: [lineId],
      });
      setCart(parseCart(data.cartLinesRemove.cart));
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(lineId, quantity) {
    if (!cart.id) return;
    setLoading(true);
    try {
      const { data } = await requestShopify(UPDATE_CART_MUTATION, {
        cartId: cart.id,
        lines: [{ id: lineId, quantity }],
      });
      setCart(parseCart(data.cartLinesUpdate.cart));
    } catch (err) {
      console.error('Failed to update cart quantity:', err);
    } finally {
      setLoading(false);
    }
  }

  function goToCheckout() {
    if (cart.checkoutUrl) {
      // ✅ Fire Meta Pixel InitiateCheckout event (browser + CAPI)
      track('InitiateCheckout', {
        content_ids: cart.lines.map(line => line.variantId),
        content_type: 'product',
        value: parseFloat(cart.totalAmount),
        currency: 'GBP',
        num_items: cart.totalQuantity,
      });
      setTimeout(() => {
        window.location.href = cart.checkoutUrl;
      }, 100);
    }
  }

  return (
    <CartContext.Provider value={{ cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQuantity, goToCheckout, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
