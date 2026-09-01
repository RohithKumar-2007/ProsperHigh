import json
import sqlite3
import os
import tempfile
from typing import Dict, Any, Optional, List

# Check if running in Vercel or read-only serverless environment
is_vercel = bool(os.environ.get("VERCEL"))
if is_vercel:
    DB_PATH = os.path.join(tempfile.gettempdir(), "prosperhigh.db")
else:
    DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database", "prosperhigh.db")

def get_db():
    try:
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        conn = sqlite3.connect(DB_PATH)
    except Exception:
        fallback_path = os.path.join(tempfile.gettempdir(), "prosperhigh.db")
        conn = sqlite3.connect(fallback_path)

    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    try:
        conn = get_db()
        cursor = conn.cursor()

        # 1. Users Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # 2. Investor Profiles Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS investor_profiles (
            user_id TEXT PRIMARY KEY,
            country TEXT DEFAULT 'India',
            currency TEXT DEFAULT 'INR',
            market_preference TEXT DEFAULT 'NSE',
            experience_level TEXT DEFAULT 'Learning Investor',
            past_assets TEXT DEFAULT '[]',
            primary_goals TEXT DEFAULT '[]',
            primary_goal_top TEXT DEFAULT 'Wealth Growth',
            investment_horizon TEXT DEFAULT '3–5 Years',
            loss_reaction TEXT DEFAULT 'Wait and monitor',
            volatility_comfort INTEGER DEFAULT 50,
            risk_score INTEGER DEFAULT 58,
            risk_category TEXT DEFAULT 'Balanced Growth',
            explanation_style TEXT DEFAULT 'Standard',
            max_stock_exposure_pct REAL DEFAULT 20.0,
            avoided_sectors TEXT DEFAULT '[]',
            onboarding_completed BOOLEAN DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """)

        # 3. Financial Context Profiles Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS financial_profiles (
            user_id TEXT PRIMARY KEY,
            planned_investment TEXT DEFAULT '₹25,000 – ₹1 Lakh',
            current_invested TEXT DEFAULT '₹25,000',
            monthly_capacity TEXT DEFAULT '₹5,000 – ₹15,000',
            emergency_savings TEXT DEFAULT 'Yes',
            financial_obligations TEXT DEFAULT '[]',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """)

        # 4. Portfolios & Holdings Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS holdings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            symbol TEXT NOT NULL,
            name TEXT,
            sector TEXT,
            quantity INTEGER NOT NULL,
            average_price REAL NOT NULL,
            purchase_date TEXT DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """)

        # 5. Analysis History Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            symbol TEXT NOT NULL,
            final_decision TEXT NOT NULL,
            confidence INTEGER NOT NULL,
            net_score INTEGER NOT NULL,
            summary TEXT,
            full_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """)

        conn.commit()
        conn.close()
    except Exception as e:
        print("Database initialization notice:", e)

init_db()
