import json
from typing import Dict, Any
from backend.database.models import get_db

class ProfileService:
    def calculate_risk_score(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates dynamic Risk Score (0-100) based on questionnaire:
        - Experience Level
        - Investment Horizon
        - Loss Tolerance Scenario (e.g., portfolio drops 20%)
        - Income Stability & Volatility Comfort
        """
        score = 50  # Base neutral score
        
        # 1. Experience Level (+ / -)
        exp = data.get("experience_level", "Beginner")
        if exp == "Beginner":
            score -= 10
        elif exp == "Active Investor":
            score += 10
        elif exp == "Highly Experienced":
            score += 18
            
        # 2. Investment Horizon (+ / -)
        horizon = data.get("investment_horizon", "Medium-Term")
        if horizon == "Short-Term":
            score -= 15
        elif horizon == "Long-Term":
            score += 12
        elif horizon == "Very Long-Term":
            score += 20
            
        # 3. Loss Tolerance Scenario (+ / -)
        loss_reaction = data.get("loss_reaction", "Wait and monitor")
        if loss_reaction == "Sell immediately":
            score -= 20
        elif font_reaction := data.get("loss_reaction") == "Invest more":
            score += 20
        elif loss_reaction == "Hold":
            score += 5
            
        # Clamp score between 10 and 95
        risk_score = max(10, min(95, score))
        
        if risk_score < 40:
            category = "Conservative"
        elif risk_score < 70:
            category = "Balanced Growth"
        else:
            category = "Aggressive"
            
        return {
            "risk_score": risk_score,
            "risk_category": category,
            "max_stock_exposure_pct": 10.0 if category == "Conservative" else (20.0 if category == "Balanced Growth" else 35.0)
        }

    def update_profile(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        calc = self.calculate_risk_score(data)
        score = calc["risk_score"]
        category = calc["risk_category"]
        max_exp = calc["max_stock_exposure_pct"]
        
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute("""
        INSERT INTO investor_profiles (
            user_id, age_range, market_preference, experience_level, past_assets, primary_goals,
            investment_horizon, risk_score, risk_category, max_stock_exposure_pct, avoided_sectors
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            age_range=excluded.age_range,
            market_preference=excluded.market_preference,
            experience_level=excluded.experience_level,
            past_assets=excluded.past_assets,
            primary_goals=excluded.primary_goals,
            investment_horizon=excluded.investment_horizon,
            risk_score=excluded.risk_score,
            risk_category=excluded.risk_category,
            max_stock_exposure_pct=excluded.max_stock_exposure_pct,
            avoided_sectors=excluded.avoided_sectors,
            updated_at=CURRENT_TIMESTAMP
        """, (
            user_id,
            data.get("age_range", "25-34"),
            data.get("market_preference", "India"),
            data.get("experience_level", "Beginner"),
            json.dumps(data.get("past_assets", ["Stocks"])),
            json.dumps(data.get("primary_goals", ["Wealth Growth"])),
            data.get("investment_horizon", "Medium-Term"),
            score,
            category,
            max_exp,
            json.dumps(data.get("avoided_sectors", []))
        ))
        
        conn.commit()
        conn.close()
        
        return {
            "user_id": user_id,
            "risk_score": score,
            "risk_category": category,
            "max_stock_exposure_pct": max_exp,
            "details": data
        }

    def get_profile(self, user_id: str) -> Dict[str, Any]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM investor_profiles WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            return {
                "user_id": user_id,
                "risk_score": 50,
                "risk_category": "Balanced Growth",
                "experience_level": "Beginner",
                "investment_horizon": "Medium-Term",
                "primary_goals": ["Wealth Growth"],
                "max_stock_exposure_pct": 20.0
            }
            
        return {
            "user_id": user_id,
            "age_range": row["age_range"],
            "market_preference": row["market_preference"],
            "experience_level": row["experience_level"],
            "past_assets": json.loads(row["past_assets"] or "[]"),
            "primary_goals": json.loads(row["primary_goals"] or "[]"),
            "investment_horizon": row["investment_horizon"],
            "risk_score": row["risk_score"],
            "risk_category": row["risk_category"],
            "max_stock_exposure_pct": row["max_stock_exposure_pct"],
            "avoided_sectors": json.loads(row["avoided_sectors"] or "[]")
        }

profile_service = ProfileService()
