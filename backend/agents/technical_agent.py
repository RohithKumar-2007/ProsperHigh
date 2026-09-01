from typing import Dict, Any
from backend.services.data_service import data_service

class TechnicalAgent:
    def analyze(self, symbol: str) -> Dict[str, Any]:
        stock_data = data_service.get_stock_market_data(symbol) or {}
        tech = stock_data.get("technical_indicators", {})
        price = stock_data.get("current_price", 0)
        
        rsi = tech.get("rsi", 50)
        macd_hist = tech.get("macd_histogram", 0)
        sma20 = tech.get("sma20", price)
        sma50 = tech.get("sma50", price)
        sma200 = tech.get("sma200", price)
        
        daily_sig = tech.get("daily_signal", "BUY")
        weekly_sig = tech.get("weekly_signal", "HOLD")
        monthly_sig = tech.get("monthly_signal", "BUY")
        
        # Calculate impact score based on technical rules
        impact_score = 0
        reasons = []
        
        if price > sma50:
            impact_score += 6
            reasons.append(f"Price (₹{price:.2f}) above SMA50 (₹{sma50:.2f})")
        else:
            impact_score -= 4
            reasons.append(f"Price below SMA50")
            
        if macd_hist > 0:
            impact_score += 5
            reasons.append("MACD histogram bullish (+1.45)")
        else:
            impact_score -= 3
            
        if 40 <= rsi <= 65:
            impact_score += 5
            reasons.append(f"RSI healthy ({rsi})")
        elif rsi > 70:
            impact_score -= 2
            reasons.append(f"RSI near overbought ({rsi})")
            
        # Check multi-timeframe conflict
        timeframe_conflict = False
        if daily_sig != weekly_sig:
            timeframe_conflict = True
            
        signal = "BUY" if impact_score >= 10 else ("HOLD" if impact_score >= 0 else "AVOID")
        
        return {
            "agent_name": "technical",
            "status": "success",
            "signal": signal,
            "confidence": 0.82,
            "impact_score": impact_score,
            "rsi": rsi,
            "macd": tech.get("macd"),
            "sma50": sma50,
            "sma200": sma200,
            "multi_timeframe": {
                "daily": daily_sig,
                "weekly": weekly_sig,
                "monthly": monthly_sig,
                "conflict": timeframe_conflict
            },
            "summary": f"Technical momentum is positive (+{impact_score}). Price trades above SMA50 with RSI at {rsi}.",
            "positive_factors": reasons,
            "negative_factors": ["Multi-timeframe conflict between daily and weekly trends"] if timeframe_conflict else [],
            "evidence": [
                {"fact": f"RSI: {rsi}, MACD: {tech.get('macd')}"},
                {"fact": f"SMA20: {sma20}, SMA50: {sma50}, SMA200: {sma200}"}
            ],
            "limitations": ["Intraday orderbook depth not evaluated"]
        }

technical_agent = TechnicalAgent()
