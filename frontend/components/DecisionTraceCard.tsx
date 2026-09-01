"use client";

import React from "react";
import { GitCommit, ArrowRight } from "lucide-react";

interface Step {
  stage: string;
  status: string;
  impact: string;
}

interface Props {
  trace: Step[];
}

export const DecisionTraceCard: React.FC<Props> = ({ trace }) => {
  const getStatusBadge = (status: string) => {
    if (status === "BUY") return "bg-positive text-white";
    if (status === "HOLD") return "bg-warning text-white";
    return "bg-negative text-white";
  };

  return (
    <div className="prosper-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <GitCommit className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-base font-bold text-charcoal font-manrope">Decision Trace (Sequential Pipeline Evolution)</h3>
            <p className="text-xs text-slate-500">Answers: What changed the decision as it moved through the pipeline?</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 overflow-x-auto pb-2">
        {trace.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex-1 min-w-[140px] flex flex-col justify-between">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Step {idx + 1}
              </div>
              <div className="text-xs font-bold text-charcoal mb-2 line-clamp-2">{step.stage}</div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${getStatusBadge(step.status)}`}>
                  {step.status}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-600">{step.impact}</span>
              </div>
            </div>

            {idx < trace.length - 1 && (
              <div className="hidden md:flex items-center justify-center text-slate-400">
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
