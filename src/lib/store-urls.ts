// Generate real store search URLs for products

const storeSearchUrls: Record<string, (query: string) => string> = {
  amazon: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
  flipkart: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
  croma: (q) => `https://www.croma.com/searchB?q=${encodeURIComponent(q)}`,
  "reliance-digital": (q) => `https://www.reliancedigital.in/search?q=${encodeURIComponent(q)}`,
  "vijay-sales": (q) => `https://www.vijaysales.com/search/${encodeURIComponent(q)}`,
};

export function getStoreUrl(store: string, productName: string): string {
  const generator = storeSearchUrls[store];
  if (generator) {
    return generator(productName);
  }
  return `https://www.google.com/search?q=${encodeURIComponent(productName + " buy")}`;
}
