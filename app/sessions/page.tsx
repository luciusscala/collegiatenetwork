import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
    <>
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#02503B] px-4 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
        <h1 className="text-3xl font-black mb-8 text-[#B04F17]">my sessions</h1>
        {sessions.length === 0 ? (
          <div className="text-[#B04F17] text-center text-xl font-black py-12">no sessions found</div>
        ) : (
          <ul className="w-full max-w-lg flex flex-col gap-4">
            {sessions.map((session) => (
              <li key={session.id}>
                <Link
                  href={`/sessions/${session.id}`}
                  className="block rounded-lg border-4 border-[#B04F17] bg-[#02503B] p-4 hover:bg-[#01412f] transition-colors"
                  style={{ color: '#B04F17', fontFamily: 'Inter, sans-serif' }}
                >
                  <div className="font-black text-lg mb-1 text-[#B04F17]">
                    {session.title}
                  </div>
                  <div className="text-base mb-1 text-[#B04F17]">
                    {session.address}
                  </div>
                  <div className="text-sm text-[#B04F17] opacity-80">
                    {new Date(session.date).toLocaleString()}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6">
        <Navbar navItems={[{ href: "/dashboard", label: "home" }]} />
      </div>
    </>
  );
} 