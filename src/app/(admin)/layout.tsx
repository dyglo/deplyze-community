import { Header } from "@/components/layout/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 selection:bg-neutral-200">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
