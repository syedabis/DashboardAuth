import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "..", "data", "ecommerce");
const outDir = path.join(__dirname, "..", "..", "supabase");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const migrationsDir = path.join(outDir, "migrations");
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

function parseCsv(content) {
  const lines = content.trim().split("\n");
  const header = parseCsvLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const values = parseCsvLine(line);
      const row = {};
      header.forEach((h, idx) => {
        row[h.trim()] = values[idx];
      });
      rows.push(row);
    }
  }
  return rows;
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function escapeSql(str) {
  if (str === null || str === undefined) return "NULL";
  return `'${String(str).replace(/'/g, "''")}'`;
}

// 1. Read CSVs
const productsCsv = fs.readFileSync(path.join(dataDir, "ecommerce_products.csv"), "utf8");
const ordersCsv = fs.readFileSync(path.join(dataDir, "ecommerce_orders.csv"), "utf8");
const monthlyCsv = fs.readFileSync(path.join(dataDir, "ecommerce_monthly_revenue.csv"), "utf8");
const customersCsv = fs.readFileSync(path.join(dataDir, "ecommerce_customers.csv"), "utf8");
const countriesCsv = fs.readFileSync(path.join(dataDir, "ecommerce_country_breakdown.csv"), "utf8");
const orderItemsCsv = fs.readFileSync(path.join(dataDir, "ecommerce_order_items.csv"), "utf8");

const products = parseCsv(productsCsv);
const orders = parseCsv(ordersCsv);
const monthly = parseCsv(monthlyCsv);
const customers = parseCsv(customersCsv);
const countries = parseCsv(countriesCsv);
const orderItems = parseCsv(orderItemsCsv);

let sql = `-- ==============================================================
-- Supabase Schema & Data Dump for Ecommerce Dashboard
-- Target Supabase Project: ksuttdxcbiedaywdttvf
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ksuttdxcbiedaywdttvf/sql/new
-- ==============================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.ecommerce_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  units_sold INTEGER NOT NULL DEFAULT 0,
  total_revenue NUMERIC(12, 2) NOT NULL DEFAULT 0,
  revenue_share TEXT DEFAULT '0%',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ecommerce_monthly_stats (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL DEFAULT 2026,
  month_num INTEGER NOT NULL,
  period TEXT NOT NULL,
  revenue NUMERIC(12, 2) NOT NULL DEFAULT 0,
  orders_count INTEGER NOT NULL DEFAULT 0,
  avg_order_value NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ecommerce_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  email TEXT,
  country TEXT,
  total_orders INTEGER NOT NULL DEFAULT 1,
  total_spend NUMERIC(12, 2) NOT NULL DEFAULT 0,
  vip_tier TEXT DEFAULT 'Bronze',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ecommerce_country_breakdown (
  id SERIAL PRIMARY KEY,
  country TEXT NOT NULL UNIQUE,
  total_sales NUMERIC(12, 2) NOT NULL DEFAULT 0,
  orders_count INTEGER NOT NULL DEFAULT 0,
  market_share_percentage TEXT DEFAULT '0%',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ecommerce_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL UNIQUE,
  order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  country TEXT NOT NULL,
  order_status TEXT NOT NULL DEFAULT 'Completed',
  payment_status TEXT NOT NULL DEFAULT 'Paid',
  fulfillment_status TEXT NOT NULL DEFAULT 'Fulfilled',
  items_count INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ecommerce_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  stock_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  line_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.ecommerce_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecommerce_monthly_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecommerce_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecommerce_country_breakdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecommerce_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecommerce_order_items ENABLE ROW LEVEL SECURITY;

-- 3. Create Public Read Policies
DROP POLICY IF EXISTS "Allow public read on ecommerce_products" ON public.ecommerce_products;
CREATE POLICY "Allow public read on ecommerce_products" ON public.ecommerce_products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on ecommerce_monthly_stats" ON public.ecommerce_monthly_stats;
CREATE POLICY "Allow public read on ecommerce_monthly_stats" ON public.ecommerce_monthly_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on ecommerce_customers" ON public.ecommerce_customers;
CREATE POLICY "Allow public read on ecommerce_customers" ON public.ecommerce_customers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on ecommerce_country_breakdown" ON public.ecommerce_country_breakdown;
CREATE POLICY "Allow public read on ecommerce_country_breakdown" ON public.ecommerce_country_breakdown FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on ecommerce_orders" ON public.ecommerce_orders;
CREATE POLICY "Allow public read on ecommerce_orders" ON public.ecommerce_orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on ecommerce_order_items" ON public.ecommerce_order_items;
CREATE POLICY "Allow public read on ecommerce_order_items" ON public.ecommerce_order_items FOR SELECT USING (true);

-- 4. Insert Products (${products.length} records)
INSERT INTO public.ecommerce_products (stock_code, name, category, price, units_sold, total_revenue, revenue_share)
VALUES
`;

sql += products
  .map(
    (p) =>
      `  (${escapeSql(p.stock_code)}, ${escapeSql(p.product_name)}, ${escapeSql(p.category)}, ${Number(p.unit_price || 0).toFixed(2)}, ${Number(p.units_sold || 0)}, ${Number(p.total_revenue || 0).toFixed(2)}, ${escapeSql(p.revenue_share)})`,
  )
  .join(",\n");

sql += `
ON CONFLICT (stock_code) DO UPDATE
SET name = EXCLUDED.name, category = EXCLUDED.category, price = EXCLUDED.price,
    units_sold = EXCLUDED.units_sold, total_revenue = EXCLUDED.total_revenue, revenue_share = EXCLUDED.revenue_share;

-- 5. Insert Monthly Revenue Stats (${monthly.length} records)
INSERT INTO public.ecommerce_monthly_stats (year, month_num, period, revenue, orders_count, avg_order_value)
VALUES
`;

sql += monthly
  .map(
    (m) =>
      `  (${Number(m.year || 2026)}, ${Number(m.month_num)}, ${escapeSql(m.period)}, ${Number(m.revenue || 0).toFixed(2)}, ${Number(m.orders_count || 0)}, ${Number(m.avg_order_value || 0).toFixed(2)})`,
  )
  .join(",\n");

sql += `;\n\n-- 6. Insert Customers (${customers.length} records)\nINSERT INTO public.ecommerce_customers (customer_id, customer_name, email, country, total_orders, total_spend, vip_tier)\nVALUES\n`;

sql += customers
  .map(
    (c) =>
      `  (${escapeSql(c.customer_id)}, ${escapeSql(c.customer_name)}, ${escapeSql(c.email)}, ${escapeSql(c.country)}, ${Number(c.total_orders || 1)}, ${Number(c.total_spend || 0).toFixed(2)}, ${escapeSql(c.vip_tier)})`,
  )
  .join(",\n");

sql += `
ON CONFLICT (customer_id) DO UPDATE
SET customer_name = EXCLUDED.customer_name, email = EXCLUDED.email, country = EXCLUDED.country,
    total_orders = EXCLUDED.total_orders, total_spend = EXCLUDED.total_spend, vip_tier = EXCLUDED.vip_tier;

-- 7. Insert Country Breakdown (${countries.length} records)
INSERT INTO public.ecommerce_country_breakdown (country, total_sales, orders_count, market_share_percentage)
VALUES
`;

sql += countries
  .map(
    (c) =>
      `  (${escapeSql(c.country)}, ${Number(c.total_sales || 0).toFixed(2)}, ${Number(c.orders_count || 0)}, ${escapeSql(c.market_share_percentage)})`,
  )
  .join(",\n");

sql += `
ON CONFLICT (country) DO UPDATE
SET total_sales = EXCLUDED.total_sales, orders_count = EXCLUDED.orders_count, market_share_percentage = EXCLUDED.market_share_percentage;

-- 8. Insert Orders (${orders.length} records)
INSERT INTO public.ecommerce_orders (order_id, order_date, customer_id, customer_name, country, order_status, payment_status, fulfillment_status, items_count, subtotal, tax_amount, shipping_fee, total_amount, created_at)
VALUES
`;

sql += orders
  .map(
    (o) =>
      `  (${escapeSql(o.order_id)}, ${escapeSql(o.order_date)}, ${escapeSql(o.customer_id)}, ${escapeSql(o.customer_name)}, ${escapeSql(o.country)}, ${escapeSql(o.order_status)}, ${escapeSql(o.payment_status)}, ${escapeSql(o.fulfillment_status)}, ${Number(o.items_count || 1)}, ${Number(o.subtotal || 0).toFixed(2)}, ${Number(o.tax_amount || 0).toFixed(2)}, ${Number(o.shipping_fee || 0).toFixed(2)}, ${Number(o.total_amount || 0).toFixed(2)}, ${escapeSql(o.order_date)})`,
  )
  .join(",\n");

sql += `
ON CONFLICT (order_id) DO UPDATE
SET order_status = EXCLUDED.order_status, payment_status = EXCLUDED.payment_status, fulfillment_status = EXCLUDED.fulfillment_status, total_amount = EXCLUDED.total_amount;

-- 9. Insert Order Items (${orderItems.length} records)
INSERT INTO public.ecommerce_order_items (order_id, stock_code, product_name, category, unit_price, quantity, line_total)
VALUES
`;

sql += orderItems
  .map(
    (item) =>
      `  (${escapeSql(item.order_id)}, ${escapeSql(item.stock_code)}, ${escapeSql(item.product_name)}, ${escapeSql(item.category)}, ${Number(item.unit_price || 0).toFixed(2)}, ${Number(item.quantity || 1)}, ${Number(item.line_total || 0).toFixed(2)})`,
  )
  .join(",\n");

sql += `;\n`;

fs.writeFileSync(path.join(outDir, "dump_ecommerce.sql"), sql, "utf8");
fs.writeFileSync(path.join(migrationsDir, "20261118_ecommerce_data_dump.sql"), sql, "utf8");

console.log(`Generated SQL dump successfully:`);
console.log(`- ${path.join(outDir, "dump_ecommerce.sql")}`);
console.log(`- ${path.join(migrationsDir, "20261118_ecommerce_data_dump.sql")}`);
