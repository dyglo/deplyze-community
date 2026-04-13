import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
  return (
    <>
      <Link href="/" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest mb-6 hover:opacity-70 transition-opacity">
        <ArrowLeft className="w-3 h-3 mr-2" /> Back
      </Link>
      
      <h1 className="text-3xl font-bold tracking-tighter mb-2 uppercase">Create Account</h1>
      <p className="text-neutral-500 text-xs mb-8 font-medium">Join our global community in prayer.</p>

        <form className="space-y-6">
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

          <div className="flex items-start space-x-3 pt-2">
            <input 
              type="checkbox" 
              name="terms"
              id="terms" 
              required
              className="mt-1 w-4 h-4 rounded-none border-neutral-300 text-black focus:ring-transparent accent-black"
            />
            <label htmlFor="terms" className="text-xs text-neutral-500 leading-relaxed">
              I agree to the <Link href="#" className="underline text-black">Terms of Service</Link> and <Link href="#" className="underline text-black">Privacy Policy</Link>. I understand this is a spiritual community focused on prayer.
            </label>
          </div>

          <button 
            formAction={signup as any}
            className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors mt-8"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Already have an account? <Link href="/login" className="font-bold text-black border-b border-black">Login</Link>
        </p>
    </>
  );
}
