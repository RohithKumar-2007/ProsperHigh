from typing import Dict, Any
from backend.services.data_service import data_service

class FundamentalAgent:
    def analyze(self, symbol: str) -> Dict[str, Any]:
        fund = data_service.get_stock_fundamentals(symbol) or {}
        
        trajectory = fund.get("trajectory", "STABLE")
        rev_growth = fund.get("revenue_growth_yo_y", 0)
        prof_growth = fund.get("profit_growth_yo_y", 0)
        cash_growth = fund.get("cash_flow_growth_yo_y", 0)
        anomalies = fund.get("anomalies", [])
        roe = fund.get("roe_pct", 0)
        debt = fund.get("debt_to_equity", 0)
        
        impact_score = 0
        pos_factors = []
        neg_factors = []
        
        if rev_growth > 10:
            impact_score += 6
            pos_factors.append(f"Strong Revenue Growth (+{rev_growth}% YoY)")
        if prof_growth > 10:
            impact_score += 6
            pos_factors.append(f"Robust Net Profit Growth (+{prof_growth}% YoY)")
        if roe > 15:
            impact_score += 4
            pos_factors.append(f"High Return on Equity ({roe}%)")
            
        if debt > 1.0:
            impact_score -= 4
            neg_factors.append(f"Elevated Debt to Equity ({debt:.2f})")
            
        # Anomaly checks
        for anom in anomalies:
            impact_score -= 4
            neg_factors.append(f"{anom.get('type')}: {anom.get('description')}")
            
        signal = "BUY" if impact_score >= 10 else ("HOLD" if impact_score >= 0 else "AVOID")
        
        return {
            "agent_name": "fundamental",
            "status": "success",
            "signal": signal,
            "confidence": 0.86,
            "impact_score": impact_score,
            "trajectory": trajectory,
            "anomalies": anomalies,
            "metrics": {
                "revenue_growth": rev_growth,
                "profit_growth": prof_growth,
                "cash_flow_growth": cash_growth,
                "roe": roe,
                "debt_to_equity": debt,
                "pe_ratio": fund.get("pe_ratio")
            },
            "summary": f"Fundamental trajectory is {trajectory.lower()} (Quality: {fund.get('quality_score', 'STRONG')}). Revenue +{rev_growth}%, Profit +{prof_growth}%.",
            "positive_factors": pos_factors,
            "negative_factors": neg_factors,
            "evidence": [
                {"fact": f"Revenue: ₹{fund.get('revenue_cr', 0):,} Cr, Profit: ₹{fund.get('net_profit_cr', 0):,} Cr"},
                {"fact": f"ROE: {roe}%, Debt/Equity: {debt}"}
            ],
            "limitations": []
        }

fundamental_agent = FundamentalAgent()
