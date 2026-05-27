import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/data-store";

export async function GET() {
  try {
    return NextResponse.json(await getSiteContent());
  } catch {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}
