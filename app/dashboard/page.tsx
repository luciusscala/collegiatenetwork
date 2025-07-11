import { createClient } from "@/utils/supabase/server";
import Button from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <div className="p-8 text-center text-[#B04F17]">not authenticated</div>;

  // Fetch user info
  const { data: userData } = await supabase
    .from("users")
    .select("name, school, position")
    .eq("id", user.id)
    .single();

  return (
    <>
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#02503B] px-4 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
        <h1 className="text-3xl font-black mb-2 text-[#B04F17]">welcome back, {userData?.name || "athlete"}</h1>
        <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          <Link href="/sessions/create"><Button className="w-full bg-[#B04F17] text-[#02503B] rounded-lg font-black text-lg hover:bg-[#963f0f]">create session</Button></Link>
          <Link href="/sessions"><Button className="w-full bg-[#B04F17] text-[#02503B] rounded-lg font-black text-lg hover:bg-[#963f0f]">my sessions</Button></Link>
          <Link href="/sessions/find"><Button className="w-full bg-[#B04F17] text-[#02503B] rounded-lg font-black text-lg hover:bg-[#963f0f]">find sessions</Button></Link>
          <Link href="/players"><Button className="w-full bg-[#B04F17] text-[#02503B] rounded-lg font-black text-lg hover:bg-[#963f0f]">find players</Button></Link>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6">
        <Navbar navItems={[
          { href: "/sign-out", label: "sign out" },
          { href: "/profile", label: "profile" },
        ]} />
      </div>
    </>
  );
}