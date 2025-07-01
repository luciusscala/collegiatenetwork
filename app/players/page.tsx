import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-neutral-100">Players</h1>
      
      {players.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 text-lg">No players found</p>
          <p className="text-neutral-400 text-sm mt-2">Players will appear here once they register</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Position
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {player.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      {player.school || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {player.position ? (
                      <span className="inline-flex text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full px-2.5 py-0.5 font-medium">
                        {player.position}
                      </span>
                    ) : (
                      <span className="text-sm text-neutral-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
} 