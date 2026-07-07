/** Shared illustrative cart used in the hero + product-in-motion demos. */
export interface DemoItem {
  id: string;
  nameKey: string;
  qty: number;
  price: number;
  swatch: string;
}

export const DEMO_ITEMS: DemoItem[] = [
  { id: 'shoes', nameKey: 'demo.cart.item.shoes', qty: 1, price: 128, swatch: '#D8541E' },
  { id: 'jacket', nameKey: 'demo.cart.item.jacket', qty: 1, price: 96, swatch: '#14233A' },
  { id: 'socks', nameKey: 'demo.cart.item.socks', qty: 1, price: 24, swatch: '#1E5B45' },
];

/** Fourth item used only by the hero's "live" variant: it pops into the phone
 *  cart mid-loop and syncs across. Kept out of DEMO_ITEMS so the other demos
 *  (parity diagram, how-it-works) keep their 3-item cart. */
export const DEMO_LIVE_ITEM: DemoItem = {
  id: 'beanie',
  nameKey: 'demo.cart.item.beanie',
  qty: 1,
  price: 18,
  swatch: '#9C6B3F',
};

export const DEMO_CURRENCY = '$';

export function cartSubtotal(items: DemoItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function formatMoney(n: number, currency = DEMO_CURRENCY): string {
  return currency + n.toFixed(2);
}
