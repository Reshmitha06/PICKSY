import { Product, CollectorConfig } from "../types";
import { BaseCollector } from "./base";

export class AmazonCollector extends BaseCollector {
  store = "amazon" as const;
  config: CollectorConfig = {
    enabled: true,
    rateLimit: 10,
    timeout: 15000,
  };

  async search(query: string, _category?: string): Promise<Product[]> {
    // TODO: Implement real Amazon scraping with puppeteer-core
    // For now, returns empty — mock data is used at the API layer
    console.log(`[Amazon] Searching for: ${query}`);
    return [];
  }
}
