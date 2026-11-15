import { NextResponse } from "next/server";

import { fetchEcommerceData } from "@/lib/ecommerce/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await fetchEcommerceData();
  return NextResponse.json(data);
}
