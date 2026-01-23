import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <--- NEW IMPORT
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

# --- SECURITY UPGRADE: CORS ---
# This tells the server: "Allow the React app to talk to me"
origins = [
    "http://localhost:5173",    # React Localhost
    "http://127.0.0.1:5173",    # React Localhost alternate
    "*"                         # Allow Mobile Phones on local network
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE ---
def init_db():
    conn = sqlite3.connect('rakshak.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS accident_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            location TEXT,
            message TEXT,
            timestamp TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT,
            phone TEXT,
            relation TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# --- MODELS ---
class CrashReport(BaseModel):
    user_id: int
    location: str
    message: str

class Contact(BaseModel):
    user_id: int
    name: str
    phone: str
    relation: str

# --- API ENDPOINTS ---

@app.get("/")
def home():
    return {"status": "Rakshak API Online", "version": "2.0"}

@app.post("/crash_alert")
def receive_crash(report: CrashReport):
    conn = sqlite3.connect('rakshak.db')
    cursor = conn.cursor()
    
    # 1. Log with readable timestamp
    time_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(
        "INSERT INTO accident_logs (user_id, location, message, timestamp) VALUES (?, ?, ?, ?)",
        (report.user_id, report.location, report.message, time_now)
    )
    
    # 2. Check contacts
    cursor.execute("SELECT * FROM contacts WHERE user_id = ?", (report.user_id,))
    contacts = cursor.fetchall()
    conn.commit()
    conn.close()
    
    return {
        "status": "CRITICAL_ALERT_RECEIVED",
        "timestamp": time_now,
        "notified_contacts": [c[2] for c in contacts] # Returns names only
    }

@app.get("/view_history")
def view_history():
    conn = sqlite3.connect('rakshak.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM accident_logs ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return rows  # React prefers direct arrays, not nested objects