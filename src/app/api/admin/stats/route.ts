import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Inquiry from "@/models/Inquiry";
import Testimonial from "@/models/Testimonial";
import Service from "@/models/Service";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const [
      totalProjects,
      totalInquiries,
      newInquiries,
      totalTestimonials,
      totalServices,
      totalUsers,
      recentInquiries,
    ] = await Promise.all([
      Project.countDocuments(),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "new" }),
      Testimonial.countDocuments(),
      Service.countDocuments(),
      User.countDocuments(),
      Inquiry.find().sort({ createdAt: -1 }).limit(5),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        totalInquiries,
        newInquiries,
        totalTestimonials,
        totalServices,
        totalUsers,
        recentInquiries,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
