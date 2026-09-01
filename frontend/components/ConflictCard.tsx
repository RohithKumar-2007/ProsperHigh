"use client";

import React from "react";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface Props {
  conflicts: {
    conflict_level: string;
    badge: string;
    summary: string;
    disagreements?: string[];
  };
}

export const ConflictCard: React.FC<Props> = ({ conflicts }) => {
  const isHigh = conflicts.conflict_level === "HIGH";
  const isModerate = conflicts.conflict_level === "MODERATE";

  return (
    <div className={`prosper-card p-6 border-l-4 ${isHigh ? "border-l-negative bg-red-50/30" : isModerate ? "border-l-warning bg-amber-50/30" : "border-l-positive bg-emerald-50/30"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isHigh ? (
            <AlertTriangle className="w-5 h-5 text-negative" />
          ) : isModerate ? (
            <Info className="w-5 h-5 text-warning" />
          ) : (
            <CheckCircle className="w-5 h-5 text-positive" />
          )}
          <h3 className="text-base font-bold text-charcoal font-manrope">Agent Disagreement & Conflict Detector</h3>
        </div>

        <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${isHigh ? "badge-negative" : isModerate ? "badge-warning" : "badge-positive"}`}>
          {conflicts.badge}
        </span>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
        {conflicts.summary}
      </p>

      {conflicts.disagreements && conflicts.disagreements.length > 0 && (
        <div className="mt-3">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Key Signal Clashes:</span>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {conflicts.disagreements.map((dis, idx) => (
              <span key={idx} className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-300 font-medium">
                {dis}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
