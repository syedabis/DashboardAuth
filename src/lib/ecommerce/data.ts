import { supabaseAdmin } from "@/lib/supabase/admin";

export interface EcommerceDashboardData {
  kpis: {
    totalSales: number;
    totalSalesFormatted: string;
    totalOrders: number;
    activeCustomers: number;
    avgOrderValue: number;
    avgOrderValueFormatted: string;
    returnOrdersCount: number;
    returnRate: string;
    totalUnitsSold: number;
  };
  revenueOverviewData: Array<{
    period: string;
    revenue: number;
    ordersCount: number;
  }>;
  topProducts: Array<{
    name: string;
    stockCode: string;
    share: string;
    sales: string;
    salesRaw: number;
  }>;
  countryBreakdown: Array<{
    country: string;
    sales: number;
    orders: number;
    percentage: string;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    totalSpend: string;
    orderCount: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    country: string;
    date: string;
    total: string;
    status: "Completed" | "Returned";
    itemsCount: number;
  }>;
  isLiveSupabase?: boolean;
}

export const defaultEcommerceData: EcommerceDashboardData = {
  kpis: {
    totalSales: 48560,
    totalSalesFormatted: "$48,560.00",
    totalOrders: 379,
    activeCustomers: 820,
    avgOrderValue: 128,
    avgOrderValueFormatted: "$128.00",
    returnOrdersCount: 18,
    returnRate: "4%",
    totalUnitsSold: 56445,
  },
  revenueOverviewData: [
    { period: "Jan", revenue: 580000, ordersCount: 1400 },
    { period: "Feb", revenue: 620000, ordersCount: 1550 },
    { period: "Mar", revenue: 710000, ordersCount: 1720 },
    { period: "Apr", revenue: 680000, ordersCount: 1680 },
    { period: "May", revenue: 740000, ordersCount: 1810 },
    { period: "Jun", revenue: 820000, ordersCount: 1980 },
    { period: "Jul", revenue: 890000, ordersCount: 2150 },
    { period: "Aug", revenue: 940000, ordersCount: 2280 },
    { period: "Sep", revenue: 980000, ordersCount: 2410 },
    { period: "Oct", revenue: 1050000, ordersCount: 2600 },
    { period: "Nov", revenue: 1210000, ordersCount: 2950 },
    { period: "Dec", revenue: 1480000, ordersCount: 3500 },
  ],
  topProducts: [
    { name: "Linen Overshirt", stockCode: "85123A", share: "31%", sales: "$14,820", salesRaw: 14820 },
    { name: "Everyday Tote", stockCode: "71053", share: "24%", sales: "$11,460", salesRaw: 11460 },
    { name: "Ceramic Planter", stockCode: "84406B", share: "18%", sales: "$8,930", salesRaw: 8930 },
    { name: "Wool Throw Blanket", stockCode: "22752", share: "15%", sales: "$7,280", salesRaw: 7280 },
    { name: "Classic Desk Lamp", stockCode: "21733", share: "12%", sales: "$6,070", salesRaw: 6070 },
  ],
  countryBreakdown: [
    { country: "United Kingdom", sales: 88450, orders: 420, percentage: "65.0%" },
    { country: "Germany", sales: 6200, orders: 48, percentage: "6.0%" },
    { country: "France", sales: 4800, orders: 36, percentage: "4.5%" },
    { country: "EIRE", sales: 2500, orders: 20, percentage: "2.4%" },
    { country: "Spain", sales: 2100, orders: 18, percentage: "2.0%" },
  ],
  topCustomers: [
    { id: "17850", name: "Customer #17850", totalSpend: "$5,391.21", orderCount: 17 },
    { id: "13047", name: "Customer #13047", totalSpend: "$3,210.50", orderCount: 9 },
    { id: "12583", name: "Customer #12583", totalSpend: "$2,840.00", orderCount: 6 },
    { id: "13767", name: "Customer #13767", totalSpend: "$1,950.80", orderCount: 5 },
    { id: "17920", name: "Customer #17920", totalSpend: "$1,420.00", orderCount: 4 },
  ],
  recentOrders: [
    {
      id: "536365",
      customer: "Customer #17850",
      country: "United Kingdom",
      date: "14/11/2026 08:26",
      total: "$139.10",
      status: "Completed",
      itemsCount: 6,
    },
    {
      id: "536366",
      customer: "Customer #17850",
      country: "United Kingdom",
      date: "14/11/2026 08:28",
      total: "$22.20",
      status: "Completed",
      itemsCount: 2,
    },
    {
      id: "536367",
      customer: "Customer #13047",
      country: "United Kingdom",
      date: "14/11/2026 08:34",
      total: "$278.70",
      status: "Completed",
      itemsCount: 12,
    },
    {
      id: "536368",
      customer: "Customer #13047",
      country: "United Kingdom",
      date: "14/11/2026 08:34",
      total: "$70.05",
      status: "Completed",
      itemsCount: 4,
    },
    {
      id: "536369",
      customer: "Customer #13047",
      country: "United Kingdom",
      date: "14/11/2026 08:35",
      total: "$17.85",
      status: "Completed",
      itemsCount: 1,
    },
    {
      id: "536370",
      customer: "Customer #12583",
      country: "France",
      date: "14/11/2026 08:45",
      total: "$855.86",
      status: "Completed",
      itemsCount: 20,
    },
    {
      id: "C536379",
      customer: "Customer #14527",
      country: "United Kingdom",
      date: "14/11/2026 09:41",
      total: "$27.50",
      status: "Returned",
      itemsCount: 1,
    },
  ],
  isLiveSupabase: false,
};

interface SupabaseOrderRow {
  order_id: string;
  order_date: string;
  customer_id: string;
  customer_name: string;
  country: string;
  order_status: "Completed" | "Returned" | "Pending";
  payment_status: string;
  fulfillment_status: string;
  items_count: number;
  total_amount: number;
}

interface SupabaseProductRow {
  stock_code: string;
  name: string;
  category: string;
  price: number;
  units_sold: number;
  total_revenue: number;
  revenue_share: string;
}

interface SupabaseMonthlyRow {
  year: number;
  month_num: number;
  period: string;
  revenue: number;
  orders_count: number;
}

interface SupabaseCustomerRow {
  customer_id: string;
  customer_name: string;
  country: string;
  total_orders: number;
  total_spend: number;
}

interface SupabaseCountryRow {
  country: string;
  total_sales: number;
  orders_count: number;
  market_share_percentage: string;
}

export async function fetchEcommerceData(): Promise<EcommerceDashboardData> {
  try {
    const [ordersRes, productsRes, monthlyRes, customersRes, countriesRes] = await Promise.all([
      supabaseAdmin.from("ecommerce_orders").select("*").order("order_date", { ascending: false }).limit(500),
      supabaseAdmin.from("ecommerce_products").select("*").order("total_revenue", { ascending: false }).limit(10),
      supabaseAdmin.from("ecommerce_monthly_stats").select("*").order("month_num", { ascending: true }),
      supabaseAdmin.from("ecommerce_customers").select("*").order("total_spend", { ascending: false }).limit(5),
      supabaseAdmin.from("ecommerce_country_breakdown").select("*").order("total_sales", { ascending: false }).limit(5),
    ]);

    if (ordersRes.error || !ordersRes.data || ordersRes.data.length === 0) {
      return defaultEcommerceData;
    }

    const orders = ordersRes.data as SupabaseOrderRow[];
    const products = (productsRes.data || []) as SupabaseProductRow[];
    const monthlyStats = (monthlyRes.data || []) as SupabaseMonthlyRow[];
    const customers = (customersRes.data || []) as SupabaseCustomerRow[];
    const countries = (countriesRes.data || []) as SupabaseCountryRow[];

    // 1. Calculate live KPIs
    const completedOrders = orders.filter((o) => o.order_status === "Completed");
    const returnedOrders = orders.filter((o) => o.order_status === "Returned");
    const totalSales = completedOrders.reduce((sum, o) => sum + Math.max(0, Number(o.total_amount || 0)), 0);
    const totalOrders = orders.length;
    const uniqueCustomerIds = new Set(orders.map((o) => o.customer_id));
    const activeCustomers = uniqueCustomerIds.size;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const returnOrdersCount = returnedOrders.length;
    const returnRate = totalOrders > 0 ? `${Math.round((returnOrdersCount / totalOrders) * 100)}%` : "0%";
    const totalUnitsSold = orders.reduce((sum, o) => sum + Math.abs(Number(o.items_count || 1)), 0);

    const kpis = {
      totalSales: Math.round(totalSales * 100) / 100,
      totalSalesFormatted: `$${totalSales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      totalOrders,
      activeCustomers,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      avgOrderValueFormatted: `$${avgOrderValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      returnOrdersCount,
      returnRate,
      totalUnitsSold,
    };

    // 2. Revenue Overview
    const revenueOverviewData =
      monthlyStats.length > 0
        ? monthlyStats.map((m) => ({
            period: m.period,
            revenue: Number(m.revenue || 0),
            ordersCount: Number(m.orders_count || 0),
          }))
        : defaultEcommerceData.revenueOverviewData;

    // 3. Top Products
    const topProducts =
      products.length > 0
        ? products.slice(0, 5).map((p) => ({
            name: p.name,
            stockCode: p.stock_code,
            share: p.revenue_share || "0%",
            sales: `$${Number(p.total_revenue || 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
            salesRaw: Number(p.total_revenue || 0),
          }))
        : defaultEcommerceData.topProducts;

    // 4. Country Breakdown
    const countryBreakdown =
      countries.length > 0
        ? countries.slice(0, 5).map((c) => ({
            country: c.country,
            sales: Number(c.total_sales || 0),
            orders: Number(c.orders_count || 0),
            percentage: c.market_share_percentage || "0%",
          }))
        : defaultEcommerceData.countryBreakdown;

    // 5. Top Customers
    const topCustomers =
      customers.length > 0
        ? customers.slice(0, 5).map((c) => ({
            id: c.customer_id,
            name: c.customer_name,
            totalSpend: `$${Number(c.total_spend || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            orderCount: Number(c.total_orders || 1),
          }))
        : defaultEcommerceData.topCustomers;

    // 6. Recent Orders
    const recentOrders = orders.slice(0, 15).map((o) => {
      let dateFormatted = o.order_date;
      try {
        const d = new Date(o.order_date);
        dateFormatted = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      } catch {
        // fallback to raw
      }

      return {
        id: o.order_id,
        customer: o.customer_name,
        country: o.country,
        date: dateFormatted,
        total: `$${Math.abs(Number(o.total_amount || 0)).toFixed(2)}`,
        status: o.order_status === "Returned" ? ("Returned" as const) : ("Completed" as const),
        itemsCount: Math.abs(Number(o.items_count || 1)),
      };
    });

    return {
      kpis,
      revenueOverviewData,
      topProducts,
      countryBreakdown,
      topCustomers,
      recentOrders,
      isLiveSupabase: true,
    };
  } catch (err) {
    console.error("Error fetching ecommerce data from Supabase:", err);
    return defaultEcommerceData;
  }
}
