import { NextResponse } from "next/server";
import { getBookings } from "@/lib/data-store";
import { isAdminAuthenticated } from "@/lib/server-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await getBookings());
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
