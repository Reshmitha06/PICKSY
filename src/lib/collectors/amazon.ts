import { Product, CollectorConfig } from "../types";
import { BaseCollector } from "./base";
import { launchBrowser, createPage } from "./browser";
import * as cheerio from "cheerio";

export class AmazonCollector extends BaseCollector {
  store = "amazon" as const;
  config: CollectorConfig = {
    enabled: true,
    rateLimit: 10,
    timeout: 20000,
  };

  async search(query: string, _category?: string): Promise<Product[]> {
    let browser = null;

    try {
      console.log(`[Amazon] Searching for: "${query}"...`);

      browser = await launchBrowser();
      const page = await createPage(browser);

      const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
      await page.goto(searchUrl, {
        waitUntil: "domcontentloaded",
        timeout: this.config.timeout,
      });

      // Wait for product results
      await page
        .waitForSelector('[data-component-type="s-search-result"]', { timeout: 10000 })
        .catch(() => {});

      const html = await page.content();
      const $ = cheerio.load(html);
      const products: Product[] = [];

      $('[data-component-type="s-search-result"]').each((index, element) => {
        if (index >= 20) return false;

        const $el = $(element);

        // Title
        const title = $el.find("h2 a span").text().trim();
        if (!title) return;

        // URL
        const relativeUrl = $el.find("h2 a").attr("href");
        const url = relativeUrl ? `https://www.amazon.in${relativeUrl}` : "";

        // Price
        const priceText = $el
          .find(".a-price .a-price-whole")
          .first()
          .text()
          .replace(/[,.]/g, "")
          .trim();
        const price = priceText ? parseInt(priceText) : 0;

        // Original price
        const originalPriceText = $el
          .find(".a-price.a-text-price .a-offscreen")
          .first()
          .text()
          .replace(/[₹,]/g, "")
          .trim();
        const originalPrice = originalPriceText ? parseInt(originalPriceText) : undefined;

        // Rating
        const ratingText = $el.find(".a-icon-star-small .a-icon-alt").first().text();
        const ratingMatch = ratingText.match(/([\d.]+)/);
        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

        // Review count
        const reviewText = $el
          .find(".a-size-base.s-underline-text")
          .first()
          .text()
          .replace(/[,]/g, "")
          .trim();
        const reviewCount = parseInt(reviewText) || 0;

        // Image
        const imageUrl = $el.find(".s-image").attr("src") || "";

        if (price > 0) {
          products.push({
            id: this.generateId("amazon", title),
            name: title,
            brand: this.extractBrand(title),
            category: "smartphones", // will be recategorized by normalizer
            price,
            originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
            rating,
            reviewCount,
            imageUrl,
            productUrl: url,
            store: "amazon",
            specifications: {},
            highlights: [],
            pros: [],
            cons: [],
            updatedAt: new Date().toISOString(),
          });
        }
      });

      console.log(`[Amazon] Found ${products.length} products`);
      return products;
    } catch (error) {
      console.error(`[Amazon] Error: ${error instanceof Error ? error.message : error}`);
      return [];
    } finally {
      if (browser) await browser.close();
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
