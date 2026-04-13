import { createClient } from "@/lib/supabase/server";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      {children}
    </div>
  );
}
