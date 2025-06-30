'use client';
import { useState } from "react";

export default function CreateSessionForm({ createSession }: { createSession: (formData: FormData) => Promise<any> }) {
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const result = await createSession(formData);
    if (result && result.error) {
      setError(result.error);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create Training Session</h1>
      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            placeholder="e.g. Conditioning & Touch Work"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Date & Time *
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Location / Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            placeholder="123 Main St, Springfield"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Create Session
        </button>
      </form>
    </div>
  );
} 