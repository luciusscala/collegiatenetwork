import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <>
      <main className="min-h-screen w-full bg-[#02503B] px-4 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 text-[#B04F17] text-center">
          frequently asked questions
        </h1>
        <div className="max-w-xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="eligibility" className="border-[#B04F17]">
              <AccordionTrigger className="text-[#B04F17] font-black text-lg hover:text-[#963f0f]">
                who is eligible to join?
              </AccordionTrigger>
              <AccordionContent className="text-[#B04F17]">
                anyone on an NCAA Division I, II, or III mens or womens soccer team is eligible to join.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="verification" className="border-[#B04F17]">
              <AccordionTrigger className="text-[#B04F17] font-black text-lg hover:text-[#963f0f]">
                how am i verified?
              </AccordionTrigger>
              <AccordionContent className="text-[#B04F17]">
                we verify your eligibility by checking your profile against your school's most recent roster.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sports" className="border-[#B04F17]">
              <AccordionTrigger className="text-[#B04F17] font-black text-lg hover:text-[#963f0f]">
                will other sports be added?
              </AccordionTrigger>
              <AccordionContent className="text-[#B04F17]">
                we are currently focused on soccer, but we will be adding other sports in the future.
              </AccordionContent>
             </AccordionItem>
             <AccordionItem value="features" className="border-[#B04F17]">
              <AccordionTrigger className="text-[#B04F17] font-black text-lg hover:text-[#963f0f]">
                what can i do on the platform?
              </AccordionTrigger>
              <AccordionContent className="text-[#B04F17]">
                create training sessions or organize scrimmages with other collegiate athletes in the area.
              </AccordionContent>
             </AccordionItem>
          </Accordion>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6">
        <Navbar navItems={[
          { href: "/", label: "home" },
          { href: "/sign-in", label: "sign in" },
        ]} />
      </div>
    </>
  );
} 