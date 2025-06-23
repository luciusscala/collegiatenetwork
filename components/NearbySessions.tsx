interface Session {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  start_time?: string;
}

interface NearbySessionsProps {
  sessions: Session[];
}

export default function NearbySessions({ sessions }: NearbySessionsProps) {
  if (!sessions.length) {
    return (
      <div>
        <h2 className="font-bold text-lg mb-2">Nearby Sessions</h2>
        <div className="text-gray-500">No public sessions found.</div>
      </div>
    );
  }
  return (
    <div>
      <h2 className="font-bold text-lg mb-2">Nearby Sessions</h2>
      <div className="flex flex-col gap-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-4 rounded-lg border bg-card shadow-sm hover:shadow"
          >
            <div className="font-semibold">
              {session.name || session.title || "Untitled Session"}
            </div>
            {session.description && (
              <div className="text-sm text-gray-600">{session.description}</div>
            )}
            {session.start_time && (
              <span className="block text-xs text-gray-400 mt-1">
                {new Date(session.start_time).toLocaleString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}