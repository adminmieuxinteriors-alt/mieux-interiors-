import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { inquirySchema } from "@/lib/validations/inquiry";
import { z } from "zod";

export async function GET() {
  try {
    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: inquiries });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Fetch inquiries failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = inquirySchema.parse(body);

    await connectDB();
    const inquiry = await Inquiry.create(validated);

    return NextResponse.json(
      { success: true, data: inquiry, message: "Inquiry submitted successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errorMsg = error.issues.map((issue) => issue.message).join(", ");
      return NextResponse.json(
        { success: false, message: errorMsg },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || "Submission failed" },
      { status: 400 }
    );
  }
}
