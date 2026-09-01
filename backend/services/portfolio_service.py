from typing import Dict, Any, List
from backend.database.models import get_db
from backend.services.data_service import data_service

class PortfolioService:
    def get_user_portfolio(self, user_id: str) -> Dict[str, Any]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM holdings WHERE user_id = ?", (user_id,))
        rows = cursor.fetchall()
        conn.close()
        
        holdings = []
        total_val = 0.0
        sector_val: Dict[str, float] = {}
        
        for r in rows:
            sym = r["symbol"]
            qty = r["quantity"]
            avg_price = r["average_price"]
            
            # Fetch live quote data
            stock_info = data_service.get_stock_market_data(sym) or {}
            curr_price = stock_info.get("current_price", avg_price)
            name = stock_info.get("name", r["name"] or sym)
            sector = stock_info.get("sector", r["sector"] or "General")
            
            item_val = round(qty * curr_price, 2)
            total_val += item_val
            sector_val[sector] = sector_val.get(sector, 0.0) + item_val
            
            gain = round((curr_price - avg_price) * qty, 2)
            gain_pct = round(((curr_price - avg_price) / max(1, avg_price)) * 100, 2)
            
            holdings.append({
                "id": r["id"],
                "symbol": sym,
                "name": name,
                "sector": sector,
                "quantity": qty,
                "average_price": avg_price,
                "current_price": curr_price,
                "current_value": item_val,
                "gain_loss": gain,
                "gain_loss_pct": gain_pct,
                "portfolio_weight_pct": 0.0  # Computed below
            })
            
        # Compute weights and sector exposure percentages
        sector_exposure = {}
        if total_val > 0:
            for h in holdings:
                h["portfolio_weight_pct"] = round((h["current_value"] / total_val) * 100, 2)
            for sec, val in sector_val.items():
                sector_exposure[sec] = round((val / total_val) * 100, 2)
                
        # Calculate Portfolio Health Score (0-100)
        health = self.calculate_portfolio_health(holdings, sector_exposure)
        
        return {
            "user_id": user_id,
            "total_portfolio_value": round(total_val, 2),
            "holdings_count": len(holdings),
            "holdings": holdings,
            "sector_exposure": sector_exposure,
            "health_score": health["overall_score"],
            "health_breakdown": health["breakdown"]
        }

    def calculate_portfolio_health(self, holdings: List[Dict[str, Any]], sector_exposure: Dict[str, float]) -> Dict[str, Any]:
        """Calculates Portfolio Health Score (0-100) based on 5 subcategories"""
        if not holdings:
            return {
                "overall_score": 0,
                "breakdown": {"diversification": 0, "risk_alignment": 0, "concentration": 0, "sector_balance": 0, "goal_alignment": 0}
            }
            
        # 1. Diversification Score (based on count)
        div_score = min(95, len(holdings) * 18)
        
        # 2. Concentration Score (penalizes single stock > 25%)
        max_stock_weight = max((h["portfolio_weight_pct"] for h in holdings), default=0)
        conc_score = 90 if max_stock_weight <= 20 else (65 if max_stock_weight <= 30 else 40)
        
        # 3. Sector Balance Score (penalizes single sector > 35%)
        max_sector_weight = max((val for val in sector_exposure.values()), default=0)
        sec_score = 88 if max_sector_weight <= 25 else (68 if max_sector_weight <= 35 else 45)
        
        risk_align = 80
        goal_align = 82
        
        overall = int((div_score + conc_score + sec_score + risk_align + goal_align) / 5)
        
        return {
            "overall_score": overall,
            "breakdown": {
                "diversification": div_score,
                "risk_alignment": risk_align,
                "concentration": conc_score,
                "sector_balance": sec_score,
                "goal_alignment": goal_align
            }
        }

    def add_holding(self, user_id: str, symbol: str, quantity: int, price: float) -> Dict[str, Any]:
        sym = data_service.normalize_symbol(symbol)
        stock = data_service.get_stock_market_data(sym) or {}
        name = stock.get("name", sym)
        sector = stock.get("sector", "General")
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO holdings (user_id, symbol, name, sector, quantity, average_price) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, sym, name, sector, quantity, price)
        )
        conn.commit()
        conn.close()
        
        return self.get_user_portfolio(user_id)

    def delete_holding(self, user_id: str, holding_id: int) -> Dict[str, Any]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM holdings WHERE id = ? AND user_id = ?", (holding_id, user_id))
        conn.commit()
        conn.close()
        return self.get_user_portfolio(user_id)

portfolio_service = PortfolioService()
