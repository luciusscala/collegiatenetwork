import Link from "next/link";

export default function AuthCodeError() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#02503B] px-4 py-10">
      <h1 className="text-3xl font-black mb-4 text-[#B04F17]">Authentication Error</h1>
      <p className="text-[#B04F17] mb-8 text-center max-w-md">
        There was an error confirming your email. Please try signing up again or contact support.
      </p>
      <div className="flex gap-4">
        <Link
          href="/sign-up"
          className="px-6 py-2 rounded-lg bg-[#B04F17] text-[#02503B] font-black text-lg hover:bg-[#963f0f] transition-colors"
        >
          Try Again
        </Link>
        <Link
          href="/"
          className="px-6 py-2 rounded-lg border-2 border-[#B04F17] text-[#B04F17] font-black text-lg hover:bg-[#B04F17] hover:text-[#02503B] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}