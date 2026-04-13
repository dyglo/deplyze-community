import Link from "next/link";
import { login } from "@/app/actions/auth";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <>
      <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Link>
      
      <h1 className="text-3xl font-bold tracking-tighter mb-3 uppercase">Welcome Back</h1>
      <p className="text-neutral-500 text-xs mb-8 font-medium">Continue your spiritual journey.</p>

        <form className="space-y-8">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Email Address</label>
            <input 
              name="email"
              type="email" 
              required
              placeholder="name@example.com"
              className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-neutral-300"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Password</label>
            <input 
              name="password"
              type="password" 
              required
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-neutral-300"
            />
          </div>

          <button 
            formAction={login as any}
            className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors mt-4"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-neutral-500">
          Don't have an account yet? <Link href="/signup" className="font-bold text-black border-b border-black">Sign Up</Link>
        </p>
    </>
  );
}
