import { NextResponse } from "next/server";

import { fetchCrmData } from "@/lib/crm/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await fetchCrmData();
  return NextResponse.json(data);
}
