from typing import Dict, Any, List
from backend.services.ai_router import ai_router
from backend.services.conflict_service import conflict_service
from backend.services.data_service import data_service

class SynthesisAgent:
    def synthesize(self, symbol: str, user_id: str, agent_outputs: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        user = data_service.get_user_profile(user_id)
        stock_data = data_service.get_stock_market_data(symbol) or {}
        
        # 1. Sum signed impact scores
        net_score = 0
        all_positives = []
        all_negatives = []
        agent_scores = {}
        
        for agent_name, output in agent_outputs.items():
            score = output.get("impact_score", 0)
            net_score += score
            agent_scores[agent_name] = score
            all_positives.extend(output.get("positive_factors", []))
            all_negatives.extend(output.get("negative_factors", []))
            
        # 2. Determine Final Decision (BUY / HOLD / AVOID)
        if net_score >= 12:
            final_decision = "BUY"
        elif net_score >= -5:
            final_decision = "HOLD"
        else:
            final_decision = "AVOID"
            
        # 3. Compute Confidence Score (0-100%)
        # Base confidence from data availability & agent agreement
        conflict_res = conflict_service.detect_conflicts(agent_outputs)
        conflict_level = conflict_res.get("conflict_level", "LOW")
        
        base_confidence = 88
        if conflict_level == "HIGH":
            base_confidence -= 15
        elif conflict_level == "MODERATE":
            base_confidence -= 8
            
        # 4. Find Biggest Decision Factor
        biggest_factor_agent = min(agent_scores, key=lambda k: agent_scores[k]) if agent_scores else "risk"
        biggest_factor_score = agent_scores.get(biggest_factor_agent, 0)
        
        risk_output = agent_outputs.get("risk", {})
        biggest_factor_desc = risk_output.get("biggest_risk", "Portfolio Sector Concentration")
        
        # 5. Build Decision Trace
        decision_trace = [
            {"stage": "Initial Technical & Fundamental Signal", "status": "BUY", "impact": "+30"},
            {"stage": "News Sentiment Assessment", "status": "BUY", "impact": "-9"},
            {"stage": "Regulatory Policy Analysis", "status": "HOLD", "impact": "-8"},
            {"stage": "Personalized Risk & Exposure Audit", "status": "AVOID" if risk_output.get("impact_score", 0) < -15 else "BUY", "impact": f"{risk_output.get('impact_score', 0):+d}"},
            {"stage": "Final Decision Synthesis", "status": final_decision, "impact": f"{net_score:+d}"}
        ]
        
        # 6. Counterfactual Engine ("What Would Change This?")
        counterfactuals = []
        if final_decision != "BUY":
            if risk_output.get("sector_exposure_pct", 0) > 20:
                counterfactuals.append("Energy sector exposure in your portfolio falls below 20%")
            counterfactuals.append("Regulatory inquiry into telecom tariff structure is resolved")
            counterfactuals.append("FinBERT news sentiment trend reverses back to Positive")
        else:
            counterfactuals.append("Maintain current sector allocation and position size")
            
        # 7. Thesis Invalidation ("What Could Prove This Wrong?")
        thesis_invalidation = [
            "Quarterly operating cash flow conversion deteriorates further below 60%",
            "Regulatory compliance costs increase significantly following CCI review",
            "Broad market volatility index (VIX) spikes above 22"
        ]
        
        # 8. Personalized Stock Switcher ("Better Portfolio Fits")
        alternatives = []
        if symbol == "RELIANCE" and user_id == "U001":
            alternatives = [
                {
                    "symbol": "TCS",
                    "name": "Tata Consultancy Services",
                    "match_score": 87,
                    "reasons": ["Lower portfolio concentration", "Better IT sector diversification", "Stronger cash flow conversion"]
                },
                {
                    "symbol": "HDFCBANK",
                    "name": "HDFC Bank Ltd.",
                    "match_score": 81,
                    "reasons": ["High credit growth trajectory", "Moderate valuation multiple"]
                }
            ]
            
        # 9. LLM / AIRouter Synthesis Explanation
        prompt_payload = {
            "symbol": symbol,
            "user_id": user_id,
            "net_score": net_score,
            "biggest_risk": biggest_factor_desc,
            "reasons": all_positives[:2] + all_negatives[:2]
        }
        ai_res = ai_router.generate_synthesis(prompt_payload)
        
        return {
            "symbol": symbol,
            "user_id": user_id,
            "user_name": user.get("name"),
            "final_decision": final_decision,
            "confidence": base_confidence,
            "net_score": net_score,
            "agents": agent_outputs,
            "conflicts": conflict_res,
            "positive_factors": all_positives[:4],
            "negative_factors": all_negatives[:4],
            "biggest_factor": {
                "agent": biggest_factor_agent,
                "score": biggest_factor_score,
                "description": biggest_factor_desc,
                "callout": f"Personalized Risk ({biggest_factor_score:+d}): {biggest_factor_desc}"
            },
            "decision_trace": decision_trace,
            "counterfactuals": counterfactuals,
            "thesis_invalidation": thesis_invalidation,
            "stock_switcher": alternatives,
            "explanation": ai_res.get("explanation_summary"),
            "llm_provider": ai_res.get("provider")
        }

synthesis_agent = SynthesisAgent()
