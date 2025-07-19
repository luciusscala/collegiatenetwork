import { createAuthClient } from "@/utils/auth/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  const url = new URL(request.url);
  return NextResponse.redirect(`${url.origin}/`);
} 