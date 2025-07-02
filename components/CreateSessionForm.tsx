'use client';
import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto flex flex-col justify-center bg-[#02503B] p-0"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <Input
        label="title"
        id="title"
        name="title"
        placeholder="e.g. conditioning & touch work"
        required
      />
      <Input
        label="date & time"
        id="date"
        name="date"
        type="datetime-local"
        required
      />
      <Input
        label="location / address"
        id="address"
        name="address"
        placeholder="123 main st, springfield"
        required
      />
      {error && <div className="mb-4 text-red-600 font-black text-center">{error}</div>}
      <Button type="submit">create session</Button>
    </form>
  );
} 