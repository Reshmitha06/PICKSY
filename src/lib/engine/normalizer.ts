import { NormalizedProduct } from "../types";

/**
 * Normalize a product name to a canonical form for matching.
 * Strips color variants, storage suffixes, and normalizes spacing.
 */
export function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, " ")           // Remove parenthetical info
    .replace(/\s*-\s*(black|white|blue|green|red|gold|silver|grey|gray|midnight|starlight|purple)\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Calculate similarity score between two product names (0-1).
 * Uses token overlap (Jaccard similarity).
 */
export function nameSimilarity(a: string, b: string): number {
  const tokensA = new Set(normalizeProductName(a).split(" "));
  const tokensB = new Set(normalizeProductName(b).split(" "));

  const intersection = new Set([...tokensA].filter((t) => tokensB.has(t)));
  const union = new Set([...tokensA, ...tokensB]);

  return intersection.size / union.size;
}

/**
 * Group products that are likely the same item from different stores.
 * Returns arrays of product IDs that should be merged.
 */
export function findDuplicates(
  products: NormalizedProduct[],
  threshold = 0.7
): string[][] {
  const groups: string[][] = [];
  const assigned = new Set<string>();

  for (const product of products) {
    if (assigned.has(product.id)) continue;

    const group = [product.id];
    assigned.add(product.id);

    for (const other of products) {
      if (assigned.has(other.id)) continue;
      if (product.brand !== other.brand) continue;

      const similarity = nameSimilarity(
        product.canonicalName,
        other.canonicalName
      );
      if (similarity >= threshold) {
        group.push(other.id);
        assigned.add(other.id);
      }
    }

    groups.push(group);
  }

  return groups;
}
