import { logoutAction } from "../actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <nav className="bg-ocean-dark text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">SeArt Surf Camp - Admin</h1>
        <form action={logoutAction}>
          <button type="submit" className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-bold transition-colors">Logout</button>
        </form>
      </nav>
      <main className="p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
