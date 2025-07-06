export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      {"success" in message && (
        <div className="text-green-600 text-sm font-normal mt-1">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="text-red-500 text-sm font-normal mt-1">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="text-blue-600 text-sm font-normal mt-1">
          {message.message}
        </div>
      )}
    </div>
  );
}
