"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { setStoredUser } from "@/lib/auth";
import { Shield, ArrowRight, Lock, Mail, AlertCircle, RefreshCw } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res.success && res.user) {
        setStoredUser(res.user);
        router.push("/");
      } else {
        setError(res.error || "Invalid login credentials");
      }
    } catch (err: any) {
      setError(err.message || "Could not connect to authentication server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
          <Shield className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-2xl font-extrabold text-charcoal font-manrope">Welcome Back to ProsperHigh</h1>
        <p className="text-xs text-slate-500">Sign in to access your personalized portfolio intelligence.</p>
      </div>

      <div className="prosper-card p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-negative border border-red-200 rounded-lg text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Email Address</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohith@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 uppercase">Password</label>
              <a href="#" className="text-[11px] text-primary hover:underline font-semibold">Forgot Password?</a>
            </div>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all shadow-md flex items-center justify-center space-x-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>SIGN IN</span>}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Create Account Free
          </Link>
        </div>
      </div>
    </div>
  );
}
