import { Product, CollectorConfig } from "../types";
import { BaseCollector } from "./base";
import { fetchHTML } from "./browser";
import * as cheerio from "cheerio";

export class FlipkartCollector extends BaseCollector {
  store = "flipkart" as const;
  config: CollectorConfig = {
    enabled: true,
    rateLimit: 10,
    timeout: 15000,
  };

  async search(query: string, _category?: string): Promise<Product[]> {
    try {
      console.log(`[Flipkart] Searching for: "${query}"...`);

      const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
      const html = await fetchHTML(searchUrl, this.config.timeout);
      console.log(`[Flipkart] HTML length: ${html.length} chars`);

      const $ = cheerio.load(html);
      const products: Product[] = [];
      const seenTitles = new Set<string>();

      $('a[href*="/p/"]').each((index, element) => {
        if (index >= 20) return false;

        const $el = $(element);
        const $parent = $el.closest("[data-id]").length
          ? $el.closest("[data-id]")
          : $el.parent().parent().parent();

        const title =
          $el.attr("title") ||
          $el.find('div[class*="col"] > div:first-child').text().trim() ||
          $el.text().trim();
        if (!title || title.length < 5) return;
        if (seenTitles.has(title)) return;
        seenTitles.add(title);

        const relativeUrl = $el.attr("href");
        const url = relativeUrl ? `https://www.flipkart.com${relativeUrl}` : "";

        let price = 0;
        const priceEl = $parent.find('div[class*="Nx9bqj"]').first();
        if (priceEl.length) {
          price = parseInt(priceEl.text().replace(/[₹,]/g, "").trim()) || 0;
        }
        if (price === 0) {
          $parent.find("div, span").each((_i, el) => {
            const text = $(el).text().trim();
            if (text.startsWith("₹") && text.length < 15) {
              const parsed = parseInt(text.replace(/[₹,]/g, ""));
              if (parsed > 0 && price === 0) price = parsed;
            }
          });
        }

        let originalPrice: number | undefined;
        const origPriceEl = $parent.find('div[class*="yRaY8j"]').first();
        if (origPriceEl.length) {
          const parsed = parseInt(origPriceEl.text().replace(/[₹,]/g, "").trim());
          if (parsed && parsed > price) originalPrice = parsed;
        }

        let rating = 0;
        const ratingEl = $parent.find('div[class*="XQDdHH"]').first();
        if (ratingEl.length) rating = parseFloat(ratingEl.text().trim()) || 0;

        let reviewCount = 0;
        const reviewEl = $parent.find('span[class*="Wphh3N"]').first();
        if (reviewEl.length) {
          const reviewMatch = reviewEl.text().match(/([\d,]+)\s*Ratings/i);
          if (reviewMatch) reviewCount = parseInt(reviewMatch[1].replace(/,/g, "")) || 0;
        }

        const imageUrl =
          $parent.find("img[loading]").attr("src") ||
          $parent.find("img").first().attr("src") ||
          "";

        if (price > 0 && title.length > 5) {
          products.push({
            id: this.generateId("flipkart", title),
            name: title.substring(0, 200),
            brand: this.extractBrand(title),
            category: "smartphones",
            price,
            originalPrice,
            rating,
            reviewCount,
            imageUrl,
            productUrl: url,
            store: "flipkart",
            specifications: {},
            highlights: [],
            pros: [],
            cons: [],
            updatedAt: new Date().toISOString(),
          });
        }
      });

      console.log(`[Flipkart] Found ${products.length} products`);
      return products;
    } catch (error) {
      console.error(`[Flipkart] Error: ${error instanceof Error ? error.message : error}`);
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
