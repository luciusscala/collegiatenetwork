import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
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
      <form className="flex flex-col min-w-64 max-w-64 mx-auto pb-5">
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Input label="full name" id="name" name="name" placeholder="name as shown on roster" />
          <Input label="school email" id="email" name="email" placeholder="you@school.edu" required />
          <Input label="password" id="password" name="password" type="password" placeholder="your password" minLength={6} required />
          <div className="flex flex-col mb-8 w-full max-w-lg mx-auto">
            <label
              htmlFor="sport"
              className="text-[#B04F17] font-black text-lg mb-2 lowercase font-sans"
              style={{ fontFamily: 'Inter, sans-serif', textTransform: 'lowercase' }}
            >
              sport
            </label>
            <Select name="sport" required>
              <SelectTrigger className="w-full py-2 px-4 rounded-lg border-4 border-[#B04F17] bg-[#02503B] text-[#B04F17] font-black text-base font-sans focus:outline-none focus:ring-2 focus:ring-[#B04F17] placeholder-[#B04F17] placeholder:font-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
                <SelectValue placeholder="select your sport" className="placeholder-[#B04F17] text-[#B04F17] font-normal" />
              </SelectTrigger>
              <SelectContent className="border-4 border-[#B04F17] bg-[#02503B]">
                <SelectItem value="mens soccer" className="text-[#B04F17] font-black text-base font-sans">mens soccer</SelectItem>
                <SelectItem value="womens soccer" className="text-[#B04F17] font-black text-base font-sans">womens soccer</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          { href: "/faq", label: "faq" }
        ]} />
      </div>
    </>
  );
}
