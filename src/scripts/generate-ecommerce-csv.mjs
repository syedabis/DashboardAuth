import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "..", "data", "ecommerce");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. PRODUCTS
const products = [
  {
    stockCode: "85123A",
    name: "Linen Overshirt",
    category: "Apparel",
    price: 65.0,
    unitsSold: 228,
    sales: 14820,
    share: "31.0%",
  },
  {
    stockCode: "71053",
    name: "Everyday Tote",
    category: "Accessories",
    price: 42.0,
    unitsSold: 273,
    sales: 11460,
    share: "24.0%",
  },
  {
    stockCode: "84406B",
    name: "Ceramic Planter",
    category: "Home & Garden",
    price: 29.5,
    unitsSold: 303,
    sales: 8930,
    share: "18.0%",
  },
  {
    stockCode: "22752",
    name: "Wool Throw Blanket",
    category: "Home & Living",
    price: 80.0,
    unitsSold: 91,
    sales: 7280,
    share: "15.0%",
  },
  {
    stockCode: "21733",
    name: "Classic Desk Lamp",
    category: "Lighting & Home",
    price: 55.0,
    unitsSold: 110,
    sales: 6070,
    share: "12.0%",
  },
  {
    stockCode: "22423",
    name: "Regency Cakestand 3 Tier",
    category: "Kitchenware",
    price: 34.0,
    unitsSold: 142,
    sales: 4828,
    share: "9.9%",
  },
  {
    stockCode: "47566",
    name: "Party Bunting Garland",
    category: "Party Supplies",
    price: 14.5,
    unitsSold: 280,
    sales: 4060,
    share: "8.4%",
  },
  {
    stockCode: "85099B",
    name: "Jumbo Bag Red Retrospot",
    category: "Storage & Bags",
    price: 9.9,
    unitsSold: 390,
    sales: 3861,
    share: "7.9%",
  },
  {
    stockCode: "20725",
    name: "Lunch Bag Red Retrospot",
    category: "Storage & Bags",
    price: 8.5,
    unitsSold: 410,
    sales: 3485,
    share: "7.2%",
  },
  {
    stockCode: "23203",
    name: "Jumbo Bag Vintage Leaf",
    category: "Storage & Bags",
    price: 9.9,
    unitsSold: 320,
    sales: 3168,
    share: "6.5%",
  },
  {
    stockCode: "22383",
    name: "Lunch Bag Suki Design",
    category: "Storage & Bags",
    price: 8.5,
    unitsSold: 340,
    sales: 2890,
    share: "6.0%",
  },
  {
    stockCode: "20727",
    name: "Lunch Bag Black Skull",
    category: "Storage & Bags",
    price: 8.5,
    unitsSold: 310,
    sales: 2635,
    share: "5.4%",
  },
  {
    stockCode: "22086",
    name: "Paper Chain Kit 50's Christmas",
    category: "Seasonal",
    price: 12.0,
    unitsSold: 215,
    sales: 2580,
    share: "5.3%",
  },
  {
    stockCode: "22960",
    name: "Jam Making Set With Jars",
    category: "Kitchenware",
    price: 18.5,
    unitsSold: 135,
    sales: 2497.5,
    share: "5.1%",
  },
  {
    stockCode: "21212",
    name: "Pack Of 72 Retrospot Cake Cases",
    category: "Kitchenware",
    price: 4.5,
    unitsSold: 520,
    sales: 2340,
    share: "4.8%",
  },
];

const productsCsvHeader = "stock_code,product_name,category,unit_price,units_sold,total_revenue,revenue_share\n";
const productsCsvRows = products
  .map(
    (p) =>
      `"${p.stockCode}","${p.name.replace(/"/g, '""')}","${p.category}",${p.price.toFixed(2)},${p.unitsSold},${p.sales.toFixed(2)},"${p.share}"`,
  )
  .join("\n");
fs.writeFileSync(path.join(outDir, "ecommerce_products.csv"), `${productsCsvHeader}${productsCsvRows}\n`, "utf8");

// 2. COUNTRY BREAKDOWN
const countries = [
  { country: "United Kingdom", sales: 88450.0, orders: 420, percentage: "65.0%" },
  { country: "Germany", sales: 6200.0, orders: 48, percentage: "6.0%" },
  { country: "France", sales: 4800.0, orders: 36, percentage: "4.5%" },
  { country: "EIRE", sales: 2500.0, orders: 20, percentage: "2.4%" },
  { country: "Spain", sales: 2100.0, orders: 18, percentage: "2.0%" },
  { country: "Netherlands", sales: 1850.0, orders: 15, percentage: "1.8%" },
  { country: "Belgium", sales: 1420.0, orders: 12, percentage: "1.4%" },
  { country: "Switzerland", sales: 1250.0, orders: 10, percentage: "1.2%" },
  { country: "Australia", sales: 1100.0, orders: 9, percentage: "1.1%" },
  { country: "Portugal", sales: 980.0, orders: 8, percentage: "1.0%" },
];

const countriesCsvHeader = "country,total_sales,orders_count,market_share_percentage\n";
const countriesCsvRows = countries
  .map((c) => `"${c.country}",${c.sales.toFixed(2)},${c.orders},"${c.percentage}"`)
  .join("\n");
fs.writeFileSync(
  path.join(outDir, "ecommerce_country_breakdown.csv"),
  `${countriesCsvHeader}${countriesCsvRows}\n`,
  "utf8",
);

// 3. MONTHLY REVENUE OVERVIEW
const monthlyRevenue = [
  { monthNum: 1, period: "Jan", revenue: 580000.0, ordersCount: 1400, avgOrderValue: 414.29 },
  { monthNum: 2, period: "Feb", revenue: 620000.0, ordersCount: 1550, avgOrderValue: 400.0 },
  { monthNum: 3, period: "Mar", revenue: 710000.0, ordersCount: 1720, avgOrderValue: 412.79 },
  { monthNum: 4, period: "Apr", revenue: 680000.0, ordersCount: 1680, avgOrderValue: 404.76 },
  { monthNum: 5, period: "May", revenue: 740000.0, ordersCount: 1810, avgOrderValue: 408.84 },
  { monthNum: 6, period: "Jun", revenue: 820000.0, ordersCount: 1980, avgOrderValue: 414.14 },
  { monthNum: 7, period: "Jul", revenue: 890000.0, ordersCount: 2150, avgOrderValue: 413.95 },
  { monthNum: 8, period: "Aug", revenue: 940000.0, ordersCount: 2280, avgOrderValue: 412.28 },
  { monthNum: 9, period: "Sep", revenue: 980000.0, ordersCount: 2410, avgOrderValue: 406.64 },
  { monthNum: 10, period: "Oct", revenue: 1050000.0, ordersCount: 2600, avgOrderValue: 403.85 },
  { monthNum: 11, period: "Nov", revenue: 1210000.0, ordersCount: 2950, avgOrderValue: 410.17 },
  { monthNum: 12, period: "Dec", revenue: 1480000.0, ordersCount: 3500, avgOrderValue: 422.86 },
];

const revenueCsvHeader = "year,month_num,period,revenue,orders_count,avg_order_value\n";
const revenueCsvRows = monthlyRevenue
  .map((m) => `2026,${m.monthNum},"${m.period}",${m.revenue.toFixed(2)},${m.ordersCount},${m.avgOrderValue.toFixed(2)}`)
  .join("\n");
fs.writeFileSync(path.join(outDir, "ecommerce_monthly_revenue.csv"), `${revenueCsvHeader}${revenueCsvRows}\n`, "utf8");

// 4. TOP CUSTOMERS
const topCustomers = [
  {
    id: "17850",
    name: "Customer #17850",
    email: "client17850@retailhub.co.uk",
    country: "United Kingdom",
    totalSpend: 5391.21,
    orderCount: 17,
    vipTier: "Platinum",
  },
  {
    id: "13047",
    name: "Customer #13047",
    email: "client13047@merchants.co.uk",
    country: "United Kingdom",
    totalSpend: 3210.5,
    orderCount: 9,
    vipTier: "Gold",
  },
  {
    id: "12583",
    name: "Customer #12583",
    email: "client12583@boutique.fr",
    country: "France",
    totalSpend: 2840.0,
    orderCount: 6,
    vipTier: "Gold",
  },
  {
    id: "13767",
    name: "Customer #13767",
    email: "client13767@designworks.co.uk",
    country: "United Kingdom",
    totalSpend: 1950.8,
    orderCount: 5,
    vipTier: "Silver",
  },
  {
    id: "17920",
    name: "Customer #17920",
    email: "client17920@artisanltd.co.uk",
    country: "United Kingdom",
    totalSpend: 1420.0,
    orderCount: 4,
    vipTier: "Silver",
  },
  {
    id: "14527",
    name: "Customer #14527",
    email: "client14527@homegoods.co.uk",
    country: "United Kingdom",
    totalSpend: 1380.4,
    orderCount: 4,
    vipTier: "Silver",
  },
  {
    id: "15311",
    name: "Customer #15311",
    email: "client15311@decorhaus.de",
    country: "Germany",
    totalSpend: 1290.0,
    orderCount: 3,
    vipTier: "Bronze",
  },
  {
    id: "14646",
    name: "Customer #14646",
    email: "client14646@nordictrade.nl",
    country: "Netherlands",
    totalSpend: 1150.75,
    orderCount: 3,
    vipTier: "Bronze",
  },
  {
    id: "14911",
    name: "Customer #14911",
    email: "client14911@celticretail.ie",
    country: "EIRE",
    totalSpend: 1040.2,
    orderCount: 3,
    vipTier: "Bronze",
  },
  {
    id: "12415",
    name: "Customer #12415",
    email: "client12415@sydneyimports.au",
    country: "Australia",
    totalSpend: 980.5,
    orderCount: 2,
    vipTier: "Bronze",
  },
];

const additionalNames = [
  { id: "14550", name: "Emma Smith", email: "emma.smith@example.com", country: "United Kingdom", tier: "Bronze" },
  { id: "14536", name: "Melody Macy", email: "melody.macy@example.com", country: "United Kingdom", tier: "Gold" },
  { id: "14521", name: "Max Smith", email: "max.smith@example.com", country: "United Kingdom", tier: "Bronze" },
  { id: "14508", name: "Sean Bean", email: "sean.bean@example.com", country: "United Kingdom", tier: "Platinum" },
  { id: "14492", name: "Brian Cox", email: "brian.cox@example.com", country: "United Kingdom", tier: "Silver" },
  { id: "14477", name: "Mikaela Collins", email: "mikaela.c@example.com", country: "United Kingdom", tier: "Silver" },
  { id: "14455", name: "Oliver Queen", email: "oliver.q@example.com", country: "Germany", tier: "Bronze" },
  { id: "14432", name: "Chloe Decker", email: "chloe.d@example.com", country: "France", tier: "Silver" },
  { id: "14410", name: "Lucifer Morningstar", email: "lucifer.m@example.com", country: "Spain", tier: "Gold" },
  { id: "14399", name: "Dan Espinoza", email: "dan.e@example.com", country: "EIRE", tier: "Bronze" },
  { id: "14375", name: "Ella Lopez", email: "ella.l@example.com", country: "United Kingdom", tier: "Bronze" },
  { id: "14350", name: "Linda Martin", email: "linda.m@example.com", country: "Germany", tier: "Silver" },
  { id: "14320", name: "Amenadiel Firstborn", email: "amenadiel@example.com", country: "United Kingdom", tier: "Gold" },
  { id: "14290", name: "Mazikeen Lilim", email: "mazikeen@example.com", country: "France", tier: "Silver" },
  { id: "14260", name: "Marcus Pierce", email: "marcus.p@example.com", country: "Spain", tier: "Bronze" },
  {
    id: "14230",
    name: "Charlotte Richards",
    email: "charlotte.r@example.com",
    country: "United Kingdom",
    tier: "Platinum",
  },
  { id: "14200", name: "Trixie Espinoza", email: "trixie.e@example.com", country: "United Kingdom", tier: "Bronze" },
  { id: "14180", name: "Michael Demiurgos", email: "michael.d@example.com", country: "Germany", tier: "Silver" },
  { id: "14150", name: "Eve Garden", email: "eve.g@example.com", country: "Belgium", tier: "Silver" },
  { id: "14120", name: "Remiel Angel", email: "remiel@example.com", country: "Switzerland", tier: "Bronze" },
  { id: "14090", name: "Uriel Brother", email: "uriel@example.com", country: "Australia", tier: "Bronze" },
  { id: "14060", name: "Gabriel Messenger", email: "gabriel@example.com", country: "Portugal", tier: "Bronze" },
  { id: "14030", name: "Azrael Blade", email: "azrael@example.com", country: "United Kingdom", tier: "Gold" },
  { id: "14000", name: "Zadkiel Righteous", email: "zadkiel@example.com", country: "United Kingdom", tier: "Bronze" },
  { id: "13970", name: "Jophiel Beauty", email: "jophiel@example.com", country: "France", tier: "Silver" },
];

const allCustomers = [...topCustomers];
for (const add of additionalNames) {
  allCustomers.push({
    id: add.id,
    name: add.name,
    email: add.email,
    country: add.country,
    totalSpend: Math.round((Math.random() * 800 + 150) * 100) / 100,
    orderCount: Math.floor(Math.random() * 4) + 1,
    vipTier: add.tier,
  });
}

const customersCsvHeader = "customer_id,customer_name,email,country,total_orders,total_spend,vip_tier\n";
const customersCsvRows = allCustomers
  .map(
    (c) =>
      `"${c.id}","${c.name}","${c.email}","${c.country}",${c.orderCount || 1},${c.totalSpend.toFixed(2)},"${c.vipTier}"`,
  )
  .join("\n");
fs.writeFileSync(path.join(outDir, "ecommerce_customers.csv"), `${customersCsvHeader}${customersCsvRows}\n`, "utf8");

// 5. DETAILED ORDERS & ORDER ITEMS
const orders = [];
const orderItems = [];

const seedOrders = [
  {
    id: "536365",
    customerId: "17850",
    date: "2026-11-14 08:26:00",
    total: 139.1,
    status: "Completed",
    payment: "Paid",
    fulfillment: "Fulfilled",
    country: "United Kingdom",
    itemsCount: 6,
  },
  {
    id: "536366",
    customerId: "17850",
    date: "2026-11-14 08:28:00",
    total: 22.2,
    status: "Completed",
    payment: "Paid",
    fulfillment: "Fulfilled",
    country: "United Kingdom",
    itemsCount: 2,
  },
  {
    id: "536367",
    customerId: "13047",
    date: "2026-11-14 08:34:00",
    total: 278.7,
    status: "Completed",
    payment: "Paid",
    fulfillment: "Fulfilled",
    country: "United Kingdom",
    itemsCount: 12,
  },
  {
    id: "536368",
    customerId: "13047",
    date: "2026-11-14 08:34:00",
    total: 70.05,
    status: "Completed",
    payment: "Paid",
    fulfillment: "Fulfilled",
    country: "United Kingdom",
    itemsCount: 4,
  },
  {
    id: "536369",
    customerId: "13047",
    date: "2026-11-14 08:35:00",
    total: 17.85,
    status: "Completed",
    payment: "Paid",
    fulfillment: "Fulfilled",
    country: "United Kingdom",
    itemsCount: 1,
  },
  {
    id: "536370",
    customerId: "12583",
    date: "2026-11-14 08:45:00",
    total: 855.86,
    status: "Completed",
    payment: "Paid",
    fulfillment: "Fulfilled",
    country: "France",
    itemsCount: 20,
  },
  {
    id: "C536379",
    customerId: "14527",
    date: "2026-11-14 09:41:00",
    total: -27.5,
    status: "Returned",
    payment: "Refunded",
    fulfillment: "Returned",
    country: "United Kingdom",
    itemsCount: 1,
  },
];

const tableOrders = [
  {
    id: "14550",
    customerId: "14550",
    date: "2026-05-09 16:42:00",
    total: 248.0,
    status: "Pending",
    payment: "Pending",
    fulfillment: "Unfulfilled",
    country: "United Kingdom",
    itemsCount: 2,
  },
  {
    id: "14536",
    customerId: "14536",
    date: "2026-05-09 14:18:00",
    total: 1200.0,
    status: "Completed",
    payment: "Paid",
    fulfillment: "Fulfilled",
    country: "United Kingdom",
    itemsCount: 3,
  },
  {
    id: "14521",
    customerId: "14521",
    date: "2026-05-08 21:05:00",
    total: 79.0,
    status: "Pending",
    payment: "Pending",
    fulfillment: "Unfulfilled",
    country: "United Kingdom",
    itemsCount: 1,
  },
  {
    id: "14508",
    customerId: "14508",
    date: "2026-05-08 18:36:00",
    total: 5500.0,
    status: "Completed",
    payment: "Paid",
    fulfillment: "Fulfilled",
    country: "United Kingdom",
    itemsCount: 5,
  },
  {
    id: "14492",
    customerId: "14492",
    date: "2026-05-07 19:50:00",
    total: 880.0,
    status: "Returned",
    payment: "Refunded",
    fulfillment: "Returned",
    country: "United Kingdom",
    itemsCount: 2,
  },
  {
    id: "14477",
    customerId: "14477",
    date: "2026-05-07 13:24:00",
    total: 135.0,
    status: "Completed",
    payment: "Paid",
    fulfillment: "Fulfilled",
    country: "United Kingdom",
    itemsCount: 1,
  },
];

for (const o of [...seedOrders, ...tableOrders]) {
  const cust = allCustomers.find((c) => c.id === o.customerId) || {
    name: `Customer #${o.customerId}`,
    country: o.country,
  };
  orders.push({
    orderId: o.id,
    orderDate: o.date,
    customerId: o.customerId,
    customerName: cust.name,
    customerCountry: o.country || cust.country,
    orderStatus: o.status,
    paymentStatus: o.payment,
    fulfillmentStatus: o.fulfillment,
    itemsCount: o.itemsCount,
    subtotal: Math.abs(o.total),
    taxAmount: Math.round(Math.abs(o.total) * 0.1 * 100) / 100,
    shippingFee: o.total > 100 ? 0.0 : 9.99,
    totalAmount: o.total,
  });
}

const baseInvoice = 536380;
const startMs = new Date("2026-01-01T00:00:00Z").getTime();
const endMs = new Date("2026-11-18T10:00:00Z").getTime();

for (let i = 0; i < 366; i++) {
  const isReturn = i % 21 === 0;
  const invoiceNum = isReturn ? `C${baseInvoice + i}` : `${baseInvoice + i}`;
  const randomCust = allCustomers[Math.floor(Math.random() * allCustomers.length)];
  const randomDateMs = startMs + Math.random() * (endMs - startMs);
  const dateObj = new Date(randomDateMs);
  const formattedDate = dateObj.toISOString().replace("T", " ").substring(0, 19);

  const numItems = Math.floor(Math.random() * 5) + 1;
  let orderTotal = 0;

  for (let j = 0; j < numItems; j++) {
    const prod = products[Math.floor(Math.random() * products.length)];
    const qty = Math.floor(Math.random() * 3) + 1;
    const itemTotal = qty * prod.price;
    orderTotal += itemTotal;

    orderItems.push({
      orderId: invoiceNum,
      stockCode: prod.stockCode,
      productName: prod.name,
      category: prod.category,
      unitPrice: prod.price,
      quantity: isReturn ? -qty : qty,
      lineTotal: isReturn ? -itemTotal : itemTotal,
    });
  }

  const tax = Math.round(orderTotal * 0.1 * 100) / 100;
  const shipping = orderTotal > 100 ? 0.0 : 9.99;
  const grandTotal = isReturn ? -orderTotal : orderTotal + tax + shipping;

  orders.push({
    orderId: invoiceNum,
    orderDate: formattedDate,
    customerId: randomCust.id,
    customerName: randomCust.name,
    customerCountry: randomCust.country,
    orderStatus: isReturn ? "Returned" : "Completed",
    paymentStatus: isReturn ? "Refunded" : "Paid",
    fulfillmentStatus: isReturn ? "Returned" : "Fulfilled",
    itemsCount: numItems,
    subtotal: Math.round(orderTotal * 100) / 100,
    taxAmount: tax,
    shippingFee: isReturn ? 0.0 : shipping,
    totalAmount: Math.round(grandTotal * 100) / 100,
  });
}

const ordersCsvHeader =
  "order_id,order_date,customer_id,customer_name,country,order_status,payment_status,fulfillment_status,items_count,subtotal,tax_amount,shipping_fee,total_amount\n";
const ordersCsvRows = orders
  .map(
    (o) =>
      `"${o.orderId}","${o.orderDate}","${o.customerId}","${o.customerName.replace(/"/g, '""')}","${o.customerCountry}","${o.orderStatus}","${o.paymentStatus}","${o.fulfillmentStatus}",${o.itemsCount},${o.subtotal.toFixed(2)},${o.taxAmount.toFixed(2)},${o.shippingFee.toFixed(2)},${o.totalAmount.toFixed(2)}`,
  )
  .join("\n");
fs.writeFileSync(path.join(outDir, "ecommerce_orders.csv"), `${ordersCsvHeader}${ordersCsvRows}\n`, "utf8");

const orderItemsCsvHeader = "order_id,stock_code,product_name,category,unit_price,quantity,line_total\n";
const orderItemsCsvRows = orderItems
  .map(
    (item) =>
      `"${item.orderId}","${item.stockCode}","${item.productName.replace(/"/g, '""')}","${item.category}",${item.unitPrice.toFixed(2)},${item.quantity},${item.lineTotal.toFixed(2)}`,
  )
  .join("\n");
fs.writeFileSync(
  path.join(outDir, "ecommerce_order_items.csv"),
  `${orderItemsCsvHeader}${orderItemsCsvRows}\n`,
  "utf8",
);

console.log(`Successfully generated all e-commerce CSV files in ${outDir}`);
