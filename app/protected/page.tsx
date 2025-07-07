import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function ProtectedPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-2xl font-bold text-[#B04F17]">
        Welcome, {user.email}!
      </div>
    </main>
  );
}
