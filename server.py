import os
import sqlite3
import psycopg2
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

# --- SECURITY: CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all frontend connections
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SMART DATABASE CONNECTION ---
# Check if we are in the cloud (DATABASE_URL exists) or local (It doesn't)
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    if DATABASE_URL:
        # Cloud: Connect to PostgreSQL
        conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    else:
        # Local: Connect to SQLite
        conn = sqlite3.connect('rakshak.db')
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # PostgreSQL uses 'SERIAL' for auto-increment, SQLite uses 'AUTOINCREMENT'
    # We use a generic SQL approach compliant with both for simple tables
    if DATABASE_URL:
        # PostgreSQL Syntax
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS accident_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                location TEXT,
                message TEXT,
                timestamp TEXT
            )
        ''')
    else:
        # SQLite Syntax
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS accident_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                location TEXT,
                message TEXT,
                timestamp TEXT
            )
        ''')
    
    conn.commit()
    conn.close()

# Initialize DB on startup
init_db()

# --- MODELS ---
class CrashReport(BaseModel):
    user_id: int
    location: str
    message: str

# --- API ENDPOINTS ---
@app.get("/")
def home():
    return {"status": "Rakshak API Online", "db_type": "PostgreSQL" if DATABASE_URL else "SQLite"}

@app.post("/crash_alert")
def receive_crash(report: CrashReport):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    time_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # SQL query syntax differs slightly (Placeholder: %s for Postgres, ? for SQLite)
    query = "INSERT INTO accident_logs (user_id, location, message, timestamp) VALUES (%s, %s, %s, %s)" if DATABASE_URL else \
            "INSERT INTO accident_logs (user_id, location, message, timestamp) VALUES (?, ?, ?, ?)"
    
    cursor.execute(query, (report.user_id, report.location, report.message, time_now))
    
    conn.commit()
    conn.close()
    
    return {"status": "ALERT_SAVED", "timestamp": time_now}

@app.get("/view_history")
def view_history():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Fetch logs
    cursor.execute("SELECT * FROM accident_logs ORDER BY id DESC")
    rows = cursor.fetchall()
    
    # Format results as JSON
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