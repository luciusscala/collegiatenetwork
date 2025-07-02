import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Player {
  id: string;
  name: string;
  school: string | null;
  position: string | null;
}

async function fetchAllPlayers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, school, position")
    .order("name", { ascending: true });
  
  if (error) {
    console.error("Error fetching players:", error);
    return [];
  }
  
  return data as Player[];
}

export default async function PlayersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const players = await fetchAllPlayers();

  return (
    <>
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#02503B] px-4 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
        <h1 className="text-3xl font-black mb-8 text-[#B04F17]">players</h1>
        {players.length === 0 ? (
          <div className="text-[#B04F17] text-center text-xl font-black py-12">no players found</div>
        ) : (
          <div className="w-full max-w-2xl rounded-lg overflow-hidden">
            <table className="w-full bg-[#02503B]">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-black text-[#B04F17] uppercase tracking-wider">name</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-[#B04F17] uppercase tracking-wider">school</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-[#B04F17] uppercase tracking-wider">position</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-[#01412f] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base font-black text-[#B04F17]">{player.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base text-[#B04F17]">{player.school || "—"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {player.position ? (
                        <span className="inline-flex text-xs bg-[#B04F17] text-[#02503B] rounded-full px-2.5 py-0.5 font-black">
                          {player.position}
                        </span>
                      ) : (
                        <span className="text-base text-[#B04F17] opacity-60">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6">
        <Navbar navItems={[{ href: "/dashboard", label: "home" }]} />
      </div>
    </>
  );
} 