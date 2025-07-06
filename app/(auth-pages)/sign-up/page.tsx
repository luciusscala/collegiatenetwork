import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Input label="full name" id="name" name="name" placeholder="name as shown on roster" />
          <Input label="school email" id="email" name="email" placeholder="you@school.edu" required />
          <Input label="password" id="password" name="password" type="password" placeholder="your password" minLength={6} required />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            check eligibility
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6">
        <Navbar navItems={[
          { href: "/", label: "home" },
          { href: "/sign-in", label: "sign-in" },
        ]} />
      </div>
    </>
  );
}
