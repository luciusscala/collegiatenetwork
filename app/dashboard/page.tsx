import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Plus, Search, Building2, Sword, FileText } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/app/actions";

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded-xl p-4 mb-4 bg-white/80 dark:bg-neutral-900">
      <div className="font-semibold text-neutral-700 dark:text-neutral-200 mb-1 text-base">{title}</div>
      <div className="text-sm text-neutral-800 dark:text-neutral-100">{children}</div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <div className="p-8 text-center">Not authenticated</div>;

  // Fetch user info, upcoming session, and next match in 2 queries
  const [{ data: userData }, { data: sessionData }] = await Promise.all([
    supabase
      .from("users")
      .select("name, school, position")
      .eq("id", user.id)
      .single(),
    supabase.rpc("dashboard_overview", { uid: user.id }), // Custom RPC for lean join (see note)
  ]);

  // Fallback if no RPC: fetch sessions and matches separately
  let upcomingSession = null;
  let nextMatch = null;
  if (sessionData) {
    upcomingSession = sessionData.upcoming_session;
    nextMatch = sessionData.next_match;
  } else {
    // Fallback: fetch upcoming session
    const { data: session } = await supabase
      .from("session_members")
      .select("session:sessions(title, date, address)")
      .eq("user_id", user.id)
      .order("session.date", { ascending: true })
      .limit(1)
      .maybeSingle();
    upcomingSession = session?.session;
    // Fallback: fetch next match
    const { data: match } = await supabase
      .from("team_members")
      .select("team:teams(team_matches!inner(date, address, home_team, away_team))")
      .eq("user_id", user.id)
      .order("team.team_matches.date", { ascending: true })
      .limit(1)
      .maybeSingle();
    nextMatch = match?.team?.[0]?.team_matches?.[0];
  }

  return (
    <main className="w-full max-w-3xl mx-auto px-4 py-8 font-sans">
      <div className="w-full flex justify-end mb-4">
        <form action={signOutAction} method="POST">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 font-medium hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
      {/* Greeting */}
      <h1 className="text-3xl font-bold mb-1">Welcome back, {userData?.name || "Athlete"}</h1>
      <div className="text-lg text-neutral-600 mb-6">{userData?.position && `${userData.position} at `}{userData?.school}</div>

      {/* Upcoming Session */}
      <InfoCard title="Upcoming Session">
        {upcomingSession ? (
          <div>
            <div className="font-semibold">{upcomingSession.title}</div>
            <div className="text-xs text-neutral-500">{upcomingSession.address}</div>
            <div className="text-xs text-neutral-500">{upcomingSession.date && new Date(upcomingSession.date).toLocaleString()}</div>
          </div>
        ) : (
          <div className="text-neutral-400">No upcoming sessions</div>
        )}
      </InfoCard>

      {/* Next Match */}
      <InfoCard title="Next Match">
        {nextMatch ? (
          <div>
            <div className="font-semibold">{nextMatch.home_team} vs. {nextMatch.away_team}</div>
            <div className="text-xs text-neutral-500">{nextMatch.address}</div>
            <div className="text-xs text-neutral-500">{nextMatch.date && new Date(nextMatch.date).toLocaleString()}</div>
          </div>
        ) : (
          <div className="text-neutral-400">No upcoming matches</div>
        )}
      </InfoCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mt-8">
        <Link href="/sessions/create"><Button className="w-full bg-neutral-800 text-white rounded-xl px-4 py-2 hover:bg-neutral-700 flex gap-2"><Plus size={18}/>Create Session</Button></Link>
        <Link href="/sessions"><Button className="w-full bg-neutral-800 text-white rounded-xl px-4 py-2 hover:bg-neutral-700 flex gap-2"><Users size={18}/>My Sessions</Button></Link>
        <Link href="/sessions/find"><Button className="w-full bg-neutral-800 text-white rounded-xl px-4 py-2 hover:bg-neutral-700 flex gap-2"><Search size={18}/>Find Sessions</Button></Link>
        <Link href="/players"><Button className="w-full bg-neutral-800 text-white rounded-xl px-4 py-2 hover:bg-neutral-700 flex gap-2"><FileText size={18}/>Find Players</Button></Link>
      </div>
    </main>
  );
}

// Note: For best performance, create a Postgres function (RPC) called 'dashboard_overview' that returns upcoming session and next match for the user in one call.