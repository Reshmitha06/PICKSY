import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SEARCHES_FILE = path.join(DATA_DIR, "searches.json");

interface SearchLog {
  id: string;
  query: string;
  filters: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
  };
  source: "text" | "voice" | "suggestion" | "category";
  timestamp: string;
  userAgent?: string;
}

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readSearches(): Promise<SearchLog[]> {
  try {
    const data = await fs.readFile(SEARCHES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeSearches(searches: SearchLog[]) {
  await ensureDataDir();
  await fs.writeFile(SEARCHES_FILE, JSON.stringify(searches, null, 2));
}

// POST — log a search
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters, source } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const log: SearchLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      query: query.slice(0, 200), // Limit length
      filters: filters || {},
      source: source || "text",
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent")?.slice(0, 200) || undefined,
    };

    const searches = await readSearches();
    searches.push(log);

    // Keep last 10,000 searches max
    const trimmed = searches.slice(-10000);
    await writeSearches(trimmed);

    return NextResponse.json({ success: true, id: log.id });
  } catch {
    return NextResponse.json({ error: "Failed to log search" }, { status: 500 });
  }
}

// GET — retrieve collected data (for analytics)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 1000);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const searches = await readSearches();
  const total = searches.length;
  const page = searches.slice(-limit - offset, searches.length - offset);

  // Basic analytics
  const queryCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};

  for (const s of searches) {
    const q = s.query.toLowerCase().trim();
    queryCounts[q] = (queryCounts[q] || 0) + 1;
    if (s.filters.category) {
      categoryCounts[s.filters.category] = (categoryCounts[s.filters.category] || 0) + 1;
    }
    sourceCounts[s.source] = (sourceCounts[s.source] || 0) + 1;
  }

  // Top searches
  const topSearches = Object.entries(queryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([query, count]) => ({ query, count }));

  // Top categories
  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([category, count]) => ({ category, count }));

  return NextResponse.json({
    total,
    searches: page,
    analytics: {
      topSearches,
      topCategories,
      sourceCounts,
      todayCount: searches.filter(
        (s) => s.timestamp.startsWith(new Date().toISOString().slice(0, 10))
      ).length,
    },
  });
}
