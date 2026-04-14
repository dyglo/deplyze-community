import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, username")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <div className="min-h-screen bg-neutral-50/30 flex flex-col font-sans selection:bg-black selection:text-white">
      <Header profile={profile} />
      <main className="flex-grow">
         {children}
      </main>
    </div>
  );
}
