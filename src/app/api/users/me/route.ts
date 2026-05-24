import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("user_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, user: null, message: "Not logged in" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      success: true,
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
      },
    });
  } catch (error) {
    console.error("Session verification failed:", error);
    return NextResponse.json(
      { success: false, user: null, message: "Invalid token" },
      { status: 401 }
    );
  }
}
