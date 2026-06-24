import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";

const DEFAULT_HERO_BG_IMAGE = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80";

export async function GET() {
  try {
    await connectDB();
    
    // Find the first settings document
    let setting = await Setting.findOne();
    
    if (!setting) {
      // Return a default settings object if none is found in DB
      return NextResponse.json({
        success: true,
        data: {
          heroBgImage: DEFAULT_HERO_BG_IMAGE
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: setting
    });
  } catch (error: any) {
    console.error("Public Settings API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load settings" },
      { status: 500 }
    );
  }
}
