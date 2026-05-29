import { NextRequest, NextResponse } from "next/server";
import { talijaPasscode, TALIJA_COOKIE } from "@/lib/talija-auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const code = talijaPasscode();

  if (!code) return NextResponse.redirect(new URL("/talija", req.url));
  if (password !== code) {
    return NextResponse.redirect(new URL("/talija?error=invalid", req.url));
  }

  const res = NextResponse.redirect(new URL("/talija", req.url));
  res.cookies.set(TALIJA_COOKIE, code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12, // 12 hours — covers a full day of sessions
    path: "/",
  });
  return res;
}
