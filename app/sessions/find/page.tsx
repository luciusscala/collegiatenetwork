import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

interface Session {
  id: string;
  title: string;
  date: string;
  address: string;
}

async function fetchAllSessions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, title, date, address")
    .order("date", { ascending: true });
  if (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
  return data as Session[];
}

export default async function FindSessionsPage() {
  const sessions = await fetchAllSessions();

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Find Sessions</h1>
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