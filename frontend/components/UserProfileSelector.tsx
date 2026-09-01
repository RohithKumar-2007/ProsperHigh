"use client";

import React from "react";
import { User, ShieldAlert, Zap } from "lucide-react";

interface Props {
  selectedUser: string;
  onSelectUser: (userId: string) => void;
}

export const UserProfileSelector: React.FC<Props> = ({ selectedUser, onSelectUser }) => {
  return (
    <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
      <span className="text-xs font-semibold text-slate-500 uppercase px-2 hidden sm:inline">Investor Profile:</span>
      <button
        onClick={() => onSelectUser("U001")}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
          selectedUser === "U001"
            ? "bg-primary text-white shadow-sm"
            : "text-slate-700 hover:bg-slate-200"
        }`}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
        <span>User A (Conservative)</span>
        <span className="bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded text-[10px] hidden md:inline">35% Energy</span>
      </button>
      <button
        onClick={() => onSelectUser("U002")}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
          selectedUser === "U002"
            ? "bg-primary text-white shadow-sm"
            : "text-slate-700 hover:bg-slate-200"
        }`}
      >
        <Zap className="w-3.5 h-3.5 text-emerald-300" />
        <span>User B (Aggressive)</span>
        <span className="bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded text-[10px] hidden md:inline">3% Energy</span>
      </button>
    </div>
  );
};
