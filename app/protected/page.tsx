import { requireAuth } from '@/utils/auth/server';

export default async function ProtectedPage() {
  const user = await requireAuth();
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-2xl font-bold text-[#B04F17]">
        Welcome, {user.email}!
      </div>
    </main>
  );
}
