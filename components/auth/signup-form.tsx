"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/app/actions";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;

    // If not eligible yet, verify eligibility
    if (!isEligible) {
      try {
        const response = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, email }),
        });

        if (!response.ok) {
          throw new Error("Verification failed");
        }

        const data = await response.json();
        setIsEligible(data.valid);
        
        if (!data.valid) {
          setError("You are not eligible to sign up");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to verify eligibility. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // If eligible, proceed with signup
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await signUpAction(formData);
      // If we get here, the signup was successful and we've been redirected
    } catch (error) {
      console.error("Error signing up:", error);
      setError(error instanceof Error ? error.message : "Failed to sign up");
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSignup}
      className="max-w-md w-full mx-auto flex flex-col justify-center min-h-screen px-4 text-[#B04F17]"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <Input
        label="full name"
        id="fullName"
        name="fullName"
        placeholder="Enter your full name"
        required
        disabled={isEligible}
      />
      <Input
        label="school email"
        id="email"
        name="email"
        type="email"
        placeholder="Enter your school email"
        required
        disabled={isEligible}
      />
      {isEligible && (
        <>
          <Input
            label="password"
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />
          <Input
            label="confirm password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
          />
        </>
      )}
      {error && (
        <div className="text-red-500 text-lg font-black mb-6 text-center">
          {error}
        </div>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Verifying..." : isEligible ? "sign up" : "verify eligibility"}
      </Button>
    </form>
  );
} 