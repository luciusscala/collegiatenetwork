import { requireAuth, getUserData, createAuthClient } from "@/utils/auth/server";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { redirect } from "next/navigation";

async function updateProfileAction(formData: FormData) {
  'use server';
  const user = await requireAuth();
  const supabase = await createAuthClient();

  const name = formData.get("name")?.toString() || "";
  const school = formData.get("school")?.toString() || "";
  const position = formData.get("position")?.toString() || "";

  await supabase
    .from("users")
    .update({ name, school, position })
    .eq("id", user.id);

  redirect("/profile");
}

export default async function EditProfilePage() {
  const user = await requireAuth();
  const userData = await getUserData(user.id);

  return (
    <>
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#02503B] px-4 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
        <h1 className="text-3xl font-black mb-8 text-[#B04F17]">edit profile</h1>
        <form action={updateProfileAction} className="w-full max-w-md mx-auto flex flex-col justify-center bg-[#02503B] p-0">
          <Input
            label="name"
            id="name"
            name="name"
            defaultValue={userData?.name || ""}
            required
          />
          <Input
            label="school"
            id="school"
            name="school"
            defaultValue={userData?.school || ""}
            required
          />
          <Input
            label="position"
            id="position"
            name="position"
            defaultValue={userData?.position || ""}
            required
          />
          <div className="flex gap-4 mt-6">
            <Button type="submit">save changes</Button>
            <Link
              href="/profile"
              className="px-6 py-2 rounded-lg bg-[#B04F17] text-[#02503B] font-black text-lg hover:bg-[#963f0f] transition-colors flex items-center justify-center"
            >
              cancel
            </Link>
          </div>
        </form>
      </main>
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6">
        <Navbar navItems={[{ href: "/dashboard", label: "home" }]} />
      </div>
    </>
  );
} 