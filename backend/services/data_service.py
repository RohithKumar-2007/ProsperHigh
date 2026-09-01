import json
import os
from typing import Dict, Any, Optional

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

class DataService:
    def __init__(self):
        self.market_data = self._load_json("market", "market_data.json")
        self.fundamentals_data = self._load_json("fundamentals", "fundamentals.json")
        self.news_data = self._load_json("news", "news_sentiment.json")
        self.documents_data = self._load_json("documents", "company_filings.json")
        self.users_data = self._load_json("users", "users_data.json")

    def _load_json(self, category: str, filename: str) -> Dict[str, Any]:
        filepath = os.path.join(DATA_DIR, category, filename)
        if not os.path.exists(filepath):
            return {}
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading {filepath}: {e}")
            return {}

    def normalize_symbol(self, symbol: str) -> str:
        """Translates variations like 'RELIANCE.NS', 'reliance', 'Reliance Industries' -> 'RELIANCE'"""
        clean = symbol.strip().upper().replace(".NS", "").replace(".BO", "")
        symbol_map = {
            "RELIANCE": "RELIANCE",
            "RELIANCE INDUSTRIES": "RELIANCE",
            "TCS": "TCS",
            "TATA CONSULTANCY SERVICES": "TCS",
            "INFY": "INFY",
            "INFOSYS": "INFY",
            "HDFCBANK": "HDFCBANK",
            "HDFC BANK": "HDFCBANK",
            "ICICIBANK": "ICICIBANK",
            "ICICI BANK": "ICICIBANK",
            "SBIN": "SBIN",
            "STATE BANK OF INDIA": "SBIN",
            "ITC": "ITC",
            "BHARTIARTL": "BHARTIARTL",
            "AIRTEL": "BHARTIARTL",
            "SUNPHARMA": "SUNPHARMA",
            "TATAMOTORS": "TATAMOTORS",
            "TATA MOTORS": "TATAMOTORS"
        }
        return symbol_map.get(clean, clean)

    def get_market_macro(self) -> Dict[str, Any]:
        return self.market_data.get("macro", {})

    def get_stock_market_data(self, symbol: str) -> Optional[Dict[str, Any]]:
        canon = self.normalize_symbol(symbol)
        return self.market_data.get("stocks", {}).get(canon)

    def get_stock_fundamentals(self, symbol: str) -> Optional[Dict[str, Any]]:
        canon = self.normalize_symbol(symbol)
        return self.fundamentals_data.get(canon)

    def get_stock_news(self, symbol: str) -> Optional[Dict[str, Any]]:
        canon = self.normalize_symbol(symbol)
        return self.news_data.get(canon)

    def get_company_documents(self, symbol: str) -> list:
        canon = self.normalize_symbol(symbol)
        all_docs = self.documents_data.get("documents", [])
        return [doc for doc in all_docs if doc.get("company") == canon]

    def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        return self.users_data.get("users", {}).get(user_id, self.users_data.get("users", {}).get("U001"))

    def get_all_stocks(self) -> list:
        stocks_dict = self.market_data.get("stocks", {})
        res = []
        for sym, data in stocks_dict.items():
            res.append({
                "symbol": sym,
                "name": data.get("name"),
                "sector": data.get("sector"),
                "price": data.get("current_price"),
                "change_pct": round(((data.get("current_price", 0) - data.get("previous_close", 0)) / max(1, data.get("previous_close", 1))) * 100, 2)
            })
        return res

data_service = DataService()
