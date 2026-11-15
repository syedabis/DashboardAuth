import { createAdminClient } from "@/lib/supabase/admin";

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
    returnRate: "0%",
    totalUnitsSold: 56445,
  },
  revenueOverviewData: [
    { period: "Jan", revenue: 58000, ordersCount: 340 },
    { period: "Feb", revenue: 62000, ordersCount: 375 },
    { period: "Mar", revenue: 71000, ordersCount: 420 },
    { period: "Apr", revenue: 68500, ordersCount: 405 },
    { period: "May", revenue: 74200, ordersCount: 445 },
    { period: "Jun", revenue: 82000, ordersCount: 490 },
    { period: "Jul", revenue: 89500, ordersCount: 530 },
    { period: "Aug", revenue: 94000, ordersCount: 560 },
    { period: "Sep", revenue: 98200, ordersCount: 585 },
    { period: "Oct", revenue: 105400, ordersCount: 625 },
    { period: "Nov", revenue: 121000, ordersCount: 710 },
    { period: "Dec", revenue: 148000, ordersCount: 880 },
  ],
  topProducts: [
    { name: "Linen Overshirt", stockCode: "85123A", share: "31%", sales: "$14,820", salesRaw: 14820 },
    { name: "Everyday Leather Tote", stockCode: "71053", share: "24%", sales: "$11,460", salesRaw: 11460 },
    { name: "Ceramic Ribbed Planter", stockCode: "84406B", share: "18%", sales: "$8,930", salesRaw: 8930 },
    { name: "Merino Wool Throw Blanket", stockCode: "22752", share: "15%", sales: "$7,280", salesRaw: 7280 },
    { name: "Architectural Desk Lamp", stockCode: "21733", share: "12%", sales: "$6,070", salesRaw: 6070 },
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
      id: "536371",
      customer: "Customer #13767",
      country: "United Kingdom",
      date: "14/11/2026 09:02",
      total: "$412.50",
      status: "Completed",
      itemsCount: 5,
    },
    {
      id: "C536373",
      customer: "Customer #14527",
      country: "United Kingdom",
      date: "14/11/2026 09:41",
      total: "$27.50",
      status: "Returned",
      itemsCount: 1,
    },
  ],
};

interface SupabaseOrder {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  country: string;
  total_amount: number;
  items_count: number;
  status: "Completed" | "Returned";
  payment_status: string;
  fulfillment_status: string;
  created_at: string;
}

interface SupabaseProduct {
  id: string;
  name: string;
  stock_code: string;
  category: string;
  price: number;
  sales_volume: number;
  total_revenue: number;
}

interface SupabaseMonthlyStat {
  period: string;
  month_num: number;
  year: number;
  revenue: number;
  orders_count: number;
}

export async function fetchEcommerceData(): Promise<EcommerceDashboardData> {
  try {
    const supabase = createAdminClient();

    // Query all 3 tables in parallel
    const [ordersRes, productsRes, monthlyRes] = await Promise.all([
      supabase.from("ecommerce_orders").select("*").order("created_at", { ascending: false }),
      supabase.from("ecommerce_products").select("*").order("total_revenue", { ascending: false }),
      supabase.from("ecommerce_monthly_stats").select("*").order("month_num", { ascending: true }),
    ]);

    // If tables are not created or empty, fallback gracefully to default
    if (ordersRes.error || !ordersRes.data || ordersRes.data.length === 0) {
      return defaultEcommerceData;
    }

    const orders = ordersRes.data as SupabaseOrder[];
    const products = (productsRes.data || []) as SupabaseProduct[];
    const monthlyStats = (monthlyRes.data || []) as SupabaseMonthlyStat[];

    // 1. Calculate KPIs
    const completedOrders = orders.filter((o) => o.status === "Completed");
    const returnedOrders = orders.filter((o) => o.status === "Returned");
    const totalSales = completedOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const totalOrders = orders.length;
    const uniqueCustomerIds = new Set(orders.map((o) => o.customer_id));
    const activeCustomers = uniqueCustomerIds.size;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const returnOrdersCount = returnedOrders.length;
    const returnRate = totalOrders > 0 ? `${((returnOrdersCount / totalOrders) * 100).toFixed(0)}%` : "0%";
    const totalUnitsSold = orders.reduce((sum, o) => sum + Number(o.items_count || 1), 0);

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
    const totalProductRevenue = products.reduce((sum, p) => sum + Number(p.total_revenue || 0), 0);
    const topProducts =
      products.length > 0
        ? products.slice(0, 5).map((p) => {
            const rev = Number(p.total_revenue || 0);
            const sharePct = totalProductRevenue > 0 ? `${Math.round((rev / totalProductRevenue) * 100)}%` : "0%";
            return {
              name: p.name,
              stockCode: p.stock_code,
              share: sharePct,
              sales: `$${rev.toLocaleString("en-US")}`,
              salesRaw: rev,
            };
          })
        : defaultEcommerceData.topProducts;

    // 4. Country Breakdown
    const countryMap = new Map<string, { sales: number; orders: number }>();
    for (const o of orders) {
      const c = o.country || "Other";
      const existing = countryMap.get(c) ?? { sales: 0, orders: 0 };
      if (o.status === "Completed") {
        existing.sales += Number(o.total_amount || 0);
      }
      existing.orders += 1;
      countryMap.set(c, existing);
    }

    const sortedCountries = Array.from(countryMap.entries())
      .map(([country, stats]) => ({
        country,
        sales: Math.round(stats.sales),
        orders: stats.orders,
        percentage: totalSales > 0 ? `${((stats.sales / totalSales) * 100).toFixed(1)}%` : "0%",
      }))
      .sort((a, b) => b.sales - a.sales);

    const countryBreakdown =
      sortedCountries.length > 0 ? sortedCountries.slice(0, 5) : defaultEcommerceData.countryBreakdown;

    // 5. Top Customers
    const customerMap = new Map<string, { id: string; name: string; totalSpend: number; orderCount: number }>();
    for (const o of orders) {
      const cid = o.customer_id;
      const cname = o.customer_name || `Customer #${cid}`;
      const existing = customerMap.get(cid) ?? { id: cid, name: cname, totalSpend: 0, orderCount: 0 };
      if (o.status === "Completed") {
        existing.totalSpend += Number(o.total_amount || 0);
      }
      existing.orderCount += 1;
      customerMap.set(cid, existing);
    }

    const sortedCustomers = Array.from(customerMap.values())
      .map((c) => ({
        id: c.id,
        name: c.name,
        totalSpend: `$${c.totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        orderCount: c.orderCount,
        rawSpend: c.totalSpend,
      }))
      .sort((a, b) => b.rawSpend - a.rawSpend);

    const topCustomers = sortedCustomers.length > 0 ? sortedCustomers.slice(0, 5) : defaultEcommerceData.topCustomers;

    // 6. Recent Orders
    const recentOrders = orders.slice(0, 15).map((o) => {
      let dateFormatted = o.created_at;
      try {
        const d = new Date(o.created_at);
        dateFormatted = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      } catch {
        // keep raw
      }

      return {
        id: o.order_number,
        customer: o.customer_name,
        country: o.country,
        date: dateFormatted,
        total: `$${Number(o.total_amount || 0).toFixed(2)}`,
        status: o.status,
        itemsCount: o.items_count,
      };
    });

    return {
      kpis,
      revenueOverviewData,
      topProducts,
      countryBreakdown,
      topCustomers,
      recentOrders,
    };
  } catch (err) {
    console.error("Error fetching ecommerce data from Supabase:", err);
    return defaultEcommerceData;
  }
}
