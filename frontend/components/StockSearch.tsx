"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { searchStocks } from "@/lib/api";

interface Props {
  onSelectStock: (symbol: string) => void;
  currentSymbol?: string;
}

export const StockSearch: React.FC<Props> = ({ onSelectStock, currentSymbol }) => {
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    searchStocks(query).then((res) => {
      setStocks(res.stocks || []);
    });
  }, [query]);

  return (
    <div className="relative w-full max-w-md" id="tour-analyze">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search Indian Stock (e.g. RELIANCE, TCS, INFY, HDFCBANK)..."
          className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-xs font-medium"
        />
      </div>

      {isOpen && stocks.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => {
                onSelectStock(stock.symbol);
                setQuery("");
                setIsOpen(false);
              }}
              className="p-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-100 last:border-0"
            >
              <div>
                <span className="text-xs font-black text-charcoal">{stock.symbol}</span>
                <span className="text-xs text-slate-500 ml-2">{stock.name}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800">₹{stock.price}</span>
                <span className={`text-[10px] ml-1 font-semibold ${stock.change_pct >= 0 ? "text-positive" : "text-negative"}`}>
                  {stock.change_pct >= 0 ? "+" : ""}{stock.change_pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
