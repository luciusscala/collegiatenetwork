"use server";

import { requireAuth, createAuthClient } from "@/utils/auth/server";
import { redirect } from "next/navigation";

export async function updateSessionAction(sessionId: string, formData: FormData) {
  const user = await requireAuth();
  const supabase = await createAuthClient();

  const title = formData.get("title")?.toString() || "";
  let date = formData.get("date")?.toString() || "";
  if (date) {
    // Convert 'YYYY-MM-DDTHH:mm' to ISO string with 'Z' (UTC)
    date = new Date(date).toISOString();
  }
  const address = formData.get("address")?.toString() || "";

  const { data: session } = await supabase
    .from("sessions")
    .select("host_id")
    .eq("id", sessionId)
    .single();
  if (!session || session.host_id !== user.id) return redirect(`/sessions/${sessionId}`);

  await supabase
    .from("sessions")
    .update({ title, date, address })
    .eq("id", sessionId);

  redirect(`/sessions`);
} 