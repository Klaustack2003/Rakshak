import os
import sqlite3
import psycopg2
import requests  # Using requests to talk to Telegram
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

# --- SECURITY ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURATION ---
DATABASE_URL = os.getenv("DATABASE_URL")
# New Telegram Credentials
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

# --- DATABASE SETUP ---
def get_db_connection():
    if DATABASE_URL:
        return psycopg2.connect(DATABASE_URL, sslmode='require')
    return sqlite3.connect('rakshak.db')

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    # Create Table (Postgres vs SQLite syntax)
    if DATABASE_URL:
        cursor.execute('''CREATE TABLE IF NOT EXISTS accident_logs (id SERIAL PRIMARY KEY, user_id INTEGER, location TEXT, message TEXT, timestamp TEXT)''')
    else:
        cursor.execute('''CREATE TABLE IF NOT EXISTS accident_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, location TEXT, message TEXT, timestamp TEXT)''')
    conn.commit()
    conn.close()

init_db()

# --- MODELS ---
class CrashReport(BaseModel):
    user_id: int
    location: str
    message: str

# --- TELEGRAM ALERT FUNCTION ---
def send_telegram_alert(location, message):
    if not (TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID):
        print("⚠️ Telegram credentials missing. Alert skipped.")
        return "Skipped"

    try:
        # Create a clickable Google Maps link
        map_link = f"https://www.google.com/maps/search/?api=1&query={location}"
        
        # Professional Alert Format
        text = (
            f"🚨 *RAKSHAK SOS ALERT* 🚨\n\n"
            f"⚠️ *Status:* {message}\n"
            f"📍 *Location:* [Open Map]({map_link})\n"
            f"⏳ *Time:* {datetime.now().strftime('%H:%M:%S')}\n"
            f"🛡️ *System:* Auto-detected via Rakshak 2.0"
        )
        
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": text,
            "parse_mode": "Markdown",
            "disable_web_page_preview": False
        }
        
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            print("✅ Telegram Alert Sent!")
            return "Sent"
        else:
            print(f"❌ Telegram Error: {response.text}")
            return "Failed"
            
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
        return "Failed"

# --- API ENDPOINTS ---
@app.get("/")
def home():
    return {
        "status": "Rakshak API Online", 
        "mode": "Cloud (PostgreSQL)" if DATABASE_URL else "Local (SQLite)",
        "telegram_active": bool(TELEGRAM_BOT_TOKEN)
    }

@app.post("/crash_alert")
def receive_crash(report: CrashReport):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    time_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Save to DB
    query = "INSERT INTO accident_logs (user_id, location, message, timestamp) VALUES (%s, %s, %s, %s)" if DATABASE_URL else \
            "INSERT INTO accident_logs (user_id, location, message, timestamp) VALUES (?, ?, ?, ?)"
    
    cursor.execute(query, (report.user_id, report.location, report.message, time_now))
    conn.commit()
    conn.close()
    
    # TRIGGER TELEGRAM
    alert_status = send_telegram_alert(report.location, report.message)
    
    return {"status": "ALERT_SAVED", "alert_status": alert_status, "timestamp": time_now}

@app.get("/view_history")
def view_history():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM accident_logs ORDER BY id DESC")
    rows = cursor.fetchall()
    
    results = []
    for row in rows:
        results.append({
            "id": row[0],
            "user_id": row[1],
            "location": row[2],
            "message": row[3],
            "timestamp": row[4]
        })
    conn.close()
    return results