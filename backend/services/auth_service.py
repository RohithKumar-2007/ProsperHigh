import hashlib
import uuid
import secrets
from typing import Dict, Any, Optional
from backend.database.models import get_db

class AuthService:
    def hash_password(self, password: str) -> str:
        return hashlib.sha256(password.encode("utf-8")).hexdigest()

    def register_user(self, name: str, email: str, password: str) -> Dict[str, Any]:
        email_clean = email.strip().lower()
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM users WHERE email = ?", (email_clean,))
        if cursor.fetchone():
            conn.close()
            return {"success": False, "error": "An account with this email address already exists."}
            
        user_id = "USR-" + secrets.token_hex(4).upper()
        password_hash = self.hash_password(password)
        
        cursor.execute(
            "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
            (user_id, name, email_clean, password_hash)
        )
        
        # Create default empty profile
        cursor.execute(
            "INSERT INTO investor_profiles (user_id, risk_score, risk_category) VALUES (?, 50, 'Moderate')",
            (user_id,)
        )
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "user": {
                "id": user_id,
                "name": name,
                "email": email_clean,
                "token": "PH-TOKEN-" + secrets.token_hex(16)
            }
        }

    def login_user(self, email: str, password: str) -> Dict[str, Any]:
        email_clean = email.strip().lower()
        password_hash = self.hash_password(password)
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email_clean,))
        row = cursor.fetchone()
        conn.close()
        
        if not row or row["password_hash"] != password_hash:
            return {"success": False, "error": "Invalid email address or password."}
            
        return {
            "success": True,
            "user": {
                "id": row["id"],
                "name": row["name"],
                "email": row["email"],
                "token": "PH-TOKEN-" + secrets.token_hex(16)
            }
        }

auth_service = AuthService()
