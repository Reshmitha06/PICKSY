import { Product, CollectorConfig } from "../types";
import { BaseCollector } from "./base";
import { launchBrowser, createPage } from "./browser";
import * as cheerio from "cheerio";

export class FlipkartCollector extends BaseCollector {
  store = "flipkart" as const;
  config: CollectorConfig = {
    enabled: true,
    rateLimit: 10,
    timeout: 20000,
  };

  async search(query: string, _category?: string): Promise<Product[]> {
    let browser = null;

    try {
      console.log(`[Flipkart] Searching for: "${query}"...`);

      browser = await launchBrowser();
      const page = await createPage(browser);

      const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
      await page.goto(searchUrl, {
        waitUntil: "domcontentloaded",
        timeout: this.config.timeout,
      });

      // Wait for product links
      await page
        .waitForSelector('a[href*="/p/"]', { timeout: 10000 })
        .catch(() => {});

      const html = await page.content();
      const $ = cheerio.load(html);
      const products: Product[] = [];
      const seenTitles = new Set<string>();

      $('a[href*="/p/"]').each((index, element) => {
        if (index >= 20) return false;

        const $el = $(element);
        const $parent = $el.closest("[data-id]").length
          ? $el.closest("[data-id]")
          : $el.parent().parent().parent();

        // Title
        const title =
          $el.attr("title") ||
          $el.find('div[class*="col"] > div:first-child').text().trim() ||
          $el.text().trim();
        if (!title || title.length < 5) return;
        if (seenTitles.has(title)) return;
        seenTitles.add(title);

        // URL
        const relativeUrl = $el.attr("href");
        const url = relativeUrl ? `https://www.flipkart.com${relativeUrl}` : "";

        // Price — Flipkart uses class patterns like "Nx9bqj"
        let price = 0;
        const priceEl = $parent.find('div[class*="Nx9bqj"]').first();
        if (priceEl.length) {
          const priceText = priceEl.text().replace(/[₹,]/g, "").trim();
          price = parseInt(priceText) || 0;
        }

        // Fallback price detection
        if (price === 0) {
          $parent.find("div, span").each((_i, el) => {
            const text = $(el).text().trim();
            if (text.startsWith("₹") && text.length < 15) {
              const parsed = parseInt(text.replace(/[₹,]/g, ""));
              if (parsed > 0 && price === 0) {
                price = parsed;
              }
            }
          });
        }

        // Original price
        let originalPrice: number | undefined;
        const origPriceEl = $parent.find('div[class*="yRaY8j"]').first();
        if (origPriceEl.length) {
          const origText = origPriceEl.text().replace(/[₹,]/g, "").trim();
          const parsed = parseInt(origText);
          if (parsed && parsed > price) originalPrice = parsed;
        }

        // Rating
        let rating = 0;
        const ratingEl = $parent.find('div[class*="XQDdHH"]').first();
        if (ratingEl.length) {
          rating = parseFloat(ratingEl.text().trim()) || 0;
        }

        // Review count
        let reviewCount = 0;
        const reviewEl = $parent.find('span[class*="Wphh3N"]').first();
        if (reviewEl.length) {
          const reviewMatch = reviewEl.text().match(/([\d,]+)\s*Ratings/i);
          if (reviewMatch) {
            reviewCount = parseInt(reviewMatch[1].replace(/,/g, "")) || 0;
          }
        }

        // Image
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
