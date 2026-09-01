"use client";

import React from "react";
import { History, TrendingUp, TrendingDown, Clock, Sparkles } from "lucide-react";

export default function HistoryPageV2() {
  const mockHistory = [
    {
      id: "ANALYSIS-101",
      date: "2026-09-01 10:15 AM",
      symbol: "RELIANCE",
      decision: "HOLD",
      confidence: 78,
      net_score: -14,
      change_delta: "Shifted from BUY to HOLD due to Energy Concentration Risk (35.8%)"
    },
    {
      id: "ANALYSIS-100",
      date: "2026-08-28 02:30 PM",
      symbol: "TCS",
      decision: "BUY",
      confidence: 85,
      net_score: 22,
      change_delta: "Strong Enterprise AI Order Book momentum (+14 Fundamental score)"
    },
    {
      id: "ANALYSIS-099",
      date: "2026-08-20 11:00 AM",
      symbol: "HDFCBANK",
      decision: "BUY",
      confidence: 81,
      net_score: 18,
      change_delta: "High credit growth trajectory alignment with Moderate Risk Profile"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Auditability & Governance</span>
        <h1 className="text-2xl font-extrabold text-charcoal font-manrope mt-1">
          Decision History & Evolution Log
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track past AI agent recommendations and inspect what changed over time.
        </p>
      </div>

      <div className="space-y-4">
        {mockHistory.map((item) => (
          <div key={item.id} className="prosper-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <span className="font-black text-lg text-charcoal font-manrope">{item.symbol}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  item.decision === "BUY" ? "bg-positive/10 text-positive" : "bg-warning/10 text-warning"
                }`}>
                  {item.decision} • {item.confidence}% Confidence
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">{item.change_delta}</p>
              <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{item.date}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-slate-400 uppercase">Net Score</span>
              <div className="text-lg font-black text-primary font-manrope">{item.net_score} pts</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
