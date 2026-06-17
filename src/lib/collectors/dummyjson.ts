// DummyJSON API collector — free, no API key, works everywhere
// Returns real product data (phones, laptops, etc.) from https://dummyjson.com

import { Product, CollectorConfig, Store } from "../types";
import { BaseCollector } from "./base";

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: { width: number; height: number; depth: number };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: { rating: number; comment: string; reviewerName: string }[];
  returnPolicy: string;
  images: string[];
  thumbnail: string;
}

interface DummyResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

// Map DummyJSON categories to stores for multi-store simulation
const STORE_ROTATION: Store[] = ["amazon", "flipkart", "croma"];

export class DummyJSONCollector extends BaseCollector {
  store = "amazon" as const; // primary store label
  config: CollectorConfig = {
    enabled: true,
    rateLimit: 30,
    timeout: 10000,
  };

  async search(query: string, _category?: string): Promise<Product[]> {
    try {
      console.log(`[DummyJSON] Searching for: "${query}"...`);

      const url = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=30`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: DummyResponse = await response.json();
      console.log(`[DummyJSON] Got ${data.products.length} products`);

      const products: Product[] = data.products.map((p, index) => {
        // Convert USD price to INR (approx ×83) for Indian context
        const priceINR = Math.round(p.price * 83);
        const originalPrice = Math.round(priceINR / (1 - p.discountPercentage / 100));
        const store = STORE_ROTATION[index % STORE_ROTATION.length];

        return {
          id: this.generateId(store, p.title),
          name: p.title,
          brand: p.brand || p.title.split(" ")[0],
          category: "smartphones", // converter will re-categorize
          price: priceINR,
          originalPrice: originalPrice > priceINR ? originalPrice : undefined,
          rating: Math.round(p.rating * 10) / 10,
          reviewCount: p.reviews?.length ? p.reviews.length * 1000 + Math.floor(Math.random() * 5000) : 0,
          imageUrl: p.thumbnail || p.images[0] || "",
          productUrl: `https://dummyjson.com/products/${p.id}`,
          store,
          specifications: {
            Brand: p.brand || "Unknown",
            SKU: p.sku,
            Weight: `${p.weight}g`,
            Dimensions: `${p.dimensions.width} × ${p.dimensions.height} × ${p.dimensions.depth} cm`,
            Warranty: p.warrantyInformation,
            Shipping: p.shippingInformation,
            "Return Policy": p.returnPolicy,
            Availability: p.availabilityStatus,
          },
          highlights: [
            p.description,
            p.warrantyInformation,
            p.shippingInformation,
            `${p.discountPercentage}% off`,
          ].filter(Boolean),
          pros: p.reviews
            ?.filter((r) => r.rating >= 4)
            .slice(0, 3)
            .map((r) => r.comment) || [],
          cons: p.reviews
            ?.filter((r) => r.rating <= 2)
            .slice(0, 2)
            .map((r) => r.comment) || [],
          updatedAt: new Date().toISOString(),
        };
      });

      return products;
    } catch (error) {
      console.error(`[DummyJSON] Error: ${error instanceof Error ? error.message : error}`);
      return [];
    }
  }
}
