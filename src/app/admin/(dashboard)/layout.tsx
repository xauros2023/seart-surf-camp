import Link from "next/link";
import { logoutAction } from "@/app/actions";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f5f7] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/admin" className="font-black tracking-tight">
            SeArt Admin
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50">
              View site
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>
    </div>
  );
}
