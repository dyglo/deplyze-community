import Link from "next/link";
import { adminSignup } from "@/app/actions/auth";
import { ArrowLeft } from "lucide-react";

export default function AdminSignupPage() {
  return (
    <>
      <Link href="/" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest mb-6 hover:opacity-70 transition-opacity">
        <ArrowLeft className="w-3 h-3 mr-2" /> Back
      </Link>
      
      <h1 className="text-3xl font-bold tracking-tighter mb-2 uppercase text-slate-900">Admin Registration</h1>
      <p className="text-neutral-500 text-xs mb-8 font-medium">Create a new administrative account.</p>

      <form className="space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Username</label>
          <input 
            name="username"
            type="text" 
            required
            placeholder="admin_username"
            className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors placeholder:text-neutral-300"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Email Address</label>
          <input 
            name="email"
            type="email" 
            required
            placeholder="admin@deplyze.com"
            className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors placeholder:text-neutral-300"
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Password</label>
          <input 
            name="password"
            type="password" 
            required
            placeholder="••••••••"
            className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors placeholder:text-neutral-300"
          />
        </div>

        <button 
          formAction={adminSignup}
          className="w-full bg-slate-900 text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors mt-6"
        >
          Create Admin Account
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-neutral-500">
        Already an admin? <Link href="/admin/login" className="font-bold text-black border-b border-black">Admin Login</Link>
      </p>
    </>
  );
}
