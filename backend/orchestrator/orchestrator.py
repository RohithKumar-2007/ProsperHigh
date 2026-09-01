import asyncio
from typing import Dict, Any
from backend.agents.market_agent import market_agent
from backend.agents.technical_agent import technical_agent
from backend.agents.news_agent import news_agent
from backend.agents.fundamental_agent import fundamental_agent
from backend.agents.regulatory_agent import regulatory_agent
from backend.agents.risk_agent import risk_agent
from backend.agents.synthesis_agent import synthesis_agent
from backend.services.data_service import data_service

class Orchestrator:
    def analyze_stock(self, symbol: str, user_id: str = "U001") -> Dict[str, Any]:
        canonical_symbol = data_service.normalize_symbol(symbol)
        
        # Run 6 domain & risk agents
        agent_outputs = {}
        
        try:
            agent_outputs["market"] = market_agent.analyze(canonical_symbol)
        except Exception as e:
            agent_outputs["market"] = {"status": "failed", "error": str(e), "impact_score": 0}
            
        try:
            agent_outputs["technical"] = technical_agent.analyze(canonical_symbol)
        except Exception as e:
            agent_outputs["technical"] = {"status": "failed", "error": str(e), "impact_score": 0}
            
        try:
            agent_outputs["news"] = news_agent.analyze(canonical_symbol)
        except Exception as e:
            agent_outputs["news"] = {"status": "failed", "error": str(e), "impact_score": 0}
            
        try:
            agent_outputs["fundamental"] = fundamental_agent.analyze(canonical_symbol)
        except Exception as e:
            agent_outputs["fundamental"] = {"status": "failed", "error": str(e), "impact_score": 0}
            
        try:
            agent_outputs["regulatory"] = regulatory_agent.analyze(canonical_symbol)
        except Exception as e:
            agent_outputs["regulatory"] = {"status": "failed", "error": str(e), "impact_score": 0}
            
        try:
            agent_outputs["risk"] = risk_agent.analyze(canonical_symbol, user_id)
        except Exception as e:
            agent_outputs["risk"] = {"status": "failed", "error": str(e), "impact_score": 0}
            
        # Synthesize outputs
        result = synthesis_agent.synthesize(canonical_symbol, user_id, agent_outputs)
        return result

orchestrator = Orchestrator()
