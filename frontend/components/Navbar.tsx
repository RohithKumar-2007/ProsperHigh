"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserProfileSelector } from "./UserProfileSelector";
import { Compass, PieChart, Search, BookOpen, History, Settings, LayoutDashboard } from "lucide-react";

interface Props {
  selectedUser: string;
  onSelectUser: (userId: string) => void;
  onStartTour?: () => void;
}

export const Navbar: React.FC<Props> = ({ selectedUser, onSelectUser, onStartTour }) => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analyze", label: "Analyze", icon: Search },
    { href: "/portfolio", label: "Portfolio", icon: PieChart },
    { href: "/research", label: "Research RAG", icon: BookOpen },
    { href: "/history", label: "History", icon: History },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <header className="bg-panel border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary text-white p-2 rounded-lg font-bold tracking-wider text-xl font-manrope">
                PROSPER<span className="text-accent">HIGH</span>
              </div>
            </Link>
            <span className="hidden lg:inline text-xs text-slate-500 border-l border-slate-300 pl-3 py-1 font-medium">
              Understand the decision. Not just the recommendation.
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary border-b-2 border-primary"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Switcher & Tour Button */}
          <div className="flex items-center space-x-3">
            <UserProfileSelector selectedUser={selectedUser} onSelectUser={onSelectUser} />

            {onStartTour && (
              <button
                onClick={onStartTour}
                className="flex items-center space-x-1 bg-accent text-charcoal hover:bg-accent-light px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition-all"
                title="Start Guided Tour"
                id="tour-button"
              >
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">Guided Tour</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
