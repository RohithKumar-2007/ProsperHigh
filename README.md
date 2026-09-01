# 🚀 ProsperHigh — Explainable Multi-Agent Investment Intelligence Platform

ProsperHigh is a personalized AI-powered financial intelligence system that evaluates stock investments based on **your specific financial profile, risk tolerance, goals, and portfolio holdings**.

---

## 🌟 Key Features

- **Zero Predefined / Fake Data**: All portfolio analytics, returns, and health scores (0-100) are dynamically calculated using deterministic financial formulas.
- **Provider Adapter Architecture**: Search and analyze ANY stock symbol across NSE/BSE and global markets (`TATAMOTORS`, `RELIANCE`, `TCS`, `INFY`, `HDFCBANK`, `ICICIBANK`, etc.).
- **10-Step Investor Profile & Financial Context Wizard**: Calculates a dynamic **Risk Score (0-100)** and risk profile category based on investment capacity, monthly contribution, emergency savings, goals, horizon, and drawdown reaction scenarios.
- **7-Agent Intelligence System**: Independent evaluation by Market, Technical, Fundamental, News (FinBERT), Regulatory (RAG), Risk, and Synthesis Agents.
- **Progressive Disclosure UI Workspace**: Clean recommendation badge (`SUITABLE`, `SUITABLE WITH CAUTION`, `UNSUITABLE / HIGH RISK`) with expandable agent reasoning breakdown, visual conflict bar, counterfactuals, thesis invalidation, and stock switcher.
- **Citation-Backed RAG Research**: Natural language query over annual reports and filings with verifiable document and page citations.
- **Interactive 6-Step Guided Tour**: Contextual tour guiding the user step-by-step through the platform.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: FastAPI (Python), SQLite Database, Analytics Formulas Engine, Multi-Agent Orchestrator
- **AI Router**: Gemini Flash / Groq / Local Ollama (`qwen3:8b`) with rule-based fallback

---

## 🚦 Local 1-Click Launch

1. Double-click `run_all.cmd` or run:
   - **Frontend App**: `http://localhost:3000`
   - **FastAPI REST API**: `http://127.0.0.1:8000`
