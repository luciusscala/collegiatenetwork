interface User {
  id: string;
  username?: string;
  name?: string;
  bio?: string;
  avatar_url?: string;
}

interface SuggestedAthletesProps {
  users: User[];
}

export default function SuggestedAthletes({ users }: SuggestedAthletesProps) {
  if (!users.length) {
    return (
      <div>
        <h2 className="font-bold text-lg mb-2">Suggested Athletes</h2>
        <div className="text-gray-500">No suggestions right now.</div>
      </div>
    );
  }
  return (
    <div>
      <h2 className="font-bold text-lg mb-2">Suggested Athletes</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="min-w-[160px] bg-card p-4 rounded-lg border shadow-sm flex flex-col items-center"
          >
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username || "User"}
                className="w-12 h-12 rounded-full mb-2 object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mb-2 text-lg font-bold text-gray-600">
                {user.username ? user.username[0] : "A"}
              </div>
            )}
            <div className="font-medium">
              {user.username || user.name || "Athlete"}
            </div>
            {user.bio && (
              <div className="text-xs text-gray-500 mt-1 text-center">{user.bio}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}