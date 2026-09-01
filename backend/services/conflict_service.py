from typing import Dict, Any, List

class ConflictService:
    def detect_conflicts(self, agent_outputs: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyzes signals across 6 domain agents:
        Technical, Fundamental, Market, News, Regulatory, Risk.
        Determines conflict severity level and generates explicit explanations.
        """
        signals = {}
        for agent_name, output in agent_outputs.items():
            if "signal" in output:
                signals[agent_name] = output["signal"]

        buy_count = sum(1 for s in signals.values() if s == "BUY")
        hold_count = sum(1 for s in signals.values() if s == "HOLD")
        avoid_count = sum(1 for s in signals.values() if s in ["AVOID", "SELL"])

        total_agents = len(signals)
        if total_agents == 0:
            return {"conflict_level": "LOW", "badge": "Strong Agreement", "summary": "Agents are aligned."}

        # Check for sharp disagreement (e.g. Technical/Fundamental BUY vs News/Regulatory/Risk AVOID)
        if (buy_count >= 2 and (avoid_count >= 2 or hold_count >= 2)) or (buy_count >= 2 and avoid_count >= 1):
            conflict_level = "HIGH"
            badge = "High Conflict"
            summary = "Sharp disagreement detected: Technical & Fundamental signals are positive, but News sentiment, Regulatory factors, or Portfolio Risk create significant friction."
        elif buy_count > 0 and avoid_count > 0:
            conflict_level = "MODERATE"
            badge = "Moderate Conflict"
            summary = "Moderate agent divergence: domain agents show mixed signals requiring personalized risk weighting."
        else:
            conflict_level = "LOW"
            badge = "Strong Agreement"
            summary = "High agent alignment: primary intelligence signals point in the same direction."

        disagreements = []
        if signals.get("technical") != signals.get("news") and "news" in signals:
            disagreements.append(f"Technical ({signals.get('technical')}) vs News ({signals.get('news')})")
        if signals.get("fundamental") != signals.get("risk") and "risk" in signals:
            disagreements.append(f"Fundamental ({signals.get('fundamental')}) vs Personalized Risk ({signals.get('risk')})")

        return {
            "conflict_level": conflict_level,
            "badge": badge,
            "summary": summary,
            "signals_breakdown": signals,
            "disagreements": disagreements
        }

conflict_service = ConflictService()
