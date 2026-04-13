import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
import { LogOut, ArrowLeft } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Not authenticated</h1>
        <Link href="/login" className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1">Sign In</Link>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 md:py-24">
      {/* Standalone Profile Header */}
      <div className="flex justify-between items-center mb-24">
         <Link 
            href="/home" 
            className="flex items-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors group"
         >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> Back to Home
         </Link>
         
         <form action={logout}>
            <button type="submit" className="flex items-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
               <LogOut className="w-4 h-4 mr-2" /> Log out
            </button>
         </form>
      </div>

      <div className="mb-20">
         <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 uppercase">Your Profile</h1>
         <p className="text-neutral-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Manage your community presence, update your story, and adjust your personal settings.
         </p>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}
