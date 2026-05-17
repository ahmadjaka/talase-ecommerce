export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  qty: number;
  note?: string;
};

export const CART_STORAGE_KEY = 'talase_cart';

export function getCartItems(): CartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!rawCart) return [];

    const parsed = JSON.parse(rawCart);

    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function clearCart() {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(CART_STORAGE_KEY);
}

export function addCartItem(
  product: Omit<CartItem, 'id' | 'qty' | 'note'>,
  qty = 1,
  note = '',
) {
  const currentItems = getCartItems();

  const existingIndex = currentItems.findIndex(
    (item) => item.productId === product.productId && item.note === note,
  );

  if (existingIndex >= 0) {
    currentItems[existingIndex] = {
      ...currentItems[existingIndex],
      qty: currentItems[existingIndex].qty + qty,
    };

    saveCartItems(currentItems);
    return currentItems;
  }

  const newItem: CartItem = {
    ...product,
    id: `${product.productId}_${Date.now()}`,
    qty,
    note,
  };

  const nextItems = [...currentItems, newItem];
  saveCartItems(nextItems);

  return nextItems;
}

export function updateCartItemQty(itemId: string, qty: number) {
  const currentItems = getCartItems();

  const nextItems = currentItems
    .map((item) => (item.id === itemId ? { ...item, qty } : item))
    .filter((item) => item.qty > 0);

  saveCartItems(nextItems);

  return nextItems;
}

export function removeCartItem(itemId: string) {
  const currentItems = getCartItems();
  const nextItems = currentItems.filter((item) => item.id !== itemId);

  saveCartItems(nextItems);

  return nextItems;
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.qty, 0);
}

export function getCartTotal({
  items,
  discount = 0,
  shippingCost = 0,
}: {
  items: CartItem[];
  discount?: number;
  shippingCost?: number;
}) {
  return getCartSubtotal(items) - discount + shippingCost;
}

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.qty, 0);
}