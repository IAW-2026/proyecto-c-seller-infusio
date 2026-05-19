import { requireAdmin } from "@/lib/admin";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-8 mt-14 md:mt-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
