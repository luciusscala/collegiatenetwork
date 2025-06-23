interface Session {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  start_time?: string;
}

interface MySessionsProps {
  sessions: Session[];
}

export default function MySessions({ sessions }: MySessionsProps) {
  if (!sessions.length) {
    return (
      <div>
        <h2 className="font-bold text-lg mb-2">My Sessions</h2>
        <div className="text-gray-500">You're not in any sessions yet.</div>
      </div>
    );
  }
  return (
    <div>
      <h2 className="font-bold text-lg mb-2">My Sessions</h2>
      <div className="flex flex-col gap-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-4 rounded-lg border bg-card shadow-sm hover:shadow md:flex items-center gap-4"
          >
            <div className="flex-1">
              <div className="font-semibold">
                {session.name || session.title || "Untitled Session"}
              </div>
              {session.description && (
                <div className="text-sm text-gray-600">{session.description}</div>
              )}
            </div>
            {session.start_time && (
              <span className="text-xs text-gray-400">
                {new Date(session.start_time).toLocaleString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}