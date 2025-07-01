import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <>
      <form
        className="max-w-md w-full mx-auto flex flex-col justify-center min-h-screen px-4"
        style={{ fontFamily: 'Inter, sans-serif' }}
        action={signInAction}
      >
        <Input
          label="school email"
          id="email"
          name="email"
          type="email"
          placeholder="you@school.edu"
          required
        />
        <Input
          label="password"
          id="password"
          name="password"
          type="password"
          placeholder="your password"
          required
        />
        <Button type="submit">sign in</Button>
        <div className="mt-4">
          <FormMessage message={searchParams} />
        </div>
        <div className="flex justify-between items-center mb-8">
          <Link
            className="text-[#B04F17] underline text-small font-black lowercase"
            href="/forgot-password"
          >
            forgot password?
          </Link>
        </div>
      </form>
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6">
        <Navbar navItems={[
          { href: "/", label: "home" },
          { href: "/sign-up", label: "sign up" },
        ]} />
      </div>
    </>
  );
}
