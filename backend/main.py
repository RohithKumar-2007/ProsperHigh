import os
import sys
from typing import Dict, Any, Optional, List

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, Query, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from backend.services.auth_service import auth_service
from backend.services.profile_engine import profile_engine
from backend.services.analytics_engine import analytics_engine
from backend.services.portfolio_service import portfolio_service
from backend.services.market_provider import market_provider
from backend.services.rag_service import rag_service
from backend.orchestrator.orchestrator import orchestrator

app = FastAPI(
    title="ProsperHigh Platform API v3",
    description="Dynamic User-Driven Multi-Agent Investment Intelligence System",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "ProsperHigh Platform API v3",
        "tagline": "Understand your investments. Understand why."
    }

# 1. AUTHENTICATION ROUTES
@app.post("/api/auth/register")
def register(payload: Dict[str, Any] = Body(...)):
    name = payload.get("name", "")
    email = payload.get("email", "")
    password = payload.get("password", "")
    if not name or not email or not password:
        raise HTTPException(status_code=400, detail="Name, email, and password are required.")
    res = auth_service.register_user(name, email, password)
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("error"))
    return res

@app.post("/api/auth/login")
def login(payload: Dict[str, Any] = Body(...)):
    email = payload.get("email", "")
    password = payload.get("password", "")
    res = auth_service.login_user(email, password)
    if not res.get("success"):
        raise HTTPException(status_code=401, detail=res.get("error"))
    return res

# 2. 10-STEP INVESTOR PROFILE & FINANCIAL CONTEXT
@app.get("/api/profile/{user_id}")
def get_profile(user_id: str):
    return profile_engine.get_full_profile(user_id)

@app.post("/api/profile/onboarding")
def save_onboarding(payload: Dict[str, Any] = Body(...)):
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required.")
    profile_data = payload.get("profile", {})
    financial_data = payload.get("financial", {})
    holdings = payload.get("holdings", [])
    
    # Save Investor & Financial Profile
    res = profile_engine.save_full_profile(user_id, profile_data, financial_data)
    
    # Save Initial Portfolio Holdings if provided
    if holdings:
        for h in holdings:
            sym = h.get("symbol", "")
            qty = int(h.get("quantity", 1))
            price = float(h.get("price", 100.0))
            if sym:
                portfolio_service.add_holding(user_id, sym, qty, price)
                
    return res

# 3. DYNAMIC PORTFOLIO CALCULATOR
@app.get("/api/portfolio/{user_id}")
def get_portfolio(user_id: str):
    user_port = portfolio_service.get_user_portfolio(user_id)
    user_prof = profile_engine.get_full_profile(user_id)
    max_limit = user_prof.get("max_stock_exposure_pct", 25.0)
    
    # Run deterministic formula calculations
    metrics = analytics_engine.calculate_portfolio_metrics(user_port.get("holdings", []), max_limit)
    metrics["user_id"] = user_id
    metrics["onboarding_completed"] = user_prof.get("onboarding_completed", False)
    return metrics

@app.post("/api/portfolio/holding")
def add_holding(payload: Dict[str, Any] = Body(...)):
    user_id = payload.get("user_id")
    symbol = payload.get("symbol")
    quantity = int(payload.get("quantity", 1))
    price = float(payload.get("average_price", 100.0))
    if not user_id or not symbol:
        raise HTTPException(status_code=400, detail="User ID and Symbol are required.")
    portfolio_service.add_holding(user_id, symbol, quantity, price)
    return get_portfolio(user_id)

@app.delete("/api/portfolio/holding/{user_id}/{holding_id}")
def delete_holding(user_id: str, holding_id: int):
    portfolio_service.delete_holding(user_id, holding_id)
    return get_portfolio(user_id)

# 4. DYNAMIC MARKET DATA & STOCK SEARCH
@app.get("/api/market/ticker")
def get_live_ticker():
    return {"ticker": market_provider.get_popular_universe()}

@app.get("/api/stocks/search")
def search_stocks(q: str = Query("", description="Stock search query")):
    return {"stocks": market_provider.search_symbol(q)}

# 5. MULTI-AGENT INTELLIGENCE ANALYSIS
@app.post("/api/analyze")
def analyze(payload: Dict[str, Any] = Body(...)):
    symbol = payload.get("symbol", "RELIANCE")
    user_id = payload.get("user_id", "U001")
    return orchestrator.analyze_stock(symbol, user_id)

# 6. RAG RESEARCH TERMINAL
@app.post("/api/research/ask")
def research(payload: Dict[str, Any] = Body(...)):
    symbol = payload.get("symbol", "RELIANCE")
    query = payload.get("query", "regulatory risk and capex")
    return rag_service.query_filings(symbol, query)
