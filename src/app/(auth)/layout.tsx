import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-neutral-200">
      <header className="py-4 px-6 md:px-12 border-b border-neutral-100 flex justify-center">
        <Link href="/" className="text-xl font-medium tracking-tight">
          deplyze<sup className="text-xs">&reg;</sup>
        </Link>
      </header>
      <main className="flex-grow flex items-center justify-center py-6 px-6">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </main>
      <footer className="py-4 px-6 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Deplyze Community
      </footer>
    </div>
  );
}
