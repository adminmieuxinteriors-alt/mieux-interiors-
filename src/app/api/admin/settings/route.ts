import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET as string;
const DEFAULT_HERO_BG_IMAGE = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80";

async function isAdminAuthenticated(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    let setting = await Setting.findOne();
    if (!setting) {
      setting = { heroBgImage: DEFAULT_HERO_BG_IMAGE };
    }
    return NextResponse.json({ success: true, data: setting });
  } catch (error: any) {
    console.error("Admin Settings GET Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { heroBgImage } = body;

    if (!heroBgImage) {
      return NextResponse.json(
        { success: false, message: "Hero background image URL is required" },
        { status: 400 }
      );
    }

    await connectDB();
    
    const setting = await Setting.findOneAndUpdate(
      {},
      { heroBgImage },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      data: setting,
      message: "Settings updated successfully"
    });
  } catch (error: any) {
    console.error("Admin Settings PUT Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
