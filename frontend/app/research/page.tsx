"use client";

import React, { useState } from "react";
import { askResearch } from "@/lib/api";
import { Search, BookOpen, FileText, CheckCircle2, RefreshCw, ExternalLink, ShieldCheck } from "lucide-react";

export default function ResearchPageV2() {
  const [symbol, setSymbol] = useState("RELIANCE");
  const [query, setQuery] = useState("regulatory risk and capital expenditure commitments");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await askResearch(symbol, query);
      setResult(res);
    } catch (e) {
      alert("Research query failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Citation-Backed Document Terminal</span>
        <h1 className="text-2xl font-extrabold text-charcoal font-manrope mt-1">
          Corporate Filings & Document RAG
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Query Annual Reports, exchange disclosures, and regulatory filings with exact page-level citations.
        </p>
      </div>

      {/* Query Form */}
      <form onSubmit={handleAsk} className="prosper-card p-6 bg-slate-900 text-white space-y-4 border border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Target Stock Symbol</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs font-bold text-white mt-1"
            >
              <option value="RELIANCE">RELIANCE (Reliance Industries)</option>
              <option value="TCS">TCS (Tata Consultancy)</option>
              <option value="INFY">INFY (Infosys)</option>
              <option value="HDFCBANK">HDFCBANK (HDFC Bank)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Natural Language Question</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about capex, regulatory oversight, risks..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-accent hover:bg-accent-light text-charcoal font-extrabold text-xs rounded-xl shadow-md transition-all whitespace-nowrap flex items-center justify-center space-x-1.5"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Search Filings →</span>}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Research Output & Citations */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="prosper-card p-6 border-l-4 border-l-primary bg-slate-50 space-y-3">
            <div className="flex items-center space-x-2 text-primary font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Synthesized Research Answer</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {result.answer}
            </p>
          </div>

          {/* Citations Grid */}
          <div className="prosper-card p-6">
            <h3 className="text-sm font-extrabold text-charcoal font-manrope mb-4 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>Verifiable Source Document Citations</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.citations?.map((cit: any, idx: number) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">{cit.document}</span>
                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold">{cit.year}</span>
                  </div>
                  <div className="text-xs text-slate-700 font-semibold">{cit.citation_string}</div>
                  <div className="text-[11px] text-slate-500">{cit.section}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
