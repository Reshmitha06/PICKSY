import { Product, CollectorConfig } from "../types";
import { BaseCollector } from "./base";

export class CromaCollector extends BaseCollector {
  store = "croma" as const;
  config: CollectorConfig = {
    enabled: true,
    rateLimit: 10,
    timeout: 15000,
  };

  async search(query: string, _category?: string): Promise<Product[]> {
    // TODO: Implement real Croma scraping
    console.log(`[Croma] Searching for: ${query}`);
    return [];
  }
}
