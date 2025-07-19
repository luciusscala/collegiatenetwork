import { createAuthClient } from "@/utils/auth/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createAuthClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Check if user exists in our custom users table
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", data.user.id)
        .single();

      // If user doesn't exist in our custom table, create them
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            id: data.user.id,
            name: data.user.user_metadata?.name || "Unknown",
            school: data.user.user_metadata?.school || "Unknown", 
            position: data.user.user_metadata?.position || "Unknown",
          });

        if (insertError) {
          console.error("Error creating user profile:", insertError);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}