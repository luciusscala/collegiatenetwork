"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function updateSessionAction(sessionId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const title = formData.get("title")?.toString() || "";
  const date = formData.get("date")?.toString() || "";
  const location = formData.get("location")?.toString() || "";

  try {
    // Fetch session to check host
    const { data: session, error: fetchError } = await supabase
      .from("sessions")
      .select("host_id")
      .eq("id", sessionId)
      .single();
    if (fetchError || !session) throw fetchError || new Error("Session not found");
    if (session.host_id !== user.id) return redirect(`/sessions/${sessionId}`);

    // Update session
    const { error: updateError } = await supabase
      .from("sessions")
      .update({ title, date, location })
      .eq("id", sessionId);
    if (updateError) throw updateError;
    redirect(`/sessions/${sessionId}`); // No return after redirect
  } catch (error) {
    // Ignore Next.js redirect errors
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      return;
    }
    console.error("Error updating session:", error);
    redirect(`/sessions/${sessionId}/edit?error=Failed%20to%20update%20session`);
  }
} 