-- Picksy Database Schema (Supabase / PostgreSQL)
-- Run this in the Supabase SQL editor when ready

-- ─── Stores ───
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO stores (name, slug, website) VALUES
  ('Amazon', 'amazon', 'https://amazon.in'),
  ('Flipkart', 'flipkart', 'https://flipkart.com'),
  ('Croma', 'croma', 'https://croma.com'),
  ('Reliance Digital', 'reliance-digital', 'https://reliancedigital.in'),
  ('Vijay Sales', 'vijay-sales', 'https://vijaysales.com')
ON CONFLICT (slug) DO NOTHING;

-- ─── Products (canonical / normalized) ───
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  best_price INTEGER,
  average_rating NUMERIC(3,2),
  total_reviews INTEGER DEFAULT 0,
  image_url TEXT,
  specifications JSONB DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  scores JSONB DEFAULT '{"overall":0,"value":0,"performance":0,"reviews":0,"popularity":0}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_best_price ON products(best_price);

-- ─── Product Listings (per-store prices) ───
CREATE TABLE IF NOT EXISTS product_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id),
  price INTEGER NOT NULL,
  original_price INTEGER,
  rating NUMERIC(3,2),
  review_count INTEGER DEFAULT 0,
  product_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, store_id)
);

CREATE INDEX idx_listings_product ON product_listings(product_id);
CREATE INDEX idx_listings_store ON product_listings(store_id);

-- ─── Users ───
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Searches (analytics) ───
CREATE TABLE IF NOT EXISTS searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  category TEXT,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_searches_query ON searches(query);
CREATE INDEX idx_searches_created ON searches(created_at);

-- ─── Price History (for future price tracking) ───
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES product_listings(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_history_listing ON price_history(listing_id);
CREATE INDEX idx_price_history_date ON price_history(recorded_at);
