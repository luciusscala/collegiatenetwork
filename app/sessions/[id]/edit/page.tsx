import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateSessionAction } from "@/app/actions/updateSession";
import Link from "next/link";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default async function EditSessionPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  // Fetch session details
  const { data: session, error } = await supabase
    .from("sessions")
    .select("id, title, date, address, host_id")
    .eq("id", id)
    .single();

  if (error || !session) {
    return (
      <>
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#02503B] px-4 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
          <h1 className="text-3xl font-black mb-4 text-[#B04F17]">session not found</h1>
          <p className="text-[#B04F17] mb-8">this session does not exist or you do not have access.</p>
          <Link href="/sessions" className="underline font-black text-[#B04F17]">back to sessions</Link>
        </main>
        <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6">
          <Navbar navItems={[{ href: "/dashboard", label: "home" }]} />
        </div>
      </>
    );
  }

  if (session.host_id !== user.id) {
    return (
      <>
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#02503B] px-4 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
          <h1 className="text-3xl font-black mb-4 text-[#B04F17]">not authorized</h1>
          <p className="text-[#B04F17] mb-8">you are not the host of this session.</p>
          <Link href={`/sessions/${session.id}`} className="underline font-black text-[#B04F17]">back to session</Link>
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
        <h1 className="text-3xl font-black mb-8 text-[#B04F17]">edit session</h1>
        <form action={updateSessionAction.bind(null, session.id)} className="w-full max-w-lg mx-auto flex flex-col justify-center bg-[#02503B] p-0">
          <Input
            label="title"
            id="title"
            name="title"
            defaultValue={session.title}
            required
          />
          <Input
            label="date & time"
            id="date"
            name="date"
            type="datetime-local"
            defaultValue={session.date ? new Date(session.date).toISOString().slice(0, 16) : ""}
            required
          />
          <Input
            label="location / address"
            id="address"
            name="address"
            defaultValue={session.address}
            required
          />
          <div className="flex gap-4 mt-6">
            <Button type="submit">save changes</Button>
            <Link
              href={`/sessions/${session.id}`}
              className="px-6 py-2 rounded-lg bg-[#B04F17] text-[#02503B] font-black text-lg hover:bg-[#963f0f] transition-colors flex items-center justify-center"
            >
              cancel
            </Link>
          </div>
        </form>
      </main>
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6">
        <Navbar navItems={[{ href: "/dashboard", label: "home" }]} />
      </div>
    </>
  );
} 