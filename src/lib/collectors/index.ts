import { AmazonCollector } from "./amazon";
import { FlipkartCollector } from "./flipkart";
import { CromaCollector } from "./croma";
import { CollectorResult } from "../types";

const collectors = [
  new AmazonCollector(),
  new FlipkartCollector(),
  new CromaCollector(),
];

export async function collectFromAllStores(
  query: string,
  category?: string
): Promise<CollectorResult[]> {
  const results = await Promise.allSettled(
    collectors.map((c) => c.collect(query, category))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<CollectorResult> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);
}

export { AmazonCollector, FlipkartCollector, CromaCollector };
