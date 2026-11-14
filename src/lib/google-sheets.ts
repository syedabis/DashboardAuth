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
};

export async function fetchEcommerceSheetData(): Promise<EcommerceDashboardData | null> {
  return defaultEcommerceData;
}
