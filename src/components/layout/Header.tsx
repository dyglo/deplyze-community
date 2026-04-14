'use client'

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";


interface Profile {
  full_name?: string;
  avatar_url?: string;
  username?: string;
}

export function Header({ profile }: { profile?: Profile | null }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "For You", href: "/home" },
    { name: "Wall of Prayer", href: "/wall-of-prayer" },
    { name: "Global Events", href: "/prayer-events" },
    { name: "Local Hub", href: "/local-community" },
    { name: "Notifications", href: "/notifications" },
  ];

  const secondaryLinks = [
    { name: "Profile", href: "/profile" },
    { name: "Settings", href: "/profile" },
  ];

  return (
    <>
      <header className="w-full flex items-center justify-between py-6 px-6 md:px-12 bg-background sticky top-0 z-[60]">
        <Link href="/" className="text-xl font-medium tracking-tight">
          deplyze<sup className="text-xs">&reg;</sup>
        </Link>

        <div className="flex items-center gap-6">
          {profile && (
            <Link href="/profile" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
               <div className="w-8 h-8 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200 flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold uppercase text-neutral-400">
                      {profile.full_name?.charAt(0) || profile.username?.charAt(0) || "U"}
                    </span>
                  )}
               </div>
            </Link>
          )}
          <button
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="text-foreground hover:opacity-70 transition-opacity"
          >
            {isOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
          </button>
        </div>
      </header>

      {/* Slide-out Menu */}
      <div className={`fixed inset-0 bg-white/95 backdrop-blur-2xl z-50 transition-transform duration-700 ease-in-out overflow-y-auto overflow-x-hidden ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-8 right-8 md:top-12 md:right-12 p-2 hover:opacity-50 transition-opacity z-[60]"
          aria-label="Close Menu"
        >
          <X className="w-8 h-8 stroke-[1.5]" />
        </button>
        <div className="flex flex-col h-full pt-32 px-6 md:px-12 max-w-5xl mx-auto">
           <nav className="flex flex-col space-y-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-5xl md:text-7xl font-bold tracking-tighter uppercase transition-colors hover:text-neutral-500 text-black`}
                >
                  {link.name}
                </Link>
              ))}
           </nav>

           <div className="mt-24 pt-12 border-t border-neutral-100 flex flex-col md:flex-row justify-between gap-12 pb-12">
              <div className="flex flex-col space-y-4">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Account</h4>
                 <div className="flex flex-col space-y-2">
                    {secondaryLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium hover:underline flex items-center"
                      >
                        {link.name} <ArrowUpRight className="w-3 h-3 ml-1" />
                      </Link>
                    ))}
                 </div>
              </div>

              <div className="flex flex-col space-y-4">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Social</h4>
                 <div className="flex space-x-6">
                    <Link href="#" className="text-sm font-medium hover:underline">Twitter</Link>
                    <Link href="#" className="text-sm font-medium hover:underline">Instagram</Link>
                    <Link href="#" className="text-sm font-medium hover:underline">Support</Link>
                 </div>
              </div>

              <div className="md:max-w-xs">
                 <p className="text-xs text-neutral-400 leading-relaxed font-medium capitalize">
                    Deplyze community is a quiet product. No noise. No mixed content. No algorithmic chaos. Just prayer and encouragement.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </>
  );
}
