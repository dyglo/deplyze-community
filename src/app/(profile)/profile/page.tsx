import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
import { LogOut, ArrowLeft, Settings } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Not authenticated</h1>
        <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">Sign In</Link>
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
    <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 text-black">
      
      {/* Left Sidebar / Meta Nav */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-8">
         <Link 
            href="/home" 
            className="flex items-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors group mb-4"
         >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> Back to App
         </Link>

         <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 px-3">Settings</h3>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-neutral-200 shadow-sm text-sm font-bold w-full text-left">
               <Settings className="w-4 h-4" /> Account
            </button>
         </div>

         <div className="mt-auto pt-8 border-t border-neutral-200/50">
            <form action={logout}>
               <button type="submit" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                  <LogOut className="w-4 h-4" /> Sign out
               </button>
            </form>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-3xl">
         <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tighter mb-2 uppercase">Account Settings</h1>
            <p className="text-neutral-500 text-sm font-medium">Manage your personal information and preferences.</p>
         </div>

         <ProfileForm profile={profile} />
      </div>

    </div>
  );
}
