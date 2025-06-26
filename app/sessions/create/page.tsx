import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateSessionForm from "@/components/CreateSessionForm";

export default async function CreateSessionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/sign-in');

  let errorMessage = "";

  async function createSession(formData: FormData) {
    'use server';
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) redirect('/sign-in');

    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const location = formData.get('location') as string;

    if (!title || !date || !location) {
      errorMessage = 'Please fill in all required fields';
      return { error: errorMessage };
    }

    try {
      // Insert session
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          title,
          date,
          location,
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
      console.error('Error creating session:', error);
      errorMessage = 'Failed to create session. Please try again.';
      return { error: errorMessage };
    }
  }

  // Use the client component for the form to display error messages
  return <CreateSessionForm createSession={createSession} />;
} 