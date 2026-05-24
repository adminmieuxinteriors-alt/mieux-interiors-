import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Service from "@/models/Service";

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Fetch services failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    const service = await Service.create(body);

    return NextResponse.json(
      { success: true, data: service },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Create service failed" },
      { status: 400 }
    );
  }
}
