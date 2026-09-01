"use client";

import React from "react";
import { X, CheckCircle2, AlertCircle, HelpCircle, FileText, Scale } from "lucide-react";

interface AgentResult {
  agent_name: string;
  status: string;
  signal: string;
  confidence?: number;
  impact_score: number;
  summary: string;
  positive_factors?: string[];
  negative_factors?: string[];
  evidence?: any[];
  limitations?: string[];
}

interface Props {
  agent: AgentResult | null;
  onClose: () => void;
}

export const AgentDetailDrawer: React.FC<Props> = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto p-6 flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agent Intelligence Inspection</span>
              <h3 className="text-xl font-extrabold text-charcoal font-manrope capitalize">
                {agent.agent_name} Agent Analysis
              </h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <div className="text-[10px] font-semibold text-slate-500 uppercase">Signal</div>
              <div className="text-sm font-black text-primary mt-0.5">{agent.signal}</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <div className="text-[10px] font-semibold text-slate-500 uppercase">Confidence</div>
              <div className="text-sm font-black text-primary mt-0.5">{Math.round((agent.confidence || 0.8) * 100)}%</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <div className="text-[10px] font-semibold text-slate-500 uppercase">Impact Weight</div>
              <div className={`text-sm font-black mt-0.5 ${agent.impact_score >= 0 ? "text-positive" : "text-negative"}`}>
                {agent.impact_score > 0 ? `+${agent.impact_score}` : agent.impact_score} pts
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Summary Finding</h4>
            <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
              {agent.summary}
            </p>
          </div>

          {/* Positive Factors */}
          {agent.positive_factors && agent.positive_factors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-bold text-positive uppercase tracking-wider mb-2 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Supporting Positive Evidence</span>
              </h4>
              <ul className="space-y-1.5">
                {agent.positive_factors.map((factor, idx) => (
                  <li key={idx} className="text-xs text-slate-700 bg-positive/5 p-2 rounded border border-positive/20 flex items-start space-x-2">
                    <span className="text-positive font-bold">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Negative Factors */}
          {agent.negative_factors && agent.negative_factors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-bold text-negative uppercase tracking-wider mb-2 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Concerns & Negative Friction</span>
              </h4>
              <ul className="space-y-1.5">
                {agent.negative_factors.map((factor, idx) => (
                  <li key={idx} className="text-xs text-slate-700 bg-negative/5 p-2 rounded border border-negative/20 flex items-start space-x-2">
                    <span className="text-negative font-bold">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence List */}
          {agent.evidence && agent.evidence.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-accent" />
                <span>Source Attribution & Facts</span>
              </h4>
              <div className="space-y-2">
                {agent.evidence.map((ev, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-md border border-slate-200 text-xs text-slate-700">
                    {typeof ev === "string" ? ev : ev.fact || ev.headline || ev.claim || JSON.stringify(ev)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Limitations */}
          {agent.limitations && agent.limitations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Explicit Agent Limitations</span>
              </h4>
              <ul className="space-y-1">
                {agent.limitations.map((lim, idx) => (
                  <li key={idx} className="text-xs text-slate-500 italic">
                    • {lim}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-charcoal font-bold text-xs rounded-lg transition-colors"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
