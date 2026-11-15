import { format } from "date-fns";
import { Settings2 } from "lucide-react";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { fetchEcommerceData } from "@/lib/ecommerce/data";

import { CountryBreakdown } from "./_components/country-breakdown";
import { KpiStrip } from "./_components/kpi-strip";
import { RecentOrders } from "./_components/recent-orders";
import { EcommerceRefreshButton } from "./_components/refresh-button";
import { TopCustomers } from "./_components/top-customers";
import { TopProducts } from "./_components/top-products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "E-commerce Dashboard | Supabase Connected",
  description:
    "Explore e-commerce sales performance, top products, orders, and customer KPIs powered by live Supabase data.",
  alternates: {
    canonical: "/dashboard/ecommerce",
  },
};

export default async function Page() {
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");
  const sheetData = await fetchEcommerceData();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl leading-none tracking-tight">Ecommerce Data Dashboard</h1>
            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-medium text-[11px] text-emerald-600 dark:text-emerald-400"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              Supabase Connected
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{formattedDate} • Syncing with live database</p>
        </div>

        <div className="flex flex-wrap items-end justify-end gap-2 lg:w-fit">
          <Select defaultValue="all-time">
            <SelectTrigger className="w-34" id="ecommerce-period" size="sm">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" />

          <EcommerceRefreshButton />

          <Button size="icon-sm" variant="outline">
            <Settings2 />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <KpiStrip data={sheetData} />

        <div className="xl:col-span-4">
          <TopProducts products={sheetData.topProducts} />
        </div>

        <div className="xl:col-span-4">
          <CountryBreakdown data={sheetData.countryBreakdown} />
        </div>

        <div className="xl:col-span-4">
          <TopCustomers customers={sheetData.topCustomers} />
        </div>

        <div className="xl:col-span-12">
          <RecentOrders orders={sheetData.recentOrders} />
        </div>
      </div>
    </div>
  );
}
