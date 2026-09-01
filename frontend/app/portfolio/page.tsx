"use client";

import React, { useState, useEffect } from "react";
import { getPortfolio, addHolding, deleteHolding } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ShieldAlert, CheckCircle2, PieChart as PieIcon, Plus, Trash2, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

export default function PortfolioPageV2() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState(10);
  const [price, setPrice] = useState(1000);
  const [submitting, setSubmitting] = useState(false);

  const fetchPortfolio = () => {
    setLoading(true);
    const user = getStoredUser();
    getPortfolio(user?.id).then((res) => {
      setPortfolio(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    setSubmitting(true);
    try {
      await addHolding(symbol.trim(), quantity, price);
      setShowAddModal(false);
      setSymbol("");
      fetchPortfolio();
    } catch (e) {
      alert("Failed to add holding.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (holdingId: number) => {
    if (confirm("Are you sure you want to remove this holding?")) {
      await deleteHolding(holdingId);
      fetchPortfolio();
    }
  };

  const COLORS = ["#1F3A4A", "#4F7C7A", "#C9A96E", "#4F8A68", "#C58B39", "#B75D5D"];

  const sectorData = Object.entries(portfolio?.sector_exposure || {}).map(([name, val]) => ({
    name,
    value: Number(val)
  }));

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dynamic Portfolio Engine</span>
          <h1 className="text-2xl font-extrabold text-charcoal font-manrope mt-1">
            My Portfolio Analytics & Holdings
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4 text-accent" />
          <span>Add Holding</span>
        </button>
      </div>

      {loading ? (
        <div className="prosper-card p-12 text-center text-slate-500">Loading live portfolio data...</div>
      ) : (
        <>
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="prosper-card p-5">
              <div className="text-xs font-semibold text-slate-500 uppercase">Total Portfolio Value</div>
              <div className="text-2xl font-black text-charcoal font-manrope mt-1">
                ₹{portfolio?.total_portfolio_value?.toLocaleString("en-IN") || "0"}
              </div>
            </div>

            <div className="prosper-card p-5">
              <div className="text-xs font-semibold text-slate-500 uppercase">Portfolio Health Score</div>
              <div className="text-2xl font-black text-accent font-manrope mt-1">
                {portfolio?.health_score || 0} / 100
              </div>
            </div>

            <div className="prosper-card p-5">
              <div className="text-xs font-semibold text-slate-500 uppercase">Active Holdings Count</div>
              <div className="text-2xl font-black text-primary font-manrope mt-1">
                {portfolio?.holdings?.length || 0} Positions
              </div>
            </div>
          </div>

          {/* Sector Allocation & Health Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="prosper-card p-6">
              <h3 className="text-base font-bold text-charcoal font-manrope mb-4 flex items-center space-x-2">
                <PieIcon className="w-5 h-5 text-primary" />
                <span>Sector Exposure Distribution</span>
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sectorData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, "Sector Exposure"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Health Score Breakdown Table */}
            <div className="prosper-card p-6">
              <h3 className="text-base font-bold text-charcoal font-manrope mb-4">Portfolio Health Subcategories</h3>
              <div className="space-y-3">
                {Object.entries(portfolio?.health_breakdown || {}).map(([cat, score]) => (
                  <div key={cat} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 capitalize">{cat.replace("_", " ")}</span>
                    <span className="font-black text-primary">{score as number}/100</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Holdings Table */}
          <div className="prosper-card p-6">
            <h3 className="text-base font-bold text-charcoal font-manrope mb-4">Active Stock Holdings Table</h3>
            {portfolio?.holdings?.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No stock holdings added yet. Click "Add Holding" above to start!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Symbol / Company</th>
                      <th className="py-2.5 px-3">Sector</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 px-3">Avg Price</th>
                      <th className="py-2.5 px-3">Live Price</th>
                      <th className="py-2.5 px-3">Current Value</th>
                      <th className="py-2.5 px-3">Weight</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {portfolio?.holdings?.map((h: any) => (
                      <tr key={h.id} className="hover:bg-slate-50 font-medium">
                        <td className="py-3 px-3">
                          <span className="font-black text-charcoal">{h.symbol}</span>
                          <div className="text-[10px] text-slate-500">{h.name}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{h.sector}</td>
                        <td className="py-3 px-3">{h.quantity}</td>
                        <td className="py-3 px-3">₹{h.average_price}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">₹{h.current_price}</td>
                        <td className="py-3 px-3 font-black text-charcoal">₹{h.current_value?.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-3 font-bold text-slate-600">{h.portfolio_weight_pct}%</td>
                        <td className="py-3 px-3 text-right">
                          <button onClick={() => handleDelete(h.id)} className="p-1 text-slate-400 hover:text-negative">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Holding Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-charcoal font-manrope mb-4">Add Holding to Portfolio</h3>
            <form onSubmit={handleAddHolding} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase">Stock Symbol</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. INFY, RELIANCE, TCS"
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase">Avg Purchase Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-bold border rounded-xl text-slate-600">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-xl">
                  {submitting ? "Adding..." : "Add Holding"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
