import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image data is required" },
        { status: 400 }
      );
    }

    const uploaded = await cloudinary.uploader.upload(image, {
      folder: "mieux-interiors",
      resource_type: "auto",
    });

    return NextResponse.json({
      success: true,
      url: uploaded.secure_url,
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
