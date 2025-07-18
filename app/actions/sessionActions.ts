"use server";

import { requireAuth, createAuthClient } from "@/utils/auth/server";
import { redirect } from "next/navigation";

export async function joinSession(formData: FormData) {
  const user = await requireAuth();
  const supabase = await createAuthClient();

  const sessionId = formData.get("session_id")?.toString();
  if (!sessionId) return redirect("/sessions");

  try {
    // Check if already a member
    const { data: existing } = await supabase
      .from("session_members")
      .select("id")
      .eq("session_id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!existing) {
      await supabase.from("session_members").insert({
        session_id: sessionId,
        user_id: user.id,
      });
    }
    redirect(`/sessions/${sessionId}`);
  } catch (error) {
    console.error("Error joining session:", error);
    redirect(`/sessions/${sessionId}?error=Failed%20to%20join%20session`);
  }
}

export async function leaveSession(formData: FormData) {
  const user = await requireAuth();
  const supabase = await createAuthClient();

  const sessionId = formData.get("session_id")?.toString();
  if (!sessionId) return redirect("/sessions");

  try {
    await supabase
      .from("session_members")
      .delete()
      .eq("session_id", sessionId)
      .eq("user_id", user.id);
    redirect(`/sessions/${sessionId}`);
  } catch (error) {
    console.error("Error leaving session:", error);
    redirect(`/sessions/${sessionId}?error=Failed%20to%20leave%20session`);
  }
} 