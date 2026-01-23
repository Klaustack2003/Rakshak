# 🛡️ RAKSHAK - AI-Powered Accident Response System

![Rakshak Banner](https://img.shields.io/badge/Status-Live-success?style=for-the-badge) ![Tech](https://img.shields.io/badge/Stack-MERN_Alternative-blue?style=for-the-badge)

> **"Seconds save lives."** > Rakshak is an IoT-enabled progressive web app (PWA) that automatically detects vehicle accidents using device sensors (accelerometer/GPS) and instantly alerts emergency contacts with precise live location data.

---

## 🚀 Live Demo
- **Frontend (Mobile App):** [https://rakshak-sigma.vercel.app] 
- **Backend API (Docs):** [https://rakshak-api-sovy.onrender.com] 

---

## 📸 Screenshots
| **Home Dashboard** | **Live Tracking Map** |
|:---:|:---:|
| ![Home Screen](https://via.placeholder.com/300x600?text=App+Home+Screen) | ![Map Screen](https://via.placeholder.com/300x600?text=Live+Map+View) |
| *Real-time G-Force monitoring* | *Precise GPS location sharing* |

---

## 🛠️ How It Works (Architecture)

**Rakshak** uses a decoupled architecture to ensure speed and reliability:

```mermaid
graph TD
    A[📱 User Phone] -->|Detects High G-Force| B(React Frontend)
    B -->|POST /crash_alert| C{FastAPI Backend}
    C -->|Store Incident| D[(PostgreSQL Database)]
    C -->|Trigger Notification| E[🚑 Emergency Services]
    F[💻 Dashboard] -->|GET /view_history| C

Detection: The React frontend monitors the DeviceMotion API. If G-Force > 25m/s², it triggers a crash event.

Localization: The app captures high-accuracy GPS coordinates (navigator.geolocation).

Processing: Data is sent securely (HTTPS) to the Python FastAPI backend hosted on Render.

Storage: Incident details are permanently stored in a cloud-hosted PostgreSQL database.

🧰 Tech Stack
Frontend (The Face)
React.js (Vite): Fast, component-based UI.

Tailwind CSS: Glassmorphism design for a modern aesthetic.

Leaflet Maps: Open-source interactive maps for location tracking.

Hosting: Vercel (Global Edge Network).

Backend (The Brain)
FastAPI (Python): High-performance async framework.

PostgreSQL: Enterprise-grade relational database for persistent storage.

Pydantic: Strict data validation.

Hosting: Render Cloud.

✨ Key Features
✅ Automatic Crash Detection: Uses the accelerometer to detect sudden stops/impacts.

✅ Smart Filtering: Threshold tuned to 25 m/s² to avoid false alarms from dropping the phone.

✅ One-Tap SOS: Giant manual trigger for medical emergencies or unsafe situations.

✅ Live GPS Tracking: Auto-centers map on the victim's location.

✅ Persistent Cloud Database: Logs survive server restarts (PostgreSQL).

✅ Cross-Platform: Works on Android, iOS, and Desktop browsers via HTTPS.

⚙️ Local Setup Guide
To run this project locally on your machine:

1. Clone the Repo
Bash
git clone [https://github.com/YOUR_USERNAME/rakshak-app.git](https://github.com/YOUR_USERNAME/rakshak-app.git)
cd rakshak-app
2. Backend Setup (Python)
Bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # (On Windows: venv\Scripts\activate)

# Install dependencies
pip install -r requirements.txt

# Run Server (Locally uses SQLite)
uvicorn server:app --reload
3. Frontend Setup (React)
Bash
cd frontend-react
npm install
npm run dev
🔮 Future Roadmap
[ ] Twilio Integration: Send real SMS texts to family members.

[ ] Hardware Module: Connect to an ESP32 for bike/helmet integration.

[ ] Voice Assistance: AI voice reassurance for the victim post-crash.
