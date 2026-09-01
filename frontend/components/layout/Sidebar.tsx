"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getStoredUser, clearStoredUser, UserSession } from "@/lib/auth";
import {
  LayoutDashboard,
  PieChart,
  Search,
  Sparkles,
  BookOpen,
  History,
  Settings,
  HelpCircle,
  LogOut,
  User as UserIcon,
  ChevronRight
} from "lucide-react";

interface Props {
  onStartTour?: () => void;
}

export const Sidebar: React.FC<Props> = ({ onStartTour }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    const handleAuth = () => setUser(getStoredUser());
    window.addEventListener("auth-changed", handleAuth);
    return () => window.removeEventListener("auth-changed", handleAuth);
  }, []);

  const handleLogout = () => {
    clearStoredUser();
    router.push("/");
  };

  const navItems = [
    { section: "OVERVIEW", items: [{ href: "/", label: "Overview", icon: LayoutDashboard }] },
    {
      section: "INVEST",
      items: [
        { href: "/portfolio", label: "Portfolio", icon: PieChart },
        { href: "/analyze", label: "Analyze", icon: Search },
      ]
    },
    {
      section: "INTELLIGENCE",
      items: [
        { href: "/analyze?view=insights", label: "AI Insights", icon: Sparkles },
        { href: "/research", label: "Research", icon: BookOpen },
      ]
    },
    {
      section: "ACTIVITY",
      items: [{ href: "/history", label: "Decision History", icon: History }]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-800 shrink-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-white p-2 rounded-xl font-black text-lg tracking-wider font-manrope shadow-md border border-slate-700">
              PROSPER<span className="text-accent">HIGH</span>
            </div>
          </Link>
        </div>

        {/* Navigation Sections */}
        <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navItems.map((sec, idx) => (
            <div key={idx}>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-2">
                {sec.section}
              </div>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-md font-bold"
                          : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-accent" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* System Links */}
          <div className="pt-4 border-t border-slate-800/60 space-y-1">
            <Link
              href="/settings"
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                pathname === "/settings" ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </Link>

            {onStartTour && (
              <button
                onClick={onStartTour}
                className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-left"
              >
                <HelpCircle className="w-4 h-4 text-accent" />
                <span>Help & Guided Tour</span>
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* User Footer Profile Card */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs shrink-0 border border-slate-700">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-negative hover:bg-slate-800 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/login"
              className="flex-1 py-2 text-center bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex-1 py-2 text-center bg-accent hover:bg-accent-light text-charcoal text-xs font-extrabold rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};
