import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";

// Lucide 1.x removed brand icons, so we define them manually
const Twitter = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


export function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white pt-16 pb-8 px-6 md:px-12 w-full mt-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-24">
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-medium tracking-tight inline-block">
              deplyze<sup className="text-xs">&reg;</sup>
            </Link>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-6 text-neutral-300">Community</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><Link href="/home" className="hover:text-white transition-colors">For You Feed</Link></li>
              <li><Link href="/wall-of-prayer" className="hover:text-white transition-colors border-b border-white pb-0.5 inline-block">Wall of Prayer</Link></li>
              <li><Link href="/prayer-events" className="hover:text-white transition-colors">Global Events</Link></li>
              <li><Link href="/local-community" className="hover:text-white transition-colors">Local Hub</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-6 text-neutral-300">About</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><Link href="#" className="hover:text-white transition-colors border-b border-white pb-0.5 inline-block">Our Story</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Guidelines</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-6 text-neutral-300">Support</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors border-b border-white pb-0.5 inline-block">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors border-b border-white pb-0.5 inline-block">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-medium text-sm mb-4 text-neutral-300">Stay Connected</h4>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              Subscribe for community updates, encouraging testimonies, and news.
            </p>
            <form className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="bg-transparent border-b border-neutral-700 py-2 text-sm focus:outline-none focus:border-white transition-colors w-full placeholder:text-neutral-600"
              />
              <button 
                type="button" 
                className="bg-white text-black text-sm py-2 px-4 flex items-center justify-center gap-2 self-start hover:bg-neutral-200 transition-colors"
              >
                Subscribe <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="relative overflow-hidden w-full h-[6rem] sm:h-[10rem] md:h-[14rem] lg:h-[18rem] bg-gradient-to-t from-transparent to-transparent flex items-end">
             {/* Huge text effect */}
             <h1 className="text-[12vw] leading-[0.8] tracking-tighter font-bold uppercase text-transparent bg-clip-text bg-gradient-to-b from-white/30 to-black w-full select-none">
                EVERY PRAYER MATTERS
             </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} deplyze&reg;. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
             <Link href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></Link>
             <Link href="#" className="hover:text-white transition-colors"><Instagram className="w-4 h-4" /></Link>
             <Link href="#" className="hover:text-white transition-colors"><Mail className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
