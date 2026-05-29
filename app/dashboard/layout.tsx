import Sidebar from "./Sidebar";
import PageTransition from "@/components/ui/PageTransition";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-cream-light">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto mt-16 md:mt-0">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
