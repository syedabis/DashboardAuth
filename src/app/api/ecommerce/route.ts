import { NextResponse } from "next/server";

import { fetchEcommerceData } from "@/lib/ecommerce/data";

export async function GET() {
  const data = await fetchEcommerceData();
  return NextResponse.json(data);
}
