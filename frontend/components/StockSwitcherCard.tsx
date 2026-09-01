"use client";

import React from "react";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Alternative {
  symbol: string;
  name: string;
  match_score: number;
  reasons: string[];
}

interface Props {
  alternatives: Alternative[];
  currentSymbol: string;
  userName: string;
}

export const StockSwitcherCard: React.FC<Props> = ({ alternatives, currentSymbol, userName }) => {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="prosper-card p-6 border-l-4 border-l-accent bg-amber-50/20">
      <div className="flex items-center space-x-2 mb-3">
        <Sparkles className="w-5 h-5 text-accent" />
        <div>
          <h3 className="text-base font-bold text-charcoal font-manrope">Personalized Stock Switcher ("Better Portfolio Fits")</h3>
          <p className="text-xs text-slate-500">
            Based on {userName}'s current portfolio allocation and risk profile, these companies offer superior fit.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {alternatives.map((alt) => (
          <div key={alt.symbol} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-base font-black text-charcoal font-manrope">{alt.symbol}</span>
                  <div className="text-xs text-slate-500">{alt.name}</div>
                </div>

                <div className="text-right bg-emerald-50 text-positive px-3 py-1 rounded-lg border border-emerald-200">
                  <div className="text-[10px] font-bold uppercase">Portfolio Fit</div>
                  <div className="text-sm font-black">{alt.match_score}/100</div>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                {alt.reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-positive shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={`/analyze?symbol=${alt.symbol}`}
              className="mt-4 flex items-center justify-center space-x-1.5 w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors"
            >
              <span>Analyze {alt.symbol}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
