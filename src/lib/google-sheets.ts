import { defaultEcommerceData, type EcommerceDashboardData, fetchEcommerceData } from "@/lib/ecommerce/data";

export type { EcommerceDashboardData };
export { defaultEcommerceData };

export async function fetchEcommerceSheetData(): Promise<EcommerceDashboardData | null> {
  return fetchEcommerceData();
}
