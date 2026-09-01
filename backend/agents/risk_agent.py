from typing import Dict, Any
from backend.services.data_service import data_service

class RiskAgent:
    def analyze(self, symbol: str, user_id: str = "U001") -> Dict[str, Any]:
        user = data_service.get_user_profile(user_id)
        stock_data = data_service.get_stock_market_data(symbol) or {}
        sector = stock_data.get("sector", "General")
        
        risk_profile = user.get("risk_profile", "Moderate")
        horizon = user.get("investment_horizon", "Medium-Term")
        sector_exposure = user.get("sector_exposure", {}).get(sector, 0.0)
        
        # Calculate stock concentration in current holdings
        stock_exposure = 0.0
        for h in user.get("holdings", []):
            if h.get("symbol") == symbol:
                stock_exposure = h.get("portfolio_weight_pct", 0.0)
                break
                
        impact_score = 0
        neg_factors = []
        pos_factors = []
        
        # 1. Sector Concentration Check
        if sector_exposure > 30.0:
            impact_score -= 14
            neg_factors.append(f"High Sector Concentration: You already have {sector_exposure:.1f}% exposure to the {sector} sector.")
        elif sector_exposure > 20.0:
            impact_score -= 8
            neg_factors.append(f"Moderate Sector Exposure: You have {sector_exposure:.1f}% exposure to {sector}.")
        else:
            impact_score += 4
            pos_factors.append(f"Good Sector Diversification: Only {sector_exposure:.1f}% existing exposure to {sector}.")
            
        # 2. Stock Concentration Check
        if stock_exposure > 25.0:
            impact_score -= 10
            neg_factors.append(f"High Stock Concentration: This stock already makes up {stock_exposure:.1f}% of your portfolio.")
        elif stock_exposure > 15.0:
            impact_score -= 5
            neg_factors.append(f"Existing Stock Position: {stock_exposure:.1f}% of your portfolio.")
            
        # 3. Risk Profile Compatibility
        if risk_profile == "Conservative":
            if sector == "Energy":
                impact_score -= 4
                neg_factors.append("Conservative Profile Friction: Energy sector volatility exceeds your risk threshold.")
        elif risk_profile == "Aggressive":
            impact_score += 4
            pos_factors.append("Risk Profile Match: Aggressive profile aligns well with stock volatility.")
            
        biggest_risk = neg_factors[0] if neg_factors else "None (Low Portfolio Risk)"
        
        signal = "AVOID" if impact_score <= -15 else ("HOLD" if impact_score < 0 else "BUY")
        
        return {
            "agent_name": "risk",
            "status": "success",
            "signal": signal,
            "confidence": 0.90,
            "impact_score": impact_score,
            "user_id": user_id,
            "user_name": user.get("name"),
            "risk_profile": risk_profile,
            "sector_exposure_pct": sector_exposure,
            "stock_exposure_pct": stock_exposure,
            "biggest_risk": biggest_risk,
            "summary": f"Personalization Analysis for {user.get('name')}: {biggest_risk}",
            "positive_factors": pos_factors,
            "negative_factors": neg_factors,
            "evidence": [
                {"fact": f"User Risk Profile: {risk_profile}, Goal: {user.get('investment_goal')}"},
                {"fact": f"Existing {sector} Exposure: {sector_exposure:.1f}%, Stock Exposure: {stock_exposure:.1f}%"}
            ],
            "limitations": []
        }

risk_agent = RiskAgent()
