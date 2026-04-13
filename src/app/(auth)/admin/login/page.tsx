import Link from "next/link";
import { login } from "@/app/actions/auth";
import { ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <>
      <Link href="/" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest mb-6 hover:opacity-70 transition-opacity">
        <ArrowLeft className="w-3 h-3 mr-2" /> Back
      </Link>
      
      <h1 className="text-3xl font-bold tracking-tighter mb-2 uppercase text-slate-900">Admin Login</h1>
      <p className="text-neutral-500 text-xs mb-8 font-medium">Access the control panel.</p>

      <form className="space-y-8">
        <input type="hidden" name="redirectTo" value="/admin/dashboard" />
        
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
          formAction={login as any}
          className="w-full bg-slate-900 text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors mt-6"
        >
          Login to Dashboard
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-neutral-500">
        Not an admin? <Link href="/login" className="font-bold text-black border-b border-black">User Login</Link>
      </p>
    </>
  );
}
