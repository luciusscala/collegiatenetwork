import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { joinSession, leaveSession } from "@/app/actions/sessionActions";

interface Session {
  id: string;
  title: string;
  date: string;
  location: string;
  host_id: string;
}

interface Member {
  id: string;
  name: string | null;
}

async function fetchSessionDetails(sessionId: string, userId: string, supabase: any) {
  // Fetch session details
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, title, date, location, host_id")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return { session: null, members: [], isHost: false, isMember: false };
  }

  // Fetch session members with user names
  const { data: membersData, error: membersError } = await supabase
    .from("session_members")
    .select("user_id, user:users(name)")
    .eq("session_id", sessionId);

  const members: Member[] = (membersData || []).map((m: any) => ({
    id: m.user_id,
    name: m.user?.name || null,
  }));

  // Determine if the user is host or member
  const isHost = session.host_id === userId;
  const isMember = members.some((m) => m.id === userId);

  return { session, members, isHost, isMember };
}

export default async function SessionDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { session, members, isHost, isMember } = await fetchSessionDetails(id, user.id, supabase);

  if (!session) {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Session not found</h1>
        <p className="text-neutral-500 mb-8">This session does not exist or you do not have access.</p>
        <Link href="/sessions" className="text-green-700 hover:underline">Back to Sessions</Link>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">{session.title}</h1>
      <div className="mb-2 text-neutral-600 dark:text-neutral-300">{session.location}</div>
      <div className="mb-6 text-neutral-400 text-sm">{new Date(session.date).toLocaleString()}</div>

      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-2 text-neutral-800 dark:text-neutral-200">Members</h2>
        <ul className="flex flex-col gap-2">
          {members.length === 0 ? (
            <li className="text-neutral-500">No members yet</li>
          ) : (
            members.map((member) => (
              <li key={member.id} className="text-neutral-700 dark:text-neutral-100">
                {member.name || "Unknown"}
                {member.id === session.host_id && (
                  <span className="ml-2 text-xs text-green-700 font-semibold">(Host)</span>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="flex gap-4">
        {isHost ? null : isMember ? (
          <form action={leaveSession} method="POST">
            <input type="hidden" name="session_id" value={session.id} />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 font-medium hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              Leave Session
            </button>
          </form>
        ) : (
          <form action={joinSession} method="POST">
            <input type="hidden" name="session_id" value={session.id} />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-700 text-white font-medium hover:bg-green-800 transition-colors"
            >
              Join Session
            </button>
          </form>
        )}
      </div>
    </main>
  );
} 