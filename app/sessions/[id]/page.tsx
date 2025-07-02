import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { joinSession, leaveSession } from "@/app/actions/sessionActions";
import Navbar from "@/components/Navbar";

interface Session {
  id: string;
  title: string;
  date: string;
  address: string;
  host_id: string;
}

interface Member {
  id: string;
  name: string | null;
}

async function fetchSessionDetails(sessionId: string, userId: string | null, supabase: any) {
  // Fetch session details
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, title, date, address, host_id")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return { session: null, members: [], isHost: false, isMember: false };
  }

  // Fetch session members with user names
  const { data: membersData } = await supabase
    .from("session_members")
    .select("user_id, user:users(name)")
    .eq("session_id", sessionId);

  const members: Member[] = (membersData || []).map((m: any) => ({
    id: m.user_id,
    name: m.user?.name || null,
  }));

  // Determine if the user is host or member
  const isHost = userId ? session.host_id === userId : false;
  const isMember = userId ? members.some((m) => m.id === userId) : false;

  return { session, members, isHost, isMember };
}

export default async function SessionDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user ? user.id : null;

  const { session, members, isHost, isMember } = await fetchSessionDetails(id, userId, supabase);

  if (!session) {
    return (
      <>
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#02503B] px-4 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
          <h1 className="text-3xl font-black mb-4 text-[#B04F17]">session not found</h1>
          <p className="text-[#B04F17] mb-8">this session does not exist.</p>
          <Link href="/sessions" className="underline font-black text-[#B04F17]">back to sessions</Link>
        </main>
        <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6">
          <Navbar navItems={[{ href: "/dashboard", label: "home" }]} />
        </div>
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#02503B] px-4 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
        <h1 className="text-3xl font-black mb-4 text-[#B04F17]">{session.title}</h1>
        <div className="mb-2 text-lg text-[#B04F17]">{session.address}</div>
        <div className="mb-6 text-base text-[#B04F17] opacity-80">{new Date(session.date).toLocaleString()}</div>

        <div className="mb-8 w-full max-w-lg">
          <h2 className="font-black text-lg mb-2 text-[#B04F17]">members</h2>
          <ul className="flex flex-col gap-2">
            {members.length === 0 ? (
              <li className="text-[#B04F17]">no members yet</li>
            ) : (
              members.map((member) => (
                <li key={member.id} className="text-[#B04F17] font-black">
                  {member.name || "unknown"}
                  {member.id === session.host_id && (
                    <span className="ml-2 text-xs text-[#B04F17] font-black">(host)</span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="flex gap-4">
          {isHost && (
            <Link
              href={`/sessions/${session.id}/edit`}
              className="px-6 py-2 rounded-lg bg-[#B04F17] text-[#02503B] font-black text-lg hover:bg-[#963f0f] transition-colors"
            >
              edit session
            </Link>
          )}
          {userId && !isHost && (
            isMember ? (
              <form action={leaveSession} method="POST">
                <input type="hidden" name="session_id" value={session.id} />
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#B04F17] text-[#02503B] font-black text-lg hover:bg-[#963f0f] transition-colors"
                >
                  leave session
                </button>
              </form>
            ) : (
              <form action={joinSession} method="POST">
                <input type="hidden" name="session_id" value={session.id} />
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#B04F17] text-[#02503B] font-black text-lg hover:bg-[#963f0f] transition-colors"
                >
                  join session
                </button>
              </form>
            )
          )}
        </div>
      </main>
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6">
        <Navbar navItems={[{ href: "/dashboard", label: "home" }]} />
      </div>
    </>
  );
} 