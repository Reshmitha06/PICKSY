import { Product, CollectorConfig } from "../types";
import { BaseCollector } from "./base";
import { launchBrowser, createPage } from "./browser";
import * as cheerio from "cheerio";

export class CromaCollector extends BaseCollector {
  store = "croma" as const;
  config: CollectorConfig = {
    enabled: true,
    rateLimit: 10,
    timeout: 20000,
  };

  async search(query: string, _category?: string): Promise<Product[]> {
    let browser = null;

    try {
      console.log(`[Croma] Searching for: "${query}"...`);

      browser = await launchBrowser();
      const page = await createPage(browser);

      const searchUrl = `https://www.croma.com/searchB?q=${encodeURIComponent(query)}&text=${encodeURIComponent(query)}`;
      await page.goto(searchUrl, {
        waitUntil: "domcontentloaded",
        timeout: this.config.timeout,
      });

      // Wait for product listings
      await page
        .waitForSelector("li.product-item", { timeout: 10000 })
        .catch(() => {});

      const html = await page.content();
      const $ = cheerio.load(html);
      const products: Product[] = [];

      $("li.product-item").each((index, element) => {
        if (index >= 20) return false;

        const $el = $(element);

        // Title
        const title =
          $el.find("h3.product-title a").text().trim() ||
          $el.find("[class*='product-title']").text().trim();
        if (!title || title.length < 5) return;

        // URL
        const relativeUrl = $el.find("a[href*='/p/']").attr("href") || $el.find("h3 a").attr("href");
        const url = relativeUrl
          ? relativeUrl.startsWith("http")
            ? relativeUrl
            : `https://www.croma.com${relativeUrl}`
          : "";

        // Price
        let price = 0;
        const priceEl = $el.find("[class*='new-price'], [class*='pdpPrice'], .amount");
        if (priceEl.length) {
          const priceText = priceEl.first().text().replace(/[₹,\s]/g, "").trim();
          price = parseInt(priceText) || 0;
        }

        // Fallback: look for any ₹ text
        if (price === 0) {
          $el.find("span, div").each((_i, el) => {
            const text = $(el).text().trim();
            if (text.includes("₹") && text.length < 20 && price === 0) {
              const parsed = parseInt(text.replace(/[₹,\s]/g, ""));
              if (parsed > 100) price = parsed;
            }
          });
        }

        // Original price (MRP)
        let originalPrice: number | undefined;
        const mrpEl = $el.find("[class*='old-price'], [class*='mrpPrice']");
        if (mrpEl.length) {
          const parsed = parseInt(mrpEl.first().text().replace(/[₹,\s]/g, ""));
          if (parsed && parsed > price) originalPrice = parsed;
        }

        // Rating
        let rating = 0;
        const ratingEl = $el.find("[class*='rating']");
        if (ratingEl.length) {
          const ratingText = ratingEl.first().text().trim();
          const parsed = parseFloat(ratingText);
          if (parsed > 0 && parsed <= 5) rating = parsed;
        }

        // Image
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
