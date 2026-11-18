import { createClient } from "@supabase/supabase-js";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "..", "data", "ecommerce");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ksuttdxcbiedaywdttvf.supabase.co";
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdXR0ZHhjYmllZGF5d2R0dHZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDk4MDk4NywiZXhwIjoyMTEwNTU2OTg3fQ.U8F1oNDrOh6nooUc2rdNJk1BR9x1b70mC-iPbAvQek4";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

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

async function dump() {
  console.log("Checking Supabase connection and tables...");

  // Check if tables exist
  const { error: testError } = await supabase.from("ecommerce_orders").select("order_id").limit(1);

  if (testError && testError.code === "PGRST205") {
    console.log("\n⚠️  Supabase tables have not been created yet in the public schema.");
    console.log("Please run the SQL migration in your Supabase SQL Editor:");
    console.log("👉 https://supabase.com/dashboard/project/ksuttdxcbiedaywdttvf/sql/new");
    console.log("File path: supabase/dump_ecommerce.sql\n");
    return;
  }

  console.log("Tables found! Syncing data directly from CSVs to Supabase...\n");

  // 1. Products
  const products = parseCsv(fs.readFileSync(path.join(dataDir, "ecommerce_products.csv"), "utf8")).map((p) => ({
    stock_code: p.stock_code,
    name: p.product_name,
    category: p.category,
    price: Number(p.unit_price || 0),
    units_sold: Number(p.units_sold || 0),
    total_revenue: Number(p.total_revenue || 0),
    revenue_share: p.revenue_share || "0%",
  }));
  const { error: pErr } = await supabase.from("ecommerce_products").upsert(products, { onConflict: "stock_code" });
  if (pErr) console.error("Error syncing products:", pErr.message);
  else console.log(`✓ Synced ${products.length} products`);

  // 2. Monthly Stats
  const monthly = parseCsv(fs.readFileSync(path.join(dataDir, "ecommerce_monthly_revenue.csv"), "utf8")).map((m) => ({
    year: Number(m.year || 2026),
    month_num: Number(m.month_num),
    period: m.period,
    revenue: Number(m.revenue || 0),
    orders_count: Number(m.orders_count || 0),
    avg_order_value: Number(m.avg_order_value || 0),
  }));
  const { error: mErr } = await supabase.from("ecommerce_monthly_stats").upsert(monthly);
  if (mErr) console.error("Error syncing monthly stats:", mErr.message);
  else console.log(`✓ Synced ${monthly.length} monthly revenue stats`);

  // 3. Customers
  const customers = parseCsv(fs.readFileSync(path.join(dataDir, "ecommerce_customers.csv"), "utf8")).map((c) => ({
    customer_id: c.customer_id,
    customer_name: c.customer_name,
    email: c.email,
    country: c.country,
    total_orders: Number(c.total_orders || 1),
    total_spend: Number(c.total_spend || 0),
    vip_tier: c.vip_tier || "Bronze",
  }));
  const { error: cErr } = await supabase.from("ecommerce_customers").upsert(customers, { onConflict: "customer_id" });
  if (cErr) console.error("Error syncing customers:", cErr.message);
  else console.log(`✓ Synced ${customers.length} customers`);

  // 4. Country Breakdown
  const countries = parseCsv(fs.readFileSync(path.join(dataDir, "ecommerce_country_breakdown.csv"), "utf8")).map(
    (c) => ({
      country: c.country,
      total_sales: Number(c.total_sales || 0),
      orders_count: Number(c.orders_count || 0),
      market_share_percentage: c.market_share_percentage || "0%",
    }),
  );
  const { error: coErr } = await supabase
    .from("ecommerce_country_breakdown")
    .upsert(countries, { onConflict: "country" });
  if (coErr) console.error("Error syncing country breakdown:", coErr.message);
  else console.log(`✓ Synced ${countries.length} countries`);

  // 5. Orders (batch in chunks of 100)
  const orders = parseCsv(fs.readFileSync(path.join(dataDir, "ecommerce_orders.csv"), "utf8")).map((o) => ({
    order_id: o.order_id,
    order_date: o.order_date,
    customer_id: o.customer_id,
    customer_name: o.customer_name,
    country: o.country,
    order_status: o.order_status,
    payment_status: o.payment_status,
    fulfillment_status: o.fulfillment_status,
    items_count: Number(o.items_count || 1),
    subtotal: Number(o.subtotal || 0),
    tax_amount: Number(o.tax_amount || 0),
    shipping_fee: Number(o.shipping_fee || 0),
    total_amount: Number(o.total_amount || 0),
  }));

  const chunkSize = 100;
  let syncedOrders = 0;
  for (let i = 0; i < orders.length; i += chunkSize) {
    const chunk = orders.slice(i, i + chunkSize);
    const { error: oErr } = await supabase.from("ecommerce_orders").upsert(chunk, { onConflict: "order_id" });
    if (oErr) {
      console.error(`Error syncing orders chunk ${i}-${i + chunk.length}:`, oErr.message);
    } else {
      syncedOrders += chunk.length;
    }
  }
  console.log(`✓ Synced ${syncedOrders} orders`);

  console.log("\nAll data dumped successfully into Supabase!");
}

dump().catch(console.error);
