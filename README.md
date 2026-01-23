# 🛡️ RAKSHAK - AI-Powered Accident Response System

![Rakshak Banner](https://img.shields.io/badge/Status-Live-success?style=for-the-badge) ![Tech](https://img.shields.io/badge/Stack-MERN_Alternative-blue?style=for-the-badge)

> **"Seconds save lives."** > Rakshak is an IoT-enabled progressive web app (PWA) that automatically detects vehicle accidents using device sensors (accelerometer/GPS) and instantly alerts emergency contacts with precise live location data.

---

## 🚀 Live Demo
- **Frontend (Mobile App):** [[https://rakshak-sigma.vercel.app] 
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
