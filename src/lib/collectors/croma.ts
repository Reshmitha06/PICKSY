import { Product, CollectorConfig } from "../types";
import { BaseCollector } from "./base";
import { fetchHTML } from "./browser";
import * as cheerio from "cheerio";

export class CromaCollector extends BaseCollector {
  store = "croma" as const;
  config: CollectorConfig = {
    enabled: true,
    rateLimit: 10,
    timeout: 15000,
  };

  async search(query: string, _category?: string): Promise<Product[]> {
    try {
      console.log(`[Croma] Searching for: "${query}"...`);

      const searchUrl = `https://www.croma.com/searchB?q=${encodeURIComponent(query)}&text=${encodeURIComponent(query)}`;
      const html = await fetchHTML(searchUrl, this.config.timeout);
      console.log(`[Croma] HTML length: ${html.length} chars`);

      const $ = cheerio.load(html);
      const products: Product[] = [];

      $("li.product-item").each((index, element) => {
        if (index >= 20) return false;

        const $el = $(element);

        const title =
          $el.find("h3.product-title a").text().trim() ||
          $el.find("[class*='product-title']").text().trim();
        if (!title || title.length < 5) return;

        const relativeUrl = $el.find("a[href*='/p/']").attr("href") || $el.find("h3 a").attr("href");
        const url = relativeUrl
          ? relativeUrl.startsWith("http")
            ? relativeUrl
            : `https://www.croma.com${relativeUrl}`
          : "";

        let price = 0;
        const priceEl = $el.find("[class*='new-price'], [class*='pdpPrice'], .amount");
        if (priceEl.length) {
          price = parseInt(priceEl.first().text().replace(/[₹,\s]/g, "").trim()) || 0;
        }
        if (price === 0) {
          $el.find("span, div").each((_i, el) => {
            const text = $(el).text().trim();
            if (text.includes("₹") && text.length < 20 && price === 0) {
              const parsed = parseInt(text.replace(/[₹,\s]/g, ""));
              if (parsed > 100) price = parsed;
            }
          });
        }

        let originalPrice: number | undefined;
        const mrpEl = $el.find("[class*='old-price'], [class*='mrpPrice']");
        if (mrpEl.length) {
          const parsed = parseInt(mrpEl.first().text().replace(/[₹,\s]/g, ""));
          if (parsed && parsed > price) originalPrice = parsed;
        }

        let rating = 0;
        const ratingEl = $el.find("[class*='rating']");
        if (ratingEl.length) {
          const parsed = parseFloat(ratingEl.first().text().trim());
          if (parsed > 0 && parsed <= 5) rating = parsed;
        }

        const imageUrl =
          $el.find("img").attr("data-src") ||
          $el.find("img").attr("src") ||
          "";

        if (price > 0) {
          products.push({
            id: this.generateId("croma", title),
            name: title,
            brand: this.extractBrand(title),
            category: "smartphones",
            price,
            originalPrice,
            rating,
            reviewCount: 0,
            imageUrl,
            productUrl: url,
            store: "croma",
            specifications: {},
            highlights: [],
            pros: [],
            cons: [],
            updatedAt: new Date().toISOString(),
          });
        }
      });

      console.log(`[Croma] Found ${products.length} products`);
      return products;
    } catch (error) {
      console.error(`[Croma] Error: ${error instanceof Error ? error.message : error}`);
      return [];
    }
  }

  private extractBrand(title: string): string {
    const known = [
      "Samsung", "Apple", "OnePlus", "Xiaomi", "Redmi", "Realme", "Vivo", "Oppo",
      "Motorola", "Nothing", "Google", "Poco", "iQOO", "Sony", "LG", "Asus",
      "HP", "Dell", "Lenovo", "Acer", "MSI", "Boat", "JBL", "Noise",
      "boAt", "Whirlpool", "Haier", "Voltas", "Daikin", "Blue Star",
    ];
    const titleLower = title.toLowerCase();
    return known.find((b) => titleLower.includes(b.toLowerCase())) || title.split(" ")[0];
  }
}
