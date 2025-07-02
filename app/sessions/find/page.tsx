import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
    <>
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#02503B] px-4 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
        <h1 className="text-3xl font-black mb-8 text-[#B04F17]">find sessions</h1>
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