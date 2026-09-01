import os

# ProsperHigh AI & System Configuration

# Model Router Priorities
PRIMARY_LLM_PROVIDER = os.getenv("PRIMARY_LLM_PROVIDER", "gemini")
SECONDARY_LLM_PROVIDER = os.getenv("SECONDARY_LLM_PROVIDER", "groq")
FALLBACK_LLM_PROVIDER = os.getenv("FALLBACK_LLM_PROVIDER", "local_qwen")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

# Technical Analysis Settings
RSI_PERIOD = 14
MACD_FAST = 12
MACD_SLOW = 26
MACD_SIGNAL = 9
SMA_SHORT = 20
SMA_MEDIUM = 50
SMA_LONG = 200

# Personalization Concentration Thresholds
HIGH_CONCENTRATION_THRESHOLD = 0.20  # 20% portfolio or sector exposure is high
VERY_HIGH_CONCENTRATION_THRESHOLD = 0.30  # 30% is very high concentration

# Banned Financial Phrases (Constraint 4 Discipline Linter)
BANNED_PHRASES = [
    "guaranteed profit",
    "guaranteed return",
    "guaranteed returns",
    "100% safe",
    "zero risk",
    "will definitely increase",
    "certain profit",
    "risk-free investment",
    "sure shot buy"
]
