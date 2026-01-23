import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, Shield, Navigation, Phone, Lock, History } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

// --- CONFIGURATION ---
const API_URL = `https://rakshak-api-sovy.onrender.com`;
const G_FORCE_THRESHOLD = 15; 

// --- HELPER COMPONENT: MOVES MAP TO NEW LOCATION ---
function MapUpdater({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [sosStatus, setSosStatus] = useState('idle');
  const [acceleration, setAcceleration] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  const [location, setLocation] = useState([20.5937, 78.9629]); 
  
  // NOTE: 'username' is stored here for future expansion
  const [username, setUsername] = useState('');

  // --- 1. GET USER LOCATION ON STARTUP ---
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  // --- 2. DEFINE THE ALERT SENDER (Moved Up to fix "Hoisting" error) ---
  const sendAlertToBackend = useCallback(async (loc, msg) => {
    try {
      await axios.post(`${API_URL}/crash_alert`, {
        user_id: 101, 
        location: loc,
        message: msg
      });
      
      setSosStatus('success');
      
      // Play Alarm
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
      audio.play().catch(e => console.log("Audio blocked", e));
      
      setTimeout(() => setSosStatus('idle'), 5000);
      
    } catch (error) {
      alert("⚠️ Connection Failed! Check Server Terminal.");
      setSosStatus('idle');
      console.error(error);
    }
  }, []);

  // --- 3. DEFINE SOS FUNCTION ---
  const handleSOS = useCallback(async (msg = "Manual SOS Triggered") => {
    setSosStatus('sending');
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation([latitude, longitude]);
          const locString = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          await sendAlertToBackend(locString, msg);
        },
        async () => {
          console.warn("GPS Failed");
          await sendAlertToBackend("GPS Unavailable", msg);
        }
      );
    } else {
      await sendAlertToBackend("GPS Not Supported", msg);
    }
  }, [sendAlertToBackend]);

  // --- 4. AUTOMATION SENSOR (Corrected Logic) ---
  useEffect(() => {
    if (autoMode) {
      const handleMotion = (event) => {
        const { x, y, z } = event.accelerationIncludingGravity || { x:0, y:0, z:0 };
        const totalForce = Math.sqrt(x*x + y*y + z*z);
        setAcceleration(totalForce.toFixed(1));

        if (totalForce > G_FORCE_THRESHOLD && sosStatus === 'idle') {
          handleSOS("🚨 Automated Crash Detected");
        }
      };
      
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then(response => {
            if (response === 'granted') window.addEventListener('devicemotion', handleMotion);
          })
          .catch(console.error);
      } else {
        window.addEventListener('devicemotion', handleMotion);
      }
      
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [autoMode, sosStatus, handleSOS]);

  // --- 5. LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
          <div className="flex justify-center mb-6">
            <Shield size={64} className="text-red-500 drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-wide">RAKSHAK</h1>
          <p className="text-slate-400 text-center mb-8 text-sm">Next-Gen Accident Response System</p>
          
          <div className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-slate-500" size={20}/>
              <input 
                type="text" 
                placeholder="Mobile Number"
                className="w-full bg-slate-900 text-white py-3 pl-10 rounded-lg border border-slate-700 outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500" size={20}/>
              <input 
                type="password" 
                placeholder="Password"
                className="w-full bg-slate-900 text-white py-3 pl-10 rounded-lg border border-slate-700 outline-none"
              />
            </div>
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-lg font-bold hover:scale-105 active:scale-95 transition-all"
            >
              SECURE LOGIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 6. MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-24">
      {/* HEADER */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-800 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Shield className="text-red-500 fill-red-500/10" />
          <span className="font-bold text-xl tracking-wider">RAKSHAK</span>
        </div>
        <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-green-500/20">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          PROTECTED
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 max-w-md mx-auto">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            {/* SENSOR CARD */}
            <div className={`bg-slate-900 p-6 rounded-2xl border transition-all duration-300 ${autoMode ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-slate-800'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-slate-400 text-xs font-bold tracking-widest uppercase">AI Sentry Mode</h3>
                  <div className={`text-2xl font-bold mt-1 ${autoMode ? 'text-green-400' : 'text-slate-500'}`}>
                    {autoMode ? "ACTIVE" : "PAUSED"}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={autoMode} onChange={() => setAutoMode(!autoMode)} />
                  <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                </label>
              </div>
              
              {/* VISUALIZER - FIXED MATH LOGIC */}
              <div className="h-24 bg-slate-950/50 rounded-lg flex items-end justify-center gap-1 p-2 border border-slate-800">
                {[...Array(15)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 rounded-t-sm transition-all duration-75 ${autoMode ? 'bg-green-500' : 'bg-slate-700'}`}
                    style={{ 
                      // Fixed: Removed Math.random() to prevent "Impure Render" error
                      height: `${Math.min(100, (acceleration * 4) + (i % 2 === 0 ? 10 : 5))}%`, 
                      opacity: autoMode ? 1 : 0.3 
                    }}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center font-mono">
                SENSOR READOUT: {acceleration} m/s²
              </p>
            </div>

            {/* SOS BUTTON */}
            <div className="flex justify-center py-4">
              <button 
                onClick={() => handleSOS()}
                disabled={sosStatus === 'sending'}
                className={`relative w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${sosStatus === 'sending' ? 'bg-orange-500 scale-95 animate-pulse' : sosStatus === 'success' ? 'bg-green-600 scale-100' : 'bg-gradient-to-br from-red-600 to-red-800 shadow-red-900/40 hover:scale-105 active:scale-95 border-4 border-red-500/30'}`}
              >
                {sosStatus === 'sending' ? (
                   <span className="text-2xl font-bold tracking-widest">CONNECTING...</span>
                ) : sosStatus === 'success' ? (
                   <span className="text-2xl font-bold tracking-widest">SENT!</span>
                ) : (
                  <>
                    <AlertTriangle size={64} className="mb-2 text-white drop-shadow-md" />
                    <span className="text-4xl font-black tracking-[0.2em] text-white drop-shadow-md">SOS</span>
                    <span className="text-xs font-bold text-red-200 mt-2 tracking-wider">TAP FOR EMERGENCY</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB: MAP */}
        {activeTab === 'map' && (
          <div className="h-[75vh] rounded-2xl overflow-hidden border border-slate-700 relative shadow-2xl animate-in fade-in zoom-in duration-300">
             <MapContainer center={location} zoom={15} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors'/>
                <MapUpdater center={location} />
                <Marker position={location}>
                  <Popup className="font-sans font-bold text-slate-900">📍 You are here</Popup>
                </Marker>
             </MapContainer>
             
             <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur p-3 rounded-xl z-[1000] border border-slate-700 flex justify-between items-center shadow-xl">
                <div>
                   <div className="text-xs text-slate-400 font-bold uppercase">Current Location</div>
                   <div className="text-sm font-mono text-white">
                     {location[0].toFixed(4)}, {location[1].toFixed(4)}
                   </div>
                </div>
                <div className="bg-red-500 px-2 py-1 rounded text-white text-xs font-bold">LIVE</div>
             </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-2 flex justify-around items-center z-50">
        <button onClick={() => setActiveTab('home')} className={`p-3 rounded-xl flex flex-col items-center transition-all ${activeTab === 'home' ? 'text-red-500 bg-red-500/10' : 'text-slate-500 hover:text-slate-300'}`}><Shield size={24} /><span className="text-[10px] font-bold mt-1 uppercase">Home</span></button>
        <button onClick={() => setActiveTab('map')} className={`p-3 rounded-xl flex flex-col items-center transition-all ${activeTab === 'map' ? 'text-red-500 bg-red-500/10' : 'text-slate-500 hover:text-slate-300'}`}><Navigation size={24} /><span className="text-[10px] font-bold mt-1 uppercase">Live Map</span></button>
        <button className="p-3 rounded-xl flex flex-col items-center text-slate-500 opacity-50 cursor-not-allowed"><History size={24} /><span className="text-[10px] font-bold mt-1 uppercase">History</span></button>
      </div>
      <Analytics />
    </div>
  );
}

export default App;
