import { Product, CollectorConfig } from "../types";
import { BaseCollector } from "./base";

export class FlipkartCollector extends BaseCollector {
  store = "flipkart" as const;
  config: CollectorConfig = {
    enabled: true,
    rateLimit: 10,
    timeout: 15000,
  };

  async search(query: string, _category?: string): Promise<Product[]> {
    // TODO: Implement real Flipkart scraping with puppeteer-core
    console.log(`[Flipkart] Searching for: ${query}`);
    return [];
  }
}
