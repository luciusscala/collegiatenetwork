import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateSessionAction } from "@/app/actions/updateSession";
import Link from "next/link";

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
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Session not found</h1>
        <p className="text-neutral-500 mb-8">This session does not exist or you do not have access.</p>
        <Link href="/sessions" className="text-green-700 hover:underline">Back to Sessions</Link>
      </main>
    );
  }

  if (session.host_id !== user.id) {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Not authorized</h1>
        <p className="text-neutral-500 mb-8">You are not the host of this session.</p>
        <Link href={`/sessions/${session.id}`} className="text-green-700 hover:underline">Back to Session</Link>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Edit Session</h1>
      <form action={updateSessionAction.bind(null, session.id)} className="space-y-6 bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={session.title}
            required
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Date & Time</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            defaultValue={session.date ? new Date(session.date).toISOString().slice(0, 16) : ""}
            required
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Location / Address</label>
          <input
            type="text"
            id="address"
            name="address"
            defaultValue={session.address}
            required
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="px-6 py-2 rounded bg-green-700 text-white font-medium hover:bg-green-800 transition-colors"
          >
            Save Changes
          </button>
          <Link
            href={`/sessions/${session.id}`}
            className="px-6 py-2 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 font-medium hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
} 