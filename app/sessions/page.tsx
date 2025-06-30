import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface Session {
  id: string;
  title: string;
  date: string;
  address: string;
}

async function fetchUserSessions(userId: string, supabase: any): Promise<Session[]> {
  // Sessions where user is host
  const { data: hostedSessions, error: hostError } = await supabase
    .from("sessions")
    .select("id, title, date, address")
    .eq("host_id", userId);

  // Sessions where user is a member (excluding those where user is host)
  const { data: memberSessions, error: memberError } = await supabase
    .from("session_members")
    .select("session:sessions(id, title, date, address)")
    .eq("user_id", userId);

  if (hostError || memberError) {
    // If either query fails, return empty array
    return [];
  }

  // Flatten memberSessions to get the session objects
  const memberSessionList = (memberSessions || [])
    .map((m: any) => m.session)
    .filter((s: Session | null) => s !== null);

  // Combine and deduplicate sessions by id
  const allSessionsMap = new Map<string, Session>();
  (hostedSessions || []).forEach((s: Session) => allSessionsMap.set(s.id, s));
  memberSessionList.forEach((s: Session) => allSessionsMap.set(s.id, s));

  // Sort by date ascending
  return Array.from(allSessionsMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export default async function SessionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const sessions = await fetchUserSessions(user.id, supabase);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">My Sessions</h1>
      {sessions.length === 0 ? (
        <div className="text-neutral-500 text-center py-12">No sessions found</div>
      ) : (
        <ul className="flex flex-col gap-4">
          {sessions.map((session) => (
            <li key={session.id}>
              <Link
                href={`/sessions/${session.id}`}
                className="block rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="font-semibold text-lg text-neutral-800 dark:text-neutral-100 mb-1">
                  {session.title}
                </div>
                <div className="text-sm text-neutral-500 mb-1">
                  {session.address}
                </div>
                <div className="text-xs text-neutral-400">
                  {new Date(session.date).toLocaleString()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
} 