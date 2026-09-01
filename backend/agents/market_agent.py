from typing import Dict, Any
from backend.services.data_service import data_service

class MarketAgent:
    def analyze(self, symbol: str) -> Dict[str, Any]:
        macro = data_service.get_market_macro()
        stock_data = data_service.get_stock_market_data(symbol) or {}
        sector = stock_data.get("sector", "General")
        
        sector_status = macro.get("sector_status", {}).get(sector, "NEUTRAL")
        nifty_trend = macro.get("nifty50_trend", "BULLISH")
        breadth = macro.get("market_breadth", "Positive")
        
        # Calculate signed impact score
        impact_score = 0
        if nifty_trend == "BULLISH":
            impact_score += 4
        elif nifty_trend == "BEARISH":
            impact_score -= 4
            
        if sector_status == "LEADING":
            impact_score += 4
        elif sector_status == "WEAKENING":
            impact_score -= 2
        elif sector_status == "LAGGING":
            impact_score -= 4
            
        signal = "BUY" if impact_score > 3 else ("HOLD" if impact_score >= -2 else "AVOID")
        
        return {
            "agent_name": "market",
            "status": "success",
            "signal": signal,
            "confidence": 0.78,
            "impact_score": impact_score,
            "market_regime": nifty_trend,
            "sector_regime": sector_status,
            "market_breadth": breadth,
            "summary": f"Market conditions are {nifty_trend.lower()} with Nifty breadth {breadth}. Sector ({sector}) is currently {sector_status.lower()}.",
            "positive_factors": [f"Market regime: {nifty_trend}", f"Market breadth: {breadth}"] if impact_score > 0 else [],
            "negative_factors": [f"Sector rotation: {sector} is {sector_status.lower()}"] if sector_status in ["WEAKENING", "LAGGING"] else [],
            "evidence": [
                {"fact": f"Advancing stocks: {macro.get('advancing_stocks', 1421)}, Declining stocks: {macro.get('declining_stocks', 932)}"},
                {"fact": f"Repo Rate: {macro.get('repo_rate')}%, CPI Inflation: {macro.get('cpi_inflation')}%"}
            ],
            "limitations": []
        }

market_agent = MarketAgent()
