import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <form
        className="max-w-md w-full mx-auto flex flex-col justify-center min-h-screen px-4"
        style={{ fontFamily: 'Inter, sans-serif' }}
        action={forgotPasswordAction}
      >
        <Input
          label="school email"
          id="email"
          name="email"
          type="email"
          placeholder="you@school.edu"
          required
        />
        <Button type="submit">reset password</Button>
        <div className="mt-4">
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
