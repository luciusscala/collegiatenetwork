import { createClient } from "@/utils/supabase/server";
import Button from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="p-8 text-center">Not authenticated</div>;

  const { data: userData } = await supabase
    .from("users")
    .select("name, school, position")
    .eq("id", user.id)
    .single();

  return (
    <>
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#02503B] px-4 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
        <h1 className="text-3xl font-black mb-8 text-[#B04F17]">profile</h1>
        <div className="w-full max-w-md bg-[#02503B] rounded-lg flex flex-col gap-6 items-center">
          <div className="w-full flex flex-col gap-2">
            <div className="text-lg font-black text-[#B04F17]">name</div>
            <div className="text-base text-[#B04F17] bg-[#02503B] rounded px-3 py-2 border-4 border-[#B04F17] font-black">{userData?.name || "—"}</div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="text-lg font-black text-[#B04F17]">school</div>
            <div className="text-base text-[#B04F17] bg-[#02503B] rounded px-3 py-2 border-4 border-[#B04F17] font-black">{userData?.school || "—"}</div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="text-lg font-black text-[#B04F17]">position</div>
            <div className="text-base text-[#B04F17] bg-[#02503B] rounded px-3 py-2 border-4 border-[#B04F17] font-black">{userData?.position || "—"}</div>
          </div>
          <Link href="/profile/edit" className="w-full mt-4">
            <Button className="w-full bg-[#B04F17] text-[#02503B] rounded-lg font-black text-lg hover:bg-[#963f0f]">edit profile</Button>
          </Link>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6">
        <Navbar navItems={[{ href: "/dashboard", label: "home" }]} />
      </div>
    </>
  );
} 