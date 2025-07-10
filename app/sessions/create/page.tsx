import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateSessionForm from "@/components/CreateSessionForm";
import Navbar from "@/components/Navbar";

export default async function CreateSessionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  async function createSession(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/sign-in');

    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const address = formData.get('address') as string;

    if (!title || !date || !address) {
      return { error: 'Please fill in all required fields' };
    }

    let lat: number | null = null;
    let lng: number | null = null;
    try {
      // Geocode address using OpenCage
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${process.env.OPENCAGE_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        lat = data.results[0].geometry.lat;
        lng = data.results[0].geometry.lng;
      } else {
        return { error: "Could not geocode the address. Please check your input." };
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return { error: "Failed to geocode address. Please try again." };
    }

    try {
      // Insert session
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          title,
          date,
          address,
          lat,
          lng,
          host_id: user.id
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Auto-insert creator as session member with role = host
      const { error: memberError } = await supabase
        .from('session_members')
        .insert({
          session_id: session.id,
          user_id: user.id,
          role: 'host'
        });

      if (memberError) throw memberError;

      redirect('/sessions');
    } catch (error) {
      // Ignore Next.js redirect errors
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        return;
      }
      console.error('Error creating session:', error);
      return { error: 'Failed to create session. Please try again.' };
    }
  }

  return (
    <>
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#02503B] px-4 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
        <h1 className="text-3xl font-black mb-8 text-[#B04F17]">create session</h1>
        <div className="w-full max-w-lg">
          <CreateSessionForm createSession={createSession} />
        </div>
      </main>
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6">
        <Navbar navItems={[{ href: "/dashboard", label: "home" }]} />
      </div>
    </>
  );
} 