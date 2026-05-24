import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "mieux-interiors";
    
    const paramsToSign = {
      timestamp,
      folder,
    };
    
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
      throw new Error("CLOUDINARY_API_SECRET is not configured");
    }
    
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );
    
    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error: any) {
    console.error("Sign API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate signature" },
      { status: 500 }
    );
  }
}
