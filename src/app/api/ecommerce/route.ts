import { NextResponse } from "next/server";

import { defaultEcommerceData } from "@/lib/google-sheets";

export async function GET() {
  return NextResponse.json(defaultEcommerceData);
}
