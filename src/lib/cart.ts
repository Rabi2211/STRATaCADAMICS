import { readJson, removeStorageValue, writeJson } from "./storage";

export type CartEntry = {
  id: string;
  name: string;
  brandId?: string;
  imageClass?: string;
  price: number;
  quantity: number;
};

const CART_STORAGE_KEY = "strata-cart";

export function readCart(): CartEntry[] {
  const stored = readJson<CartEntry[]>(CART_STORAGE_KEY);

  if (!Array.isArray(stored)) {
    return [];
  }

  return stored
    .filter((item) => item && typeof item.id === "string")
    .map((item) => ({
      ...item,
      price: Number(item.price ?? 0),
      quantity: Math.max(1, Number(item.quantity ?? 1)),
    }));
}

export function saveCart(items: CartEntry[]): CartEntry[] {
  return writeJson(CART_STORAGE_KEY, items);
}

export function addToCart(product: {
  id: string;
  name: string;
  brandId?: string;
  imageClass?: string;
  price: number | string;
}, quantity = 1): CartEntry[] {
  const nextQuantity = Math.max(1, Number(quantity) || 1);
  const cart = readCart();
  const index = cart.findIndex((entry) => entry.id === product.id);

  if (index >= 0) {
    cart[index] = {
      ...cart[index],
      quantity: cart[index].quantity + nextQuantity,
    };
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brandId: product.brandId,
      imageClass: product.imageClass,
      price: Number(product.price ?? 0),
      quantity: nextQuantity,
    });
  }

  return saveCart(cart);
}

export function updateCartQuantity(productId: string, quantity: number): CartEntry[] {
  const nextQuantity = Math.max(1, Number(quantity) || 1);
  const cart = readCart();
  const index = cart.findIndex((entry) => entry.id === productId);

  if (index === -1) {
    return cart;
  }

  cart[index] = { ...cart[index], quantity: nextQuantity };
  return saveCart(cart);
}

export function removeFromCart(productId: string): CartEntry[] {
  const cart = readCart().filter((entry) => entry.id !== productId);
  return saveCart(cart);
}

export function clearCart(): CartEntry[] {
  removeStorageValue(CART_STORAGE_KEY);
  return [];
}

export function getCartSummary(items: CartEntry[] = readCart()) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    totalItems,
    subtotal,
    itemCount: items.length,
  };
}

export function getCheckoutSummary(items: CartEntry[] = readCart()) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.15);
  const shipping = subtotal > 2000 ? 0 : 0;
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    shipping,
    tax,
    total,
    itemCount: items.length,
    deliveryWindow: "3-5 business days",
  };
}

export function buildOrderItemsFromCart(items: CartEntry[] = readCart()) {
  return items.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
  }));
}
