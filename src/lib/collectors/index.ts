import { AmazonCollector } from "./amazon";
import { FlipkartCollector } from "./flipkart";
import { CromaCollector } from "./croma";
import { DummyJSONCollector } from "./dummyjson";
import { CollectorResult } from "../types";

// DummyJSON is always-available (free API, no blocking)
// Real scrapers are tried in parallel but may fail due to bot detection
const dummyCollector = new DummyJSONCollector();

const scrapers = [
  new AmazonCollector(),
  new FlipkartCollector(),
  new CromaCollector(),
];

export async function collectFromAllStores(
  query: string,
  category?: string
): Promise<CollectorResult[]> {
  // Run DummyJSON + real scrapers in parallel
  const allCollectors = [dummyCollector, ...scrapers];

  const results = await Promise.allSettled(
    allCollectors.map((c) => c.collect(query, category))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<CollectorResult> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);
}

export { AmazonCollector, FlipkartCollector, CromaCollector, DummyJSONCollector };
