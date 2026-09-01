"use client";

import React from "react";
import { AlertOctagon, ArrowRight } from "lucide-react";

interface Props {
  invalidationCriteria: string[];
}

export const ThesisInvalidationCard: React.FC<Props> = ({ invalidationCriteria }) => {
  return (
    <div className="prosper-card p-6">
      <div className="flex items-center space-x-2 mb-3">
        <AlertOctagon className="w-5 h-5 text-negative" />
        <div>
          <h3 className="text-base font-bold text-charcoal font-manrope">Thesis Invalidation ("What Could Prove This Wrong?")</h3>
          <p className="text-xs text-slate-500">Key risks that would falsify current analysis</p>
        </div>
      </div>

      <div className="bg-red-50/20 p-4 rounded-xl border border-red-200/60">
        <div className="text-xs font-bold text-negative uppercase tracking-wider mb-2">Thesis May Change If:</div>
        <ul className="space-y-2">
          {invalidationCriteria.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2 text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
              <ArrowRight className="w-3.5 h-3.5 text-negative shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
