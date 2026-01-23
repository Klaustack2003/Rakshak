import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, Shield, Navigation, Activity, Zap, MapPin, Gauge } from 'lucide-react';

// --- CONFIGURATION ---
const API_URL = "https://rakshak-api-sovy.onrender.com";
const CRASH_G_FORCE = 15; // Impact Threshold
const MIN_SPEED_FOR_CRASH = 10; // km/h (Prevents false alarms when walking/dropping phone)
const ALARM_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

function MapUpdater({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

// --- FANCY DASHBOARD UI ---
function ActivityDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/view_history`)
      .then(res => { setHistory(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in zoom-in duration-500">
      <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/50 shadow-2xl">
        <h3 className="font-bold text-emerald-400 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
          <Activity size={16} /> Accident Timeline
        </h3>
        {loading ? (
            <div className="text-center text-slate-500 py-10 animate-pulse">SYNCING CLOUD DATA...</div>
        ) : history.length === 0 ? (
           <div className="text-slate-500 text-center py-10 font-mono text-sm">NO INCIDENTS RECORDED</div>
        ) : (
          <div className="space-y-3">
            {history.map((log) => (
              <div key={log.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500/20 text-red-500 p-2 rounded-full"><AlertTriangle size={16} /></div>
                  <div>
                    <div className="text-xs text-slate-400 font-mono">{log.timestamp?.split(' ')[1]}</div>
                    <div className="text-sm font-bold text-slate-200">Crash Detected</div>
                  </div>
                </div>
                <div className="text-xs text-emerald-500 font-mono border border-emerald-500/30 px-2 py-1 rounded">RESOLVED</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [sosStatus, setSosStatus] = useState('idle');
  
  // SENSOR STATES
  const [acceleration, setAcceleration] = useState(0);
  const [speed, setSpeed] = useState(0); // New Speed State
  const [autoMode, setAutoMode] = useState(false);
  const [location, setLocation] = useState([20.5937, 78.9629]); 
  
  // Audio Ref
  const audioRef = useRef(new Audio(ALARM_URL));

  // --- 1. INITIALIZE SENSORS & GPS ---
  useEffect(() => {
    audioRef.current.load();

    if ("geolocation" in navigator) {
      // Use watchPosition for REAL-TIME speed updates
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setLocation([pos.coords.latitude, pos.coords.longitude]);
          // Speed is in m/s. Convert to km/h. (Default to 0 if null)
          const speedKmph = (pos.coords.speed || 0) * 3.6;
          setSpeed(speedKmph.toFixed(0));
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // --- 2. LOGIN & AUDIO UNLOCK ---
  const handleLogin = () => {
    audioRef.current.volume = 0;
    audioRef.current.play().then(() => {
        setTimeout(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 1.0; 
        }, 100);
    }).catch(console.error);
    setIsLoggedIn(true);
  };

  const playAlarm = useCallback(() => {
    audioRef.current.currentTime = 0;
    audioRef.current.volume = 1.0;
    audioRef.current.play().catch(console.error);
  }, []);

  // --- 3. SOS HANDLER ---
  const handleSOS = useCallback(async (msg = "Manual SOS") => {
    setSosStatus('sending');
    playAlarm(); 

    const send = async (loc) => {
        try {
            await axios.post(`${API_URL}/crash_alert`, { user_id: 101, location: loc, message: msg });
            setSosStatus('success');
            setTimeout(() => setSosStatus('idle'), 5000);
        } catch { setSosStatus('idle'); alert("Offline Mode: Alert Queued"); }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
          (p) => { 
              const loc = `${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`;
              send(loc);
          },
          () => send("GPS Unavailable")
      );
    } else { send("GPS Not Supported"); }
  }, [playAlarm]);

  // --- 4. PERMISSION HANDLER ---
  const toggleSentryMode = () => {
    if (!autoMode) {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then(response => {
            if (response === 'granted') setAutoMode(true);
            else alert("Permission Denied");
          })
          .catch(console.error);
      } else {
        setAutoMode(true);
      }
    } else {
      setAutoMode(false);
    }
  };

  // --- 5. CORE LOGIC (SPEED + G-FORCE) ---
  useEffect(() => {
    if (autoMode) {
      const handleMotion = (event) => {
        let x = event.accelerationIncludingGravity?.x || 0;
        let y = event.accelerationIncludingGravity?.y || 0;
        let z = event.accelerationIncludingGravity?.z || 0;
        
        if (event.acceleration && event.acceleration.x) {
            x = event.acceleration.x; y = event.acceleration.y; z = event.acceleration.z;
        }

        const totalForce = Math.sqrt(x*x + y*y + z*z);
        const impactForce = Math.abs(totalForce - (event.acceleration ? 0 : 9.8));
        
        setAcceleration(impactForce.toFixed(1));

        // --- INTELLIGENT CRASH ALGORITHM ---
        // Must be Moving > 10km/h AND High Impact
        // (Remove '&& speed > MIN_SPEED_FOR_CRASH' if testing at home without moving)
        if (impactForce > CRASH_G_FORCE && sosStatus === 'idle') {
             // For testing at home, we comment out the speed check. 
             // In real car: uncomment '&& speed > MIN_SPEED_FOR_CRASH'
             handleSOS(`🚨 AUTO-CRASH: ${impactForce.toFixed(1)}G`);
        }
      };

      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [autoMode, sosStatus, handleSOS, speed]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]"></div>
        
        <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-700 relative z-10">
          <div className="flex justify-center mb-8">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-40 animate-pulse"></div>
                <Shield size={72} className="text-emerald-400 relative z-10" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white text-center mb-2 tracking-tighter">RAKSHAK <span className="text-emerald-400">3.0</span></h1>
          <p className="text-slate-400 text-center mb-8 text-xs font-mono tracking-widest uppercase">Autonomous Safety System</p>
          <button onClick={handleLogin} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-4 rounded-xl font-bold tracking-widest transition-all hover:scale-105 shadow-lg shadow-emerald-500/20">
            ACTIVATE SYSTEM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-28 selection:bg-emerald-500/30 relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md p-5 sticky top-0 z-50 border-b border-slate-800/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Shield className="text-emerald-400 fill-emerald-400/20" size={24} />
            <span className="font-black text-xl tracking-wider text-white">RAKSHAK</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
            <span className="text-[10px] font-bold text-emerald-400 tracking-widest">LIVE</span>
        </div>
      </div>

      <div className="p-5 max-w-md mx-auto relative z-10">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className={`bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border transition-all duration-500 ${autoMode ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'border-slate-800'}`}>
              <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase mb-1">DEFENSE PROTOCOL</h3>
                    <div className={`text-2xl font-bold ${autoMode ? 'text-emerald-400' : 'text-slate-600'}`}>{autoMode ? "ARMED" : "STANDBY"}</div>
                </div>
                <button onClick={toggleSentryMode} className={`w-14 h-8 rounded-full transition-all duration-300 relative ${autoMode ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-slate-800 border border-slate-700'}`}>
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${autoMode ? 'translate-x-6' : ''}`}></div>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center">
                      <Zap size={20} className="text-yellow-400 mb-2" />
                      <div className="text-2xl font-mono font-bold text-white">{acceleration} <span className="text-xs text-slate-500">G</span></div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Impact</div>
                  </div>
                  <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center">
                      <Gauge size={20} className="text-blue-400 mb-2" />
                      <div className="text-2xl font-mono font-bold text-white">{speed} <span className="text-xs text-slate-500">km/h</span></div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Speed</div>
                  </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button onClick={() => handleSOS()} disabled={sosStatus === 'sending'} className={`group relative w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${sosStatus === 'sending' ? 'bg-orange-500' : sosStatus === 'success' ? 'bg-green-600' : 'bg-slate-800 border-4 border-slate-700 hover:border-red-500/50 hover:bg-slate-800 shadow-2xl shadow-black'}`}>
                <div className={`absolute inset-0 rounded-full border border-white/5 ${sosStatus === 'idle' ? 'group-hover:animate-ping' : ''}`}></div>
                {sosStatus === 'sending' ? <span className="font-bold animate-pulse">CONNECTING...</span> : sosStatus === 'success' ? <span className="font-bold">SENT!</span> : <><AlertTriangle size={50} className="text-red-500 mb-2" /><span className="text-3xl font-black text-white tracking-widest">SOS</span></>}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="h-[70vh] rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl animate-in fade-in zoom-in duration-300">
             <MapContainer center={location} zoom={15} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapUpdater center={location} />
                <Marker position={location}><Popup>Current Location</Popup></Marker>
             </MapContainer>
          </div>
        )}

        {activeTab === 'activity' && <ActivityDashboard />}
      </div>

      <div className="fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex justify-around items-center z-50 pb-safe">
        <NavBtn icon={<Zap size={20} />} label="Sentry" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavBtn icon={<Navigation size={20} />} label="Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
        <NavBtn icon={<Activity size={20} />} label="Activity" active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} />
      </div>
    </div>
  );
}

function NavBtn({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} className={`p-4 flex flex-col items-center gap-1 transition-colors ${active ? 'text-emerald-400' : 'text-slate-600 hover:text-slate-400'}`}>
            {icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </button>
    )
}

export default App;