import { Product, Store, CollectorResult, CollectorConfig } from "../types";

export abstract class BaseCollector {
  abstract store: Store;
  abstract config: CollectorConfig;

  abstract search(query: string, category?: string): Promise<Product[]>;

  async collect(query: string, category?: string): Promise<CollectorResult> {
    const start = Date.now();

    if (!this.config.enabled) {
      return {
        products: [],
        store: this.store,
        success: false,
        error: "Collector disabled",
        searchTime: 0,
      };
    }

    try {
      const products = await this.search(query, category);
      return {
        products,
        store: this.store,
        success: true,
        searchTime: Date.now() - start,
      };
    } catch (error) {
      return {
        products: [],
        store: this.store,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        searchTime: Date.now() - start,
      };
    }
  }

  protected generateId(store: Store, name: string): string {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `${store}-${slug}`;
  }
}
