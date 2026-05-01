import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (password !== adminPassword) {
    return NextResponse.redirect(new URL("/admin?error=invalid", req.url));
  }

  const response = NextResponse.redirect(new URL("/admin", req.url));
  response.cookies.set("admin_session", adminPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });
  return response;
}
