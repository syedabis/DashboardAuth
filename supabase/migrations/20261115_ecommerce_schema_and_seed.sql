-- ==============================================================
-- Supabase Schema & Sample Data for Ecommerce Dashboard
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kikcqdtiacofeegglzzk/sql/new
-- ==============================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.ecommerce_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  stock_code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  sales_volume INTEGER NOT NULL DEFAULT 0,
  total_revenue NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ecommerce_monthly_stats (
  id SERIAL PRIMARY KEY,
  period TEXT NOT NULL,
  month_num INTEGER NOT NULL,
  year INTEGER NOT NULL,
  revenue NUMERIC(12, 2) NOT NULL,
  orders_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ecommerce_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  country TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  items_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'Completed',
  payment_status TEXT NOT NULL DEFAULT 'Paid',
  fulfillment_status TEXT NOT NULL DEFAULT 'Fulfilled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.ecommerce_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecommerce_monthly_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecommerce_orders ENABLE ROW LEVEL SECURITY;

-- 3. Create Public Read Policies (Allows Dashboard to fetch)
DROP POLICY IF EXISTS "Allow public read on ecommerce_products" ON public.ecommerce_products;
CREATE POLICY "Allow public read on ecommerce_products" ON public.ecommerce_products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on ecommerce_monthly_stats" ON public.ecommerce_monthly_stats;
CREATE POLICY "Allow public read on ecommerce_monthly_stats" ON public.ecommerce_monthly_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on ecommerce_orders" ON public.ecommerce_orders;
CREATE POLICY "Allow public read on ecommerce_orders" ON public.ecommerce_orders FOR SELECT USING (true);

-- 4. Insert Products
INSERT INTO public.ecommerce_products (name, stock_code, category, price, sales_volume, total_revenue)
VALUES
  ('Linen Overshirt', '85123A', 'Apparel', 120, 124, 14820),
  ('Everyday Leather Tote', '71053', 'Accessories', 185, 62, 11460),
  ('Ceramic Ribbed Planter', '84406B', 'Home Decor', 45, 198, 8930),
  ('Merino Wool Throw Blanket', '22752', 'Home Decor', 95, 76, 7280),
  ('Architectural Desk Lamp', '21733', 'Lighting', 140, 43, 6070),
  ('Handmade Stoneware Mug', '35970', 'Kitchen', 28, 142, 3976),
  ('Organic Cotton Bed Set', '47566', 'Bedding', 210, 18, 3780),
  ('Walnut Monitor Stand', '82482', 'Office', 88, 36, 3168)
ON CONFLICT (stock_code) DO UPDATE 
SET sales_volume = EXCLUDED.sales_volume, total_revenue = EXCLUDED.total_revenue;

-- 5. Insert Monthly Stats
INSERT INTO public.ecommerce_monthly_stats (period, month_num, year, revenue, orders_count)
VALUES
  ('Jan', 1, 2026, 58000, 340),
  ('Feb', 2, 2026, 62000, 375),
  ('Mar', 3, 2026, 71000, 420),
  ('Apr', 4, 2026, 68500, 405),
  ('May', 5, 2026, 74200, 445),
  ('Jun', 6, 2026, 82000, 490),
  ('Jul', 7, 2026, 89500, 530),
  ('Aug', 8, 2026, 94000, 560),
  ('Sep', 9, 2026, 98200, 585),
  ('Oct', 10, 2026, 105400, 625),
  ('Nov', 11, 2026, 121000, 710),
  ('Dec', 12, 2026, 148000, 880)
ON CONFLICT DO NOTHING;

-- 6. Insert Orders
INSERT INTO public.ecommerce_orders (order_number, customer_id, customer_name, country, total_amount, items_count, status, payment_status, fulfillment_status, created_at)
VALUES
  ('ORD-536365', '17850', 'Customer #17850', 'United Kingdom', 139.1, 6, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T08:26:00Z'),
  ('ORD-536366', '17850', 'Customer #17850', 'United Kingdom', 22.2, 2, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T08:28:00Z'),
  ('ORD-536367', '13047', 'Customer #13047', 'United Kingdom', 278.7, 12, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T08:34:00Z'),
  ('ORD-536368', '13047', 'Customer #13047', 'United Kingdom', 70.05, 4, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T08:34:00Z'),
  ('ORD-536369', '13047', 'Customer #13047', 'United Kingdom', 17.85, 1, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T08:35:00Z'),
  ('ORD-536370', '12583', 'Customer #12583', 'France', 855.86, 20, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T08:45:00Z'),
  ('ORD-536371', '13767', 'Customer #13767', 'United Kingdom', 412.5, 5, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T09:02:00Z'),
  ('ORD-536372', '17920', 'Customer #17920', 'United Kingdom', 185, 1, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T09:15:00Z'),
  ('ORD-536373', '14527', 'Customer #14527', 'United Kingdom', 27.5, 1, 'Returned', 'Refunded', 'Returned', '2026-11-14T09:41:00Z'),
  ('ORD-536374', '12662', 'Customer #12662', 'Germany', 540, 4, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T10:12:00Z'),
  ('ORD-536375', '17850', 'Customer #17850', 'United Kingdom', 320, 3, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T10:30:00Z'),
  ('ORD-536376', '14688', 'Customer #14688', 'United States', 620.4, 6, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T11:05:00Z'),
  ('ORD-536377', '15311', 'Customer #15311', 'United Kingdom', 495, 5, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T11:20:00Z'),
  ('ORD-536378', '16029', 'Customer #16029', 'United Kingdom', 1120, 10, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T11:45:00Z'),
  ('ORD-536379', '12431', 'Customer #12431', 'Australia', 360, 3, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T12:10:00Z'),
  ('ORD-536380', '12753', 'Customer #12753', 'Germany', 720, 6, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T12:45:00Z'),
  ('ORD-536381', '14911', 'Customer #14911', 'EIRE', 980.5, 8, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T13:15:00Z'),
  ('ORD-536382', '17850', 'Customer #17850', 'United Kingdom', 210, 2, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T13:30:00Z'),
  ('ORD-536383', '13047', 'Customer #13047', 'United Kingdom', 450, 4, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T14:00:00Z'),
  ('ORD-536384', '12583', 'Customer #12583', 'France', 310, 3, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T14:20:00Z'),
  ('ORD-536385', '14096', 'Customer #14096', 'United Kingdom', 670, 6, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T14:40:00Z'),
  ('ORD-536386', '14156', 'Customer #14156', 'EIRE', 890, 7, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T15:00:00Z'),
  ('ORD-536387', '12346', 'Customer #12346', 'United Kingdom', 45, 1, 'Returned', 'Refunded', 'Returned', '2026-11-14T15:30:00Z'),
  ('ORD-536388', '15061', 'Customer #15061', 'United Kingdom', 520, 4, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T16:00:00Z'),
  ('ORD-536389', '12415', 'Customer #12415', 'Australia', 1450, 12, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T16:20:00Z'),
  ('ORD-536390', '13767', 'Customer #13767', 'United Kingdom', 380, 3, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T16:50:00Z'),
  ('ORD-536391', '17511', 'Customer #17511', 'United Kingdom', 830, 7, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T17:15:00Z'),
  ('ORD-536392', '12681', 'Customer #12681', 'France', 480, 4, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T17:40:00Z'),
  ('ORD-536393', '12748', 'Customer #12748', 'United Kingdom', 640, 5, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T18:00:00Z'),
  ('ORD-536394', '17850', 'Customer #17850', 'United Kingdom', 420, 4, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T18:25:00Z'),
  ('ORD-536395', '13047', 'Customer #13047', 'United Kingdom', 290, 2, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T18:50:00Z'),
  ('ORD-536396', '13694', 'Customer #13694', 'United Kingdom', 510, 4, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T19:10:00Z'),
  ('ORD-536397', '12621', 'Customer #12621', 'Germany', 620, 5, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T19:30:00Z'),
  ('ORD-536398', '15769', 'Customer #15769', 'United Kingdom', 375, 3, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T19:55:00Z'),
  ('ORD-536399', '12528', 'Customer #12528', 'Germany', 480, 4, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T20:15:00Z'),
  ('ORD-536400', '15311', 'Customer #15311', 'United Kingdom', 720, 6, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T20:45:00Z'),
  ('ORD-536401', '17850', 'Customer #17850', 'United Kingdom', 890, 8, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T21:10:00Z'),
  ('ORD-536402', '12471', 'Customer #12471', 'Germany', 1100, 9, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T21:35:00Z'),
  ('ORD-536403', '14646', 'Customer #14646', 'Netherlands', 1650, 14, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T22:00:00Z'),
  ('ORD-536404', '18102', 'Customer #18102', 'United Kingdom', 1980, 16, 'Completed', 'Paid', 'Fulfilled', '2026-11-14T22:30:00Z')
ON CONFLICT (order_number) DO UPDATE
SET total_amount = EXCLUDED.total_amount, status = EXCLUDED.status;
