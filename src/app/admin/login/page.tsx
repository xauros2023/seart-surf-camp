"use client";

import { useState } from "react";
import { loginAction } from "../../actions";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginAction(password);
    if (res.success) {
      router.push("/admin");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-ocean-dark">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 p-3 rounded focus:border-ocean-dark focus:outline-none" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password (hint: tamraght2026)"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-ocean-dark text-white font-bold py-3 rounded hover:bg-ocean transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
