"use client";

import { useState } from "react";
import { loginAction } from "../../actions";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await loginAction(password);
    setLoading(false);
    if (res.success) {
      router.push("/admin");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f5f7] px-5 text-slate-950">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-black tracking-tight text-ocean-dark">Admin login</h1>
        <p className="mb-6 text-center text-sm text-slate-500">Private access for SeArt Surf Camp staff.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700" htmlFor="admin-password">Password</label>
            <input 
              id="admin-password"
              type="password" 
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-ocean-dark focus:ring-4 focus:ring-ocean/15"
              value={password} 
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-ocean-dark py-3 font-black text-white transition-colors hover:bg-ocean disabled:opacity-50">
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
