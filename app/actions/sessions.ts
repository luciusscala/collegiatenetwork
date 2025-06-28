"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function joinSessionAction(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/sign-in");

  try {
    // Check if already a member
    const { data: existing, error: checkError } = await supabase
      .from("session_members")
      .select("id")
      .eq("session_id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existing) return redirect(`/sessions/${sessionId}`);

    // Insert as participant
    const { error: insertError } = await supabase
      .from("session_members")
      .insert({
        session_id: sessionId,
        user_id: user.id,
        role: "participant",
      });

    if (insertError) throw insertError;
    return redirect(`/sessions/${sessionId}`);
  } catch (error) {
    console.error("Error joining session:", error);
    return { error: "Failed to join session. Please try again." };
  }
}

export async function leaveSessionAction(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/sign-in");

  try {
    const { error: deleteError } = await supabase
      .from("session_members")
      .delete()
      .eq("session_id", sessionId)
      .eq("user_id", user.id);

    if (deleteError) throw deleteError;
    return redirect(`/sessions/${sessionId}`);
  } catch (error) {
    console.error("Error leaving session:", error);
    return { error: "Failed to leave session. Please try again." };
  }
} 