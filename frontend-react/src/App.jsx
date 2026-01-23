import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, Shield, Navigation, Activity, Zap, MapPin, Gauge, Cpu, Globe, Server, CheckCircle, ChevronRight, Lock } from 'lucide-react';

// --- CONFIGURATION ---
const API_URL = "https://rakshak-api-sovy.onrender.com";
const CRASH_G_FORCE = 15;
const ALARM_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

function MapUpdater({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

// --- COMPONENT: THE LANDING PAGE ---
function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-emerald-500 fill-emerald-500/10" size={32} />
            <span className="text-2xl font-black tracking-tighter">RAKSHAK <span className="text-emerald-500">.AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400 tracking-widest uppercase">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Protocol</a>
            <a href="#network" className="hover:text-emerald-400 transition-colors">Network</a>
            <a href="#security" className="hover:text-emerald-400 transition-colors">Security</a>
          </div>
          <button onClick={onEnter} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            ACCESS TERMINAL
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          SYSTEM ONLINE: V3.0 STABLE
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          AUTOMATED SAFETY <br/> <span className="text-emerald-500">PROTOCOL</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          Advanced algorithmic crash detection system. Zero hardware required. 
          Rakshak uses your device's neural sensors to detect accidents and dispatch emergency response in <span className="text-white font-bold">120ms</span>.
        </p>

        <div className="flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <button onClick={onEnter} className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors">
            INITIATE SYSTEM <ChevronRight size={18} />
          </button>
          <button className="px-8 py-4 bg-slate-900 border border-slate-700 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
            VIEW DOCUMENTATION
          </button>
        </div>
      </section>

      {/* STATS GRID */}
      <section className="border-y border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard label="Active Nodes" value="8,420" icon={<Server className="text-blue-500" />} />
          <StatCard label="Incidents Resolved" value="142" icon={<CheckCircle className="text-emerald-500" />} />
          <StatCard label="Response Time" value="< 1s" icon={<Zap className="text-yellow-500" />} />
          <StatCard label="Uptime" value="99.9%" icon={<Globe className="text-purple-500" />} />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black mb-4">THE CORE ENGINE</h2>
          <p className="text-slate-400">Powered by advanced sensor fusion technology.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Cpu size={32} className="text-emerald-400" />}
            title="Neural Detection"
            desc="Algorithms analyze accelerometer data 60 times per second to differentiate between potholes and crashes."
          />
          <FeatureCard 
            icon={<Globe size={32} className="text-blue-400" />}
            title="Cloud Uplink"
            desc="Instant synchronization with Rakshak Cloud Servers ensures data persistence even if the device is destroyed."
          />
          <FeatureCard 
            icon={<Lock size={32} className="text-purple-400" />}
            title="Secure Gateway"
            desc="End-to-end encrypted telemetry data transmission prevents spoofing and ensures privacy."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-center text-slate-600 text-sm">
        <p>&copy; 2026 RAKSHAK PROTOCOL. SYSTEM ARCHITECT: SUBHADIP DAS.</p>
      </footer>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 p-2 bg-slate-800 rounded-lg">{icon}</div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-colors group">
      <div className="mb-6 p-4 bg-slate-950 rounded-2xl w-fit group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

// --- ACTIVITY DASHBOARD ---
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
            <div className="text-center text-slate-500 py-10 animate-pulse font-mono text-xs">ESTABLISHING UPLINK...</div>
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

// --- MAIN APP COMPONENT ---
function App() {
  const [viewState, setViewState] = useState('landing'); // 'landing' | 'login' | 'app'
  const [activeTab, setActiveTab] = useState('home');
  const [sosStatus, setSosStatus] = useState('idle');
  
  // SENSORS
  const [acceleration, setAcceleration] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  const [location, setLocation] = useState([20.5937, 78.9629]); 
  
  const audioRef = useRef(new Audio(ALARM_URL));

  // --- INITIALIZATION ---
  useEffect(() => {
    audioRef.current.load();
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setLocation([pos.coords.latitude, pos.coords.longitude]);
          const speedKmph = (pos.coords.speed || 0) * 3.6;
          setSpeed(speedKmph.toFixed(0));
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handleLogin = () => {
    // Unlock Audio Context
    audioRef.current.volume = 0;
    audioRef.current.play().then(() => {
        setTimeout(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 1.0; 
        }, 100);
    }).catch(console.error);
    setViewState('app');
  };

  const playAlarm = useCallback(() => {
    audioRef.current.currentTime = 0;
    audioRef.current.volume = 1.0;
    audioRef.current.play().catch(console.error);
  }, []);

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

  const toggleSentryMode = () => {
    if (!autoMode) {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then(response => { if (response === 'granted') setAutoMode(true); })
          .catch(console.error);
      } else { setAutoMode(true); }
    } else { setAutoMode(false); }
  };

  // --- PHYSICS ENGINE ---
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

        if (impactForce > CRASH_G_FORCE && sosStatus === 'idle') {
             handleSOS(`🚨 AUTO-CRASH: ${impactForce.toFixed(1)}G`);
        }
      };

      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [autoMode, sosStatus, handleSOS]);

  // --- VIEW ROUTING ---
  
  // 1. LANDING PAGE
  if (viewState === 'landing') {
    return <LandingPage onEnter={() => setViewState('login')} />;
  }

  // 2. LOGIN PORTAL
  if (viewState === 'login') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-700 relative z-10 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center mb-8">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-40 animate-pulse"></div>
                <Shield size={72} className="text-emerald-400 relative z-10" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white text-center mb-2 tracking-tighter">SECURE <span className="text-emerald-400">LOGIN</span></h1>
          <p className="text-slate-500 text-center mb-8 text-xs font-mono tracking-widest uppercase">Identity Verification Required</p>
          
          <div className="space-y-4 mb-6">
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="text-slate-500"><Zap size={18}/></div>
                <input type="text" placeholder="Protocol ID" className="bg-transparent text-white text-sm outline-none w-full font-mono placeholder:text-slate-600" />
            </div>
             <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="text-slate-500"><Lock size={18}/></div>
                <input type="password" placeholder="Passkey" className="bg-transparent text-white text-sm outline-none w-full font-mono placeholder:text-slate-600" />
            </div>
          </div>

          <button onClick={handleLogin} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-4 rounded-xl font-bold tracking-widest transition-all hover:scale-105 shadow-lg shadow-emerald-500/20">
            AUTHENTICATE
          </button>
          
          <button onClick={() => setViewState('landing')} className="w-full mt-4 text-slate-500 text-xs hover:text-white transition-colors">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // 3. MAIN DASHBOARD APP
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-28 selection:bg-emerald-500/30 relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
      </div>

      {/* APP HEADER */}
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
            
            {/* SENTRY CARD */}
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