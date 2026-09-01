from typing import Dict, Any
from backend.services.data_service import data_service

class NewsAgent:
    def analyze(self, symbol: str) -> Dict[str, Any]:
        news_info = data_service.get_stock_news(symbol) or {}
        articles = news_info.get("articles", [])
        trend = news_info.get("sentiment_trend", "STABLE")
        flags = news_info.get("flags", [])
        net_score = news_info.get("net_sentiment_score", 0.0)
        
        # Translate sentiment net score (-1.0 to +1.0) into impact score (-20 to +20)
        impact_score = int(net_score * 20)
        
        signal = "BUY" if impact_score >= 5 else ("HOLD" if impact_score >= -5 else "AVOID")
        
        pos_factors = [a["headline"] for a in articles if a.get("sentiment") == "POSITIVE"]
        neg_factors = [a["headline"] for a in articles if a.get("sentiment") == "NEGATIVE"]
        
        if "SENTIMENT_DETERIORATION" in flags:
            neg_factors.append("Sentiment Reversal Detected: news sentiment turned negative over rolling window")
            
        evidence = [{"headline": a["headline"], "source": a["source"], "category": a["category"]} for a in articles]
        
        return {
            "agent_name": "news",
            "status": "success",
            "signal": signal,
            "confidence": 0.68,
            "impact_score": impact_score,
            "sentiment_trend": trend,
            "flags": flags,
            "summary": f"FinBERT news sentiment is {trend.lower()} (net score {net_score:+.2f}). " + (f"Warning: {flags[0]}." if flags else ""),
            "positive_factors": pos_factors,
            "negative_factors": neg_factors,
            "evidence": evidence,
            "limitations": ["Social media sentiment excluded due to low source reliability score"]
        }

news_agent = NewsAgent()
