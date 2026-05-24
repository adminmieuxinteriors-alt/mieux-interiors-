import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.delete("user_token");
  response.cookies.delete("mieux_user_logged_in");

  return response;
}
