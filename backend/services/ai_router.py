import os
import json
import urllib.request
from typing import Dict, Any, Optional
from backend.config import BANNED_PHRASES, GEMINI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY

class AIRouter:
    def __init__(self):
        self.primary_provider = "gemini" if GEMINI_API_KEY else "ollama_local"
        self.backup_provider = "groq" if GROQ_API_KEY else "ollama_local"
        self.ollama_endpoint = os.getenv("OLLAMA_ENDPOINT", "http://localhost:11434/api/generate")
        self.ollama_model = os.getenv("OLLAMA_MODEL", "qwen3:8b")

    def lint_financial_language(self, text: str) -> str:
        """Constraint 4: Financial Language Discipline Linter. Purges banned phrases."""
        clean_text = text
        for banned in BANNED_PHRASES:
            if banned in clean_text.lower():
                clean_text = clean_text.replace(banned, "potential opportunity based on historical trends")
                clean_text = clean_text.replace(banned.title(), "Potential Opportunity")
        return clean_text

    def generate_synthesis(self, prompt_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        AI Model Router Architecture (Blueprint Section 12):
        Level 1 — Online Primary: Gemini API
        Level 2 — Online Backup: Groq / OpenRouter API
        Level 4 — Open Model / Local Fallback: Ollama (Qwen / DeepSeek-R1)
        Level 5 — Rule Engine Fallback: Deterministic Python Synthesis
        """
        symbol = prompt_data.get("symbol", "STOCK")
        
        # 1. Level 1: Try Gemini API if key is present
        if GEMINI_API_KEY:
            try:
                res = self._call_gemini(prompt_data)
                if res:
                    return res
            except Exception as e:
                print(f"Gemini API unavailable, routing to backup: {e}")

        # 2. Level 2: Try Groq API if key is present
        if GROQ_API_KEY:
            try:
                res = self._call_groq(prompt_data)
                if res:
                    return res
            except Exception as e:
                print(f"Groq API unavailable, routing to local Ollama fallback: {e}")

        # 3. Level 4: Try Ollama Local Open Model (Qwen/Llama) on http://localhost:11434
        try:
            res = self._call_ollama(prompt_data)
            if res:
                return res
        except Exception as e:
            print(f"Ollama local instance offline or model not pulled ({e}), falling back to deterministic synthesis.")

        # 4. Level 5: Rule-based fallback synthesis engine
        return self._rule_based_synthesis(prompt_data)

    def _call_gemini(self, prompt_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        prompt_text = f"Synthesize investment decision for {prompt_data.get('symbol')}. Facts: {json.dumps(prompt_data)}"
        payload = {"contents": [{"parts": [{"text": prompt_text}]}]}
        
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            text = res_data["candidates"][0]["content"]["parts"][0]["text"]
            return {"explanation_summary": self.lint_financial_language(text), "provider": "Gemini 1.5 Flash (Online Primary)"}

    def _call_groq(self, prompt_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GROQ_API_KEY}"
        }
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [{"role": "user", "content": f"Synthesize investment decision for {prompt_data.get('symbol')}: {json.dumps(prompt_data)}"}]
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            text = res_data["choices"][0]["message"]["content"]
            return {"explanation_summary": self.lint_financial_language(text), "provider": "Groq Llama-3.1 (Online Backup)"}

    def _call_ollama(self, prompt_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Level 4: Ollama Local Fallback REST call to http://localhost:11434/api/generate"""
        prompt_text = (
            f"You are ProsperHigh Investment Intelligence Agent. "
            f"Synthesize this decision for stock {prompt_data.get('symbol')} in 2 concise sentences. "
            f"Net score: {prompt_data.get('net_score')}. Key factors: {json.dumps(prompt_data.get('reasons'))}."
        )
        payload = {
            "model": self.ollama_model,
            "prompt": prompt_text,
            "stream": False
        }
        headers = {"Content-Type": "application/json"}
        req = urllib.request.Request(self.ollama_endpoint, data=json.dumps(payload).encode("utf-8"), headers=headers)
        with urllib.request.urlopen(req, timeout=4) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            text = res_data.get("response", "")
            if text:
                return {
                    "explanation_summary": self.lint_financial_language(text.strip()),
                    "provider": f"Ollama Local ({self.ollama_model})"
                }
        return None

    def _rule_based_synthesis(self, prompt_data: Dict[str, Any]) -> Dict[str, Any]:
        symbol = prompt_data.get("symbol", "STOCK")
        net_score = prompt_data.get("net_score", 0)
        risk_callout = prompt_data.get("biggest_risk", "")
        
        explanation = f"Based on multi-agent synthesis for {symbol}, technical and fundamental indicators produce a net score of {net_score:+d}. "
        if risk_callout:
            explanation += f"However, personalized risk analysis highlights significant factor: {risk_callout}."
        
        return {
            "explanation_summary": self.lint_financial_language(explanation),
            "provider": "ProsperHigh Decision Router (Deterministic Local Engine)"
        }

ai_router = AIRouter()
