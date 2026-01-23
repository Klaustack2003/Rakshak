import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, Shield, Navigation, Database, BarChart3, MapPin } from 'lucide-react';

const API_URL = "https://rakshak-api-sovy.onrender.com";
const IMPACT_THRESHOLD = 20; 
const ALARM_URL = "https://cdn.freesound.org/previews/253/253888_3889600-lq.mp3";

function MapUpdater({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

function AdminDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/view_history`)
      .then(res => { setHistory(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="text-blue-500" />
          <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs">Incident Traffic</h3>
        </div>
        <div className="flex items-end justify-between h-32 gap-2">
          {history.slice(0, 7).map((log, i) => (
             <div key={i} className="w-full bg-slate-800 rounded-t-lg relative group">
                <div className="absolute bottom-0 w-full bg-blue-600/80 rounded-t-lg transition-all hover:bg-blue-500" style={{ height: `${Math.min(100, 20 + (log.id % 10) * 8)}%` }}></div>
             </div>
          ))}
          {history.length === 0 && <div className="text-slate-600 text-xs w-full text-center">No Data Yet</div>}
        </div>
      </div>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <Database className="text-purple-500" size={18} />
          <h3 className="font-bold text-slate-300 text-xs uppercase tracking-widest">Crash Database</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-500">
              <tr><th className="p-3">ID</th><th className="p-3">Location</th><th className="p-3">Time</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? <tr><td colSpan="3" className="p-4 text-center">Loading...</td></tr> : history.map((log) => (
                <tr key={log.id}>
                  <td className="p-3 font-mono text-xs text-slate-500">#{log.id}</td>
                  <td className="p-3 flex items-center gap-1"><MapPin size={12} className="text-red-500" />{log.location}</td>
                  <td className="p-3 text-xs">{log.timestamp?.split(' ')[1] || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [sosStatus, setSosStatus] = useState('idle');
  const [acceleration, setAcceleration] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  const [location, setLocation] = useState([20.5937, 78.9629]); 
  
  // FIX: Use useRef for Audio (Mutable object), not useState
  const audioRef = useRef(new Audio(ALARM_URL));
  
  const [debugInfo, setDebugInfo] = useState({ x:0, y:0, z:0, status: "Waiting" });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  const handleLogin = () => {
    // Prime the audio on user interaction
    audioRef.current.play().then(() => {
        audioRef.current.pause(); 
        audioRef.current.currentTime = 0;
    }).catch(e => console.log("Audio permission pending...", e));
    setIsLoggedIn(true);
  };

  // FIX: Wrap in useCallback to satisfy linter
  const playAlarm = useCallback(() => {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => alert("Please tap screen to enable audio!"));
  }, []);

  const handleSOS = useCallback(async (msg = "Manual SOS") => {
    setSosStatus('sending');
    playAlarm(); 

    const send = async (loc) => {
        try {
            await axios.post(`${API_URL}/crash_alert`, { user_id: 101, location: loc, message: msg });
            setSosStatus('success');
            setTimeout(() => setSosStatus('idle'), 5000);
        } catch { setSosStatus('idle'); alert("Failed to send alert"); }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
          (p) => { 
              const loc = `${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`;
              setLocation([p.coords.latitude, p.coords.longitude]);
              send(loc);
          },
          () => send("GPS Unavailable")
      );
    } else { send("GPS Not Supported"); }
  }, [playAlarm]); // Added dependency

  const toggleSentryMode = () => {
    if (!autoMode) {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then(response => {
            if (response === 'granted') setAutoMode(true);
            else alert("Permission Denied! Allow sensors in settings.");
          })
          .catch(console.error);
      } else {
        setAutoMode(true);
      }
    } else {
      setAutoMode(false);
    }
  };

  useEffect(() => {
    if (autoMode) {
      const handleMotion = (event) => {
        let x = event.accelerationIncludingGravity?.x;
        let y = event.accelerationIncludingGravity?.y;
        let z = event.accelerationIncludingGravity?.z;
        let src = "Gravity";

        if (x === null || x === undefined) {
            x = event.acceleration?.x;
            y = event.acceleration?.y;
            z = event.acceleration?.z;
            src = "Accel";
        }

        if (x === null || x === undefined) {
            setDebugInfo({ x:0, y:0, z:0, status: "BLOCKED/NULL" });
            return;
        }

        setDebugInfo({ x: x.toFixed(1), y: y.toFixed(1), z: z.toFixed(1), status: src });

        const totalForce = Math.sqrt(x*x + y*y + z*z);
        const impactForce = src === "Gravity" ? Math.abs(totalForce - 9.8) : totalForce;
        
        setAcceleration(impactForce.toFixed(1));

        if (impactForce > IMPACT_THRESHOLD && sosStatus === 'idle') {
          handleSOS("🚨 Automated Crash Detected");
        }
      };

      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [autoMode, sosStatus, handleSOS]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-800">
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20 rounded-full"></div>
            <Shield size={64} className="text-red-500 relative z-10" />
          </div>
          <h1 className="text-4xl font-black text-white text-center mb-2 tracking-tighter">RAKSHAK <span className="text-red-500">2.0</span></h1>
          <p className="text-slate-500 text-center mb-8 text-sm font-medium tracking-wide">AI-POWERED ACCIDENT RESPONSE</p>
          <button onClick={handleLogin} className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl font-bold tracking-wide">INITIATE SYSTEM</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-24 selection:bg-red-500/30">
      <div className="bg-slate-900/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2"><Shield className="text-red-500" /><span className="font-bold text-xl tracking-wider">RAKSHAK</span></div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-xs font-bold text-slate-400">ONLINE</span></div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className={`bg-slate-900 p-6 rounded-2xl border transition-all duration-300 ${autoMode ? 'border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'border-slate-800'}`}>
              <div className="flex justify-between items-center mb-6">
                <div><h3 className="text-slate-400 text-[10px] font-black tracking-widest uppercase">IMPACT SENSOR</h3><div className={`text-xl font-bold mt-1 ${autoMode ? 'text-green-400' : 'text-slate-500'}`}>{autoMode ? "ACTIVE" : "OFFLINE"}</div></div>
                <button onClick={toggleSentryMode} className={`w-12 h-6 rounded-full transition-colors relative ${autoMode ? 'bg-green-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${autoMode ? 'translate-x-6' : ''}`}></div>
                </button>
              </div>
              
              <div className="h-24 bg-slate-950 rounded-lg flex items-end justify-center gap-1 p-2 border border-slate-800 relative overflow-hidden">
                <div className="absolute top-1/2 w-full h-[1px] bg-red-500/20 border-t border-dashed border-red-500/50"></div>
                {[...Array(20)].map((_, i) => (
                  <div key={i} className={`flex-1 rounded-t-sm transition-all duration-100 ${acceleration > 5 ? 'bg-red-500' : 'bg-slate-600'}`} style={{ height: `${Math.min(100, (acceleration * 5) + ((i % 5) * 5))}%`, opacity: autoMode ? 1 : 0.2 }}></div>
                ))}
              </div>
              <div className="mt-3 text-xs font-mono text-slate-500 space-y-1">
                <div className="flex justify-between"><span>IMPACT: {acceleration} G</span><span>LIMIT: {IMPACT_THRESHOLD} G</span></div>
                <div className={`text-[10px] text-center font-bold p-1 rounded ${debugInfo.status.includes("BLOCKED") ? 'bg-red-500/20 text-red-400' : 'text-slate-600'}`}>
                  STATUS: {debugInfo.status} <br/> X:{debugInfo.x} Y:{debugInfo.y} Z:{debugInfo.z}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button onClick={() => handleSOS()} disabled={sosStatus === 'sending'} className={`group relative w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${sosStatus === 'sending' ? 'bg-orange-500' : sosStatus === 'success' ? 'bg-green-600' : 'bg-slate-800 border-4 border-slate-700 hover:border-red-500/50 hover:bg-slate-800'}`}>
                <div className={`absolute inset-0 rounded-full border border-white/5 ${sosStatus === 'idle' ? 'group-hover:animate-ping' : ''}`}></div>
                {sosStatus === 'sending' ? <span className="font-bold animate-pulse">CONNECTING...</span> : sosStatus === 'success' ? <span className="font-bold">SENT!</span> : <><AlertTriangle size={50} className="text-red-500 mb-2" /><span className="text-3xl font-black text-white tracking-widest">SOS</span></>}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="h-[75vh] rounded-2xl overflow-hidden border border-slate-700 relative shadow-2xl animate-in fade-in zoom-in duration-300">
             <MapContainer center={location} zoom={15} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapUpdater center={location} />
                <Marker position={location}><Popup>Incident Location</Popup></Marker>
             </MapContainer>
          </div>
        )}

        {activeTab === 'admin' && <AdminDashboard />}
      </div>

      <div className="fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex justify-around items-center z-50 pb-safe">
        <NavBtn icon={<Shield size={20} />} label="Sentry" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavBtn icon={<Navigation size={20} />} label="Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
        <NavBtn icon={<Database size={20} />} label="Admin" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
      </div>
    </div>
  );
}

function NavBtn({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} className={`p-4 flex flex-col items-center gap-1 transition-colors ${active ? 'text-red-500' : 'text-slate-600 hover:text-slate-400'}`}>
            {icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </button>
    )
}

export default App;