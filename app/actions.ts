"use server";

import { encodedRedirect } from "@/utils/utils";
import { createAuthClient } from "@/utils/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const sport = formData.get("sport")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createAuthClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  // Call FastAPI endpoint directly, no longer use the API route
  const response = await fetch(`https://web-production-1ede6.up.railway.app/verify?email=${encodeURIComponent(email || "")}&name=${encodeURIComponent(name || "")}&sport=${encodeURIComponent(sport || "")}`, {
    method: "POST",
    headers: {
      "accept": "application/json",
    },
    body: "",
  });

  if (!response.ok) {
    return encodedRedirect("error", "/sign-up", "sorry, something went wrong");
  }

  const verifyStatus = await response.json();
  if (verifyStatus.status !== "valid") {
    return encodedRedirect("error", "/sign-up", "not found on roster");
  }

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        name: name || "Unknown",
        sport: sport || "Unknown",
        school: "Unknown", // You can update this based on your verification API
        position: "Unknown", // You can update this based on your verification API
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  // Note: With email confirmation enabled, the user record in your custom table
  // will be created by either the database trigger or the auth callback handler

  return encodedRedirect(
    "success",
    "/sign-up",
    "you are eligible. please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createAuthClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createAuthClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createAuthClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
