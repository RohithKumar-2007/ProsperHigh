"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

interface Props {
  agents: Record<string, { impact_score: number; agent_name: string }>;
  biggestFactorCallout?: string;
}

export const ImpactChart: React.FC<Props> = ({ agents, biggestFactorCallout }) => {
  const agentLabels: Record<string, string> = {
    technical: "Technical (+16)",
    fundamental: "Fundamental (+14)",
    market: "Market (+6)",
    news: "News (-9)",
    regulatory: "Regulatory (-8)",
    risk: "Risk (-22)",
  };

  const chartData = Object.entries(agents).map(([key, agent]) => {
    const score = agent.impact_score || 0;
    return {
      name: agentLabels[key] || key,
      score: score,
      absScore: Math.abs(score)
    };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="prosper-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-charcoal font-manrope">Agent Impact Visual (Signed Score Weights)</h3>
          <p className="text-xs text-slate-500">Positive weights push recommendation toward BUY; negative weights pull toward AVOID.</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <XAxis type="number" domain={[-30, 30]} tickCount={7} stroke="#94A3B8" fontSize={11} />
            <YAxis type="category" dataKey="name" stroke="#475569" fontSize={11} width={130} />
            <Tooltip
              formatter={(value: number) => [`${value > 0 ? "+" : ""}${value} points`, "Impact Score"]}
              contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", borderColor: "#CBD5E1", fontSize: "12px" }}
            />
            <ReferenceLine x={0} stroke="#64748B" strokeDasharray="3 3" />
            <Bar dataKey="score" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.score >= 0 ? "#4F8A68" : "#B75D5D"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {biggestFactorCallout && (
        <div className="mt-4 bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-start space-x-2 text-xs text-amber-900">
          <span className="font-extrabold text-amber-700 uppercase tracking-wider whitespace-nowrap">Biggest Factor:</span>
          <span>{biggestFactorCallout}</span>
        </div>
      )}
    </div>
  );
};
