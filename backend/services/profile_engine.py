import json
from typing import Dict, Any
from backend.database.models import get_db

class ProfileEngine:
    def calculate_risk_and_weights(self, profile_data: Dict[str, Any], financial_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates dynamic Risk Score (0-100) and Dynamic Agent Synthesis Weights based on:
        - Investment Experience
        - Investment Horizon
        - Drawdown Scenario Reaction (20% drop)
        - Financial Context (Emergency savings status, Monthly capacity, Obligations)
        """
        score = 50  # Base neutral score
        
        # 1. Experience Impact
        exp = profile_data.get("experience_level", "Learning Investor")
        if exp == "Beginner":
            score -= 12
        elif exp == "Learning Investor":
            score -= 4
        elif exp == "Active Investor":
            score += 8
        elif exp == "Advanced":
            score += 16
            
        # 2. Horizon Impact
        horizon = profile_data.get("investment_horizon", "3–5 Years")
        if horizon == "< 1 Year":
            score -= 16
        elif horizon == "1–3 Years":
            score -= 6
        elif horizon == "3–5 Years":
            score += 4
        elif horizon == "5–10 Years":
            score += 12
        elif horizon == "10+ Years":
            score += 20
            
        # 3. Loss Reaction Scenario
        reaction = profile_data.get("loss_reaction", "Wait and monitor")
        if reaction == "Sell immediately":
            score -= 22
        elif reaction == "Sell some investments":
            score -= 10
        elif reaction == "Invest more":
            score += 18
        elif reaction == "Hold":
            score += 4
            
        # 4. Financial Context Impact
        emergency = financial_data.get("emergency_savings", "Yes")
        if emergency == "No":
            score -= 10
        elif emergency == "Partially":
            score -= 4
            
        risk_score = max(10, min(95, score))
        
        if risk_score < 40:
            category = "Conservative"
            weights = {
                "risk_weight": 0.35,
                "fundamental_weight": 0.30,
                "technical_weight": 0.10,
                "market_weight": 0.10,
                "news_weight": 0.08,
                "regulatory_weight": 0.07
            }
        elif risk_score < 70:
            category = "Balanced Growth"
            weights = {
                "risk_weight": 0.25,
                "fundamental_weight": 0.25,
                "technical_weight": 0.20,
                "market_weight": 0.10,
                "news_weight": 0.10,
                "regulatory_weight": 0.10
            }
        else:
            category = "Aggressive"
            weights = {
                "risk_weight": 0.15,
                "fundamental_weight": 0.25,
                "technical_weight": 0.30,
                "market_weight": 0.12,
                "news_weight": 0.10,
                "regulatory_weight": 0.08
            }
            
        return {
            "risk_score": risk_score,
            "risk_category": category,
            "agent_weights": weights,
            "max_stock_exposure_pct": 15.0 if category == "Conservative" else (25.0 if category == "Balanced Growth" else 35.0)
        }

    def save_full_profile(self, user_id: str, profile_data: Dict[str, Any], financial_data: Dict[str, Any]) -> Dict[str, Any]:
        calc = self.calculate_risk_and_weights(profile_data, financial_data)
        score = calc["risk_score"]
        category = calc["risk_category"]
        max_exp = calc["max_stock_exposure_pct"]
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Save Investor Profile
        cursor.execute("""
        INSERT INTO investor_profiles (
            user_id, country, currency, market_preference, experience_level, past_assets, primary_goals,
            primary_goal_top, investment_horizon, loss_reaction, volatility_comfort, risk_score,
            risk_category, max_stock_exposure_pct, onboarding_completed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        ON CONFLICT(user_id) DO UPDATE SET
            country=excluded.country,
            currency=excluded.currency,
            market_preference=excluded.market_preference,
            experience_level=excluded.experience_level,
            past_assets=excluded.past_assets,
            primary_goals=excluded.primary_goals,
            primary_goal_top=excluded.primary_goal_top,
            investment_horizon=excluded.investment_horizon,
            loss_reaction=excluded.loss_reaction,
            volatility_comfort=excluded.volatility_comfort,
            risk_score=excluded.risk_score,
            risk_category=excluded.risk_category,
            max_stock_exposure_pct=excluded.max_stock_exposure_pct,
            onboarding_completed=1,
            updated_at=CURRENT_TIMESTAMP
        """, (
            user_id,
            profile_data.get("country", "India"),
            profile_data.get("currency", "INR"),
            profile_data.get("market_preference", "NSE"),
            profile_data.get("experience_level", "Learning Investor"),
            json.dumps(profile_data.get("past_assets", [])),
            json.dumps(profile_data.get("primary_goals", ["Wealth Growth"])),
            profile_data.get("primary_goal_top", "Wealth Growth"),
            profile_data.get("investment_horizon", "3–5 Years"),
            profile_data.get("loss_reaction", "Wait and monitor"),
            profile_data.get("volatility_comfort", 50),
            score,
            category,
            max_exp
        ))
        
        # Save Financial Context
        cursor.execute("""
        INSERT INTO financial_profiles (
            user_id, planned_investment, current_invested, monthly_capacity, emergency_savings, financial_obligations
        ) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            planned_investment=excluded.planned_investment,
            current_invested=excluded.current_invested,
            monthly_capacity=excluded.monthly_capacity,
            emergency_savings=excluded.emergency_savings,
            financial_obligations=excluded.financial_obligations,
            updated_at=CURRENT_TIMESTAMP
        """, (
            user_id,
            financial_data.get("planned_investment", "₹25,000 – ₹1 Lakh"),
            financial_data.get("current_invested", "₹25,000"),
            financial_data.get("monthly_capacity", "₹5,000 – ₹15,000"),
            financial_data.get("emergency_savings", "Yes"),
            json.dumps(financial_data.get("financial_obligations", []))
        ))
        
        conn.commit()
        conn.close()
        
        return {
            "user_id": user_id,
            "risk_score": score,
            "risk_category": category,
            "onboarding_completed": True,
            "max_stock_exposure_pct": max_exp
        }

    def get_full_profile(self, user_id: str) -> Dict[str, Any]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM investor_profiles WHERE user_id = ?", (user_id,))
        p_row = cursor.fetchone()
        cursor.execute("SELECT * FROM financial_profiles WHERE user_id = ?", (user_id,))
        f_row = cursor.fetchone()
        conn.close()
        
        if not p_row:
            return {
                "user_id": user_id,
                "onboarding_completed": False,
                "risk_score": 58,
                "risk_category": "Balanced Growth",
                "experience_level": "Learning Investor",
                "investment_horizon": "3–5 Years",
                "max_stock_exposure_pct": 25.0
            }
            
        return {
            "user_id": user_id,
            "onboarding_completed": bool(p_row["onboarding_completed"]),
            "country": p_row["country"],
            "currency": p_row["currency"],
            "market_preference": p_row["market_preference"],
            "experience_level": p_row["experience_level"],
            "past_assets": json.loads(p_row["past_assets"] or "[]"),
            "primary_goals": json.loads(p_row["primary_goals"] or "[]"),
            "primary_goal_top": p_row["primary_goal_top"],
            "investment_horizon": p_row["investment_horizon"],
            "loss_reaction": p_row["loss_reaction"],
            "volatility_comfort": p_row["volatility_comfort"],
            "risk_score": p_row["risk_score"],
            "risk_category": p_row["risk_category"],
            "max_stock_exposure_pct": p_row["max_stock_exposure_pct"],
            "financial": {
                "planned_investment": f_row["planned_investment"] if f_row else "₹25,000 – ₹1 Lakh",
                "current_invested": f_row["current_invested"] if f_row else "₹25,000",
                "monthly_capacity": f_row["monthly_capacity"] if f_row else "₹5,000 – ₹15,000",
                "emergency_savings": f_row["emergency_savings"] if f_row else "Yes",
                "financial_obligations": json.loads(f_row["financial_obligations"] if f_row else "[]")
            }
        }

profile_engine = ProfileEngine()
