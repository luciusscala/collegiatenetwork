import { createClient } from "@/utils/supabase/server";
import WelcomeHeader from "@/components/WelcomeHeader";
import MySessions from "@/components/MySessions";
import NearbySessions from "@/components/NearbySessions";
import SuggestedAthletes from "@/components/SuggestedAthletes";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current session and user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Should never hit here in protected/dashboard context, but fallback
    return <div className="p-8 text-center">Not authenticated</div>;
  }

  // Fetch current user details
  const { data: currentUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch sessions the user participates in
  const { data: mySessions } = await supabase
    .from("session_participants")
    .select("*, session:sessions(*)")
    .eq("user_id", user.id);

  // Fetch 5 public sessions
  const { data: publicSessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("public", true)
    .order("start_time", { ascending: true })
    .limit(5);

  // Fetch 5 other users
  const { data: suggestedAthletes } = await supabase
    .from("users")
    .select("*")
    .neq("id", user.id)
    .limit(5);

  return (
    <main className="max-w-3xl mx-auto w-full p-4 md:p-8 flex flex-col gap-8">
      <WelcomeHeader username={currentUser?.username || "Athlete"} />
      <section>
        <MySessions sessions={mySessions?.map((s: any) => s.session) || []} />
      </section>
      <section>
        <NearbySessions sessions={publicSessions || []} />
      </section>
      <section>
        <SuggestedAthletes users={suggestedAthletes || []} />
      </section>
    </main>
  );
}