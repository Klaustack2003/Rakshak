import streamlit as st
import requests
import pandas as pd
import time

# Connect to your Backend Brain
# If you are testing on the same laptop, use localhost. 
# If testing from phone, change this to your laptop's IP (e.g., http://192.168.1.5:8000)
BACKEND_URL = "http://127.0.0.1:8000"

st.set_page_config(page_title="Rakshak Safety", page_icon="🛡️", layout="centered")

# --- HEADER ---
st.title("🛡️ Rakshak: AI Safety System")
st.markdown("---")

# --- SIDEBAR (Navigation) ---
mode = st.sidebar.radio("Select Mode:", ["🚗 Driver Mode (App)", "👮 Control Room (Admin)"])

# --- MODE 1: THE DRIVER APP ---
if mode == "🚗 Driver Mode (App)":
    st.subheader("Vehicle Monitoring System")
    
    # User Configuration (Mock Login)
    user_id = st.sidebar.number_input("User ID", value=101)
    
    # 1. Status Indicator
    st.success(f"✅ System Active for User {user_id}")
    st.info("📡 GPS Tracking: ON | 🔋 Battery: 84%")

    # 2. BIG RED BUTTON (Manual SOS)
    st.markdown("### Emergency Trigger")
    if st.button("🚨 SOS - REPORT ACCIDENT 🚨", type="primary", use_container_width=True):
        with st.spinner("Contacting Satellites..."):
            try:
                # Send data to your FastAPI Backend
                payload = {
                    "user_id": user_id,
                    "location": "Sector 5, Kolkata (Live GPS)", 
                    "message": "Manual SOS Triggered!"
                }
                response = requests.post(f"{BACKEND_URL}/crash_alert", json=payload)
                
                if response.status_code == 200:
                    st.error("🆘 ALERT SENT! Help is on the way!")
                    st.json(response.json()) # Show server reply
                else:
                    st.error("Server Connection Failed!")
            except:
                st.error("❌ Could not connect to Rakshak Brain. Is the server running?")

    # 3. AUTO-DRIVE SIMULATION
    st.markdown("---")
    st.subheader("Auto-Drive Simulation")
    if st.checkbox("Start Driving Simulation"):
        status_text = st.empty()
        bar = st.progress(0)
        
        for i in range(100):
            status_text.text(f"Driving... Speed: {i + 20} km/h")
            bar.progress(i + 1)
            time.sleep(0.05)
            
            # Simulate a crash at 80% progress
            if i == 80:
                status_text.text("⚠️ SUDDEN IMPACT DETECTED!")
                st.toast("💥 CRASH DETECTED!", icon="🔥")
                
                # Auto-send crash report
                try:
                    requests.post(f"{BACKEND_URL}/crash_alert", json={
                        "user_id": user_id,
                        "location": "Durgapur Expressway (Auto-Detected)",
                        "message": "High G-Force Impact (Automated)"
                    })
                    st.error("Automated Distress Signal Sent!")
                    break 
                except:
                    st.write("Offline Mode: Crash recorded locally.")

# --- MODE 2: THE CONTROL ROOM ---
elif mode == "👮 Control Room (Admin)":
    st.subheader("Real-time Accident Monitoring")
    
    if st.button("🔄 Refresh Data"):
        st.rerun()

    try:
        # Fetch history from Backend
        response = requests.get(f"{BACKEND_URL}/view_history")
        data = response.json()
        
        # Metrics
        col1, col2 = st.columns(2)
        col1.metric("Total Accidents", data["total_accidents"])
        col2.metric("Active Units", "54")

        # Table
        st.markdown("### 📋 Incident Log")
        if "logs" in data:
            df = pd.DataFrame(data["logs"])
            st.dataframe(df, use_container_width=True)
            
            # MAP VISUALIZATION (Bonus!)
            # We create fake coordinates for the map demo if real ones aren't numeric
            st.markdown("### 🗺️ Live Incident Map")
            map_data = pd.DataFrame({
                'lat': [23.5204, 22.5726], # Durgapur, Kolkata
                'lon': [87.3119, 88.3639]
            })
            st.map(map_data)
            
    except Exception as e:
        st.error(f"Cannot connect to Control Room. Error: {e}")