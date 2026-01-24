import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { 
  getAuth, signInWithPopup, GoogleAuthProvider, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  sendEmailVerification, signOut, onAuthStateChanged 
} from "firebase/auth";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Shield, Zap, Cpu, Globe, ChevronRight, MessageSquare, 
  X, Send, LogOut, Key, Loader2, Mail, User, AlertTriangle, Activity, Lock 
} from 'lucide-react';

// --- 🔥 FIREBASE KEYS (PASTE YOURS HERE) ---
const firebaseConfig = {
  apiKey: "AIzaSyAuozu4A_9OtGusVCO_pyDt8o8mKl0h3ig",
  authDomain: "rakshak-89deb.firebaseapp.com",
  projectId: "rakshak-89deb",
  storageBucket: "rakshak-89deb.firebasestorage.app",
  messagingSenderId: "101062187555",
  appId: "1:101062187555:web:5d4b6aaa1f420c4e366f96"
};

// --- SAFE INITIALIZATION ---
let app, auth, googleProvider;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
} catch (e) {
    console.error("Firebase Init Error:", e);
}

// --- CONFIG ---
const API_URL = "https://rakshak-api-sovy.onrender.com";
const CRASH_G_FORCE = 15;
const ALARM_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

function MapUpdater({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

// --- SMART AI BOT ---
const botKnowledge = {
  default: "I didn't quite catch that. Try asking about 'Crash Detection', 'Pricing', or say 'Hi'."
};

function RakshakBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: '🟢 System Online. Ask me anything.' }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = botKnowledge.default;
      const lower = userText.toLowerCase();
      if (lower.match(/hi|hello/)) reply = "Greetings. Rakshak Systems operational.";
      else if (lower.match(/admin/)) reply = "Admin access requires Commander clearance.";
      else if (lower.match(/help/)) reply = "Connecting to support grid...";
      
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="group relative flex items-center justify-center w-16 h-16 bg-cyan-500 hover:bg-cyan-400 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all hover:scale-110">
          <MessageSquare size={32} className="text-slate-900" />
        </button>
      )}
      {isOpen && (
        <div className="w-[300px] h-[400px] bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex justify-between items-center">
            <span className="font-bold text-white text-sm">Rakshak AI</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded-lg text-xs ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'}`}>{msg.text}</div>
              </div>
            ))}
            {isTyping && <div className="text-xs text-slate-500 animate-pulse">Computing...</div>}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-slate-900/50 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Query..." className="flex-1 bg-slate-950 text-white text-xs px-3 py-2 rounded-lg border border-slate-800 focus:border-cyan-500 outline-none" />
            <button type="submit" className="text-cyan-500"><Send size={16} /></button>
          </form>
        </div>
      )}
    </div>
  );
}

// --- LANDING PAGE ---
function LandingPage({ onLoginClick }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <nav className="fixed w-full z-50 py-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2"><Shield size={24} className="text-cyan-400" /><span className="text-xl font-black tracking-tighter">RAKSHAK</span></div>
          <button onClick={onLoginClick} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full font-bold text-xs border border-slate-700 hover:border-cyan-500/50 transition-all">ACCESS TERMINAL</button>
        </div>
      </nav>
      <section className="relative pt-48 pb-32 px-6 flex flex-col items-center text-center">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-slate-600 bg-clip-text text-transparent">AUTONOMOUS <br/> <span className="text-cyan-400">SAFETY</span></h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">Next-Gen Accident Detection & Response Protocol.</p>
        <button onClick={onLoginClick} className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_40px_rgba(6,182,212,0.3)]">INITIATE SYSTEM <ChevronRight size={18} /></button>
      </section>
    </div>
  );
}

// --- AUTH PORTAL ---
function AuthPortal({ onAuthSuccess, onBack }) {
  const [role, setRole] = useState('user'); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminKey, setAdminKey] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError(""); setMessage("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setMessage("Verification Link Sent! Check Email.");
      setIsRegistering(false); await signOut(auth); 
    } catch (err) { setError(err.message.replace("Firebase:", "").trim()); } 
    finally { setIsLoading(false); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) throw new Error("Email not verified.");
      onAuthSuccess("user", userCredential.user);
    } catch (err) { setError(err.message.replace("Firebase:", "").trim()); } 
    finally { setIsLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onAuthSuccess("user", result.user);
    } catch (err) { setError(err.message); } finally { setIsLoading(false); }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        if (email === "commander" && adminKey === "rakshak-alpha") {
            onAuthSuccess("admin", { email: "COMMANDER", uid: "ADM-001" });
        } else {
            setError("Access Denied.");
            setIsLoading(false);
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className={`absolute top-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 ${role === 'admin' ? 'bg-red-600/20' : 'bg-cyan-500/10'}`}></div>
      <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-700 relative z-10">
        <button onClick={onBack} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={20}/></button>
        <div className="flex bg-slate-950 p-1 rounded-xl mb-8 border border-slate-800">
            <button onClick={() => { setRole('user'); setError(''); }} className={`flex-1 py-2 text-xs font-bold rounded-lg ${role === 'user' ? 'bg-cyan-500 text-slate-900' : 'text-slate-500'}`}>USER</button>
            <button onClick={() => { setRole('admin'); setError(''); }} className={`flex-1 py-2 text-xs font-bold rounded-lg ${role === 'admin' ? 'bg-red-600 text-white' : 'text-slate-500'}`}>COMMANDER</button>
        </div>
        <h2 className="text-2xl font-bold text-center mb-1 text-white">{role === 'user' ? 'Welcome Back' : 'RESTRICTED'}</h2>
        
        {error && <div className="mt-4 p-3 bg-red-500/20 text-red-200 text-xs rounded-lg flex gap-2"><AlertTriangle size={14}/> {error}</div>}
        {message && <div className="mt-4 p-3 bg-emerald-500/20 text-emerald-200 text-xs rounded-lg flex gap-2"><Activity size={14}/> {message}</div>}

        {role === 'user' ? (
            <div className="mt-6 space-y-4">
                <button onClick={handleGoogleLogin} className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-xl flex justify-center items-center gap-3 text-sm">Continue with Google</button>
                <div className="flex items-center gap-4"><div className="h-[1px] bg-slate-800 flex-1"></div><span className="text-[10px] text-slate-500">OR</span><div className="h-[1px] bg-slate-800 flex-1"></div></div>
                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                    <div className="relative"><Mail className="absolute left-4 top-3.5 text-slate-500" size={18} /><input type="email" placeholder="Email" required className="w-full bg-slate-950 text-white pl-12 pr-4 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                    <div className="relative"><Key className="absolute left-4 top-3.5 text-slate-500" size={18} /><input type="password" placeholder="Password" required className="w-full bg-slate-950 text-white pl-12 pr-4 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                    <button type="submit" disabled={isLoading} className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2">{isLoading ? <Loader2 className="animate-spin" /> : (isRegistering ? 'Register' : 'Login')}</button>
                </form>
                <p className="text-center text-xs text-slate-400">{isRegistering ? "Has ID?" : "No ID?"} <button onClick={() => setIsRegistering(!isRegistering)} className="text-cyan-400 font-bold hover:underline">{isRegistering ? "Login" : "Register"}</button></p>
            </div>
        ) : (
            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
                <div className="relative"><User className="absolute left-4 top-3.5 text-red-500" size={18} /><input type="text" placeholder="Commander ID" required className="w-full bg-slate-950 text-red-500 pl-12 pr-4 py-3 rounded-xl border border-red-900/50 focus:border-red-500 outline-none font-mono" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div className="relative"><Lock className="absolute left-4 top-3.5 text-red-500" size={18} /><input type="password" placeholder="Access Key" required className="w-full bg-slate-950 text-red-500 pl-12 pr-4 py-3 rounded-xl border border-red-900/50 focus:border-red-500 outline-none font-mono tracking-widest" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} /></div>
                <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2">{isLoading ? <Loader2 className="animate-spin" /> : "ESTABLISH UPLINK"}</button>
            </form>
        )}
      </div>
    </div>
  );
}

// --- ADMIN DASHBOARD ---
function AdminDashboard({ onLogout, user }) {
  const [history, setHistory] = useState([]);
  useEffect(() => { axios.get(`${API_URL}/view_history`).then(res => setHistory(res.data)).catch(console.error); }, []);
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans overflow-y-auto border-t-4 border-red-600">
       <div className="max-w-7xl mx-auto">
         <header className="flex justify-between items-center mb-10 bg-red-950/20 p-6 rounded-2xl border border-red-900/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
                <div className="bg-red-600 text-white p-3 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.5)]"><Lock size={24}/></div>
                <div>
                    <h1 className="font-black text-2xl leading-none text-red-500 tracking-tighter">COMMAND CENTER</h1>
                    <span className="text-xs text-red-400/60 uppercase tracking-[0.3em]">CMDR: {user?.email || "Unknown"}</span>
                </div>
            </div>
            <button onClick={onLogout} className="bg-slate-900 text-slate-400 hover:text-white px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-800"><LogOut size={16} /> ABORT</button>
         </header>
         <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 bg-slate-950"><h3 className="font-bold text-slate-300">Encrypted Incident Logs</h3></div>
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-900 text-xs uppercase font-bold text-slate-500"><tr><th className="p-4">ID</th><th className="p-4">Location</th><th className="p-4">Time</th></tr></thead>
              <tbody className="divide-y divide-slate-800">{history.map((log) => (<tr key={log.id} className="hover:bg-slate-800/50"><td className="p-4 font-mono text-emerald-500">ID-{log.id}</td><td className="p-4">{log.location}</td><td className="p-4 font-mono text-xs">{log.timestamp}</td></tr>))}</tbody>
            </table>
         </div>
       </div>
    </div>
  );
}

function StatBox({ label, value, icon }) { return (<div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center gap-4 hover:border-emerald-500/30 transition-colors"><div className="p-3 bg-slate-950 rounded-xl">{icon}</div><div><div className="text-2xl font-black text-white">{value}</div><div className="text-xs font-bold text-slate-500 uppercase">{label}</div></div></div>); }

function UserApp({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState('home');
  const [sosStatus, setSosStatus] = useState('idle');
  const [acceleration, setAcceleration] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  const [location, setLocation] = useState([20.5937, 78.9629]); 
  const audioRef = useRef(new Audio(ALARM_URL));
  useEffect(() => { audioRef.current.load(); if ("geolocation" in navigator) { const watchId = navigator.geolocation.watchPosition((pos) => { setLocation([pos.coords.latitude, pos.coords.longitude]); setSpeed(((pos.coords.speed || 0) * 3.6).toFixed(0)); }, null, { enableHighAccuracy: true }); return () => navigator.geolocation.clearWatch(watchId); } }, []);
  const playAlarm = useCallback(() => { audioRef.current.currentTime = 0; audioRef.current.volume = 1.0; audioRef.current.play().catch(console.error); }, []);
  const handleSOS = useCallback(async (msg = "Manual SOS") => { setSosStatus('sending'); playAlarm(); try { await axios.post(`${API_URL}/crash_alert`, { user_id: 101, location: `${location[0]},${location[1]}`, message: msg }); setSosStatus('success'); setTimeout(() => setSosStatus('idle'), 5000); } catch { setSosStatus('idle'); alert("Offline Mode"); } }, [playAlarm, location]);
  useEffect(() => { if (autoMode) { const handleMotion = (event) => { let x = event.acceleration?.x || 0; let y = event.acceleration?.y || 0; let z = event.acceleration?.z || 0; const totalForce = Math.sqrt(x*x + y*y + z*z); const impactForce = Math.abs(totalForce - 9.8); setAcceleration(impactForce.toFixed(1)); if (impactForce > CRASH_G_FORCE && sosStatus === 'idle') handleSOS(`🚨 AUTO-CRASH: ${impactForce.toFixed(1)}G`); }; window.addEventListener('devicemotion', handleMotion); return () => window.removeEventListener('devicemotion', handleMotion); } }, [autoMode, sosStatus, handleSOS]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-28 selection:bg-cyan-500/30 overflow-hidden">
      <div className="bg-slate-900/60 backdrop-blur-md p-5 sticky top-0 z-50 border-b border-slate-800/50 flex justify-between items-center"><div className="flex items-center gap-2"><Shield className="text-cyan-400" size={24} /><span className="font-black text-xl tracking-wider text-white">RAKSHAK</span></div><div className="flex items-center gap-2">{user?.photoURL && <img src={user.photoURL} className="w-6 h-6 rounded-full border border-slate-600" alt="User" />}<button onClick={onLogout} className="text-slate-500 hover:text-white"><LogOut size={20}/></button></div></div>
      <div className="p-5 max-w-md mx-auto relative z-10">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border transition-all duration-500 ${autoMode ? 'border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.1)]' : 'border-slate-800'}`}>
              <div className="flex justify-between items-center mb-8"><div><h3 className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase mb-1">DEFENSE PROTOCOL</h3><div className={`text-2xl font-bold ${autoMode ? 'text-cyan-400' : 'text-slate-600'}`}>{autoMode ? "ARMED" : "STANDBY"}</div></div><button onClick={() => setAutoMode(!autoMode)} className={`w-14 h-8 rounded-full transition-all duration-300 relative ${autoMode ? 'bg-cyan-500 shadow-[0_0_15px_#22d3ee]' : 'bg-slate-800 border border-slate-700'}`}><div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${autoMode ? 'translate-x-6' : ''}`}></div></button></div>
              <div className="grid grid-cols-2 gap-4"><div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center"><Zap size={20} className="text-yellow-400 mb-2" /><div className="text-2xl font-mono font-bold text-white">{acceleration} <span className="text-xs text-slate-500">G</span></div></div><div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center"><Gauge size={20} className="text-blue-400 mb-2" /><div className="text-2xl font-mono font-bold text-white">{speed} <span className="text-xs text-slate-500">km/h</span></div></div></div>
            </div>
            <div className="flex justify-center"><button onClick={() => handleSOS()} disabled={sosStatus === 'sending'} className={`group relative w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${sosStatus === 'sending' ? 'bg-orange-500' : sosStatus === 'success' ? 'bg-green-600' : 'bg-slate-800 border-4 border-slate-700 hover:border-red-500/50 hover:bg-slate-800 shadow-2xl shadow-black'}`}><div className={`absolute inset-0 rounded-full border border-white/5 ${sosStatus === 'idle' ? 'group-hover:animate-ping' : ''}`}></div>{sosStatus === 'sending' ? <span className="font-bold animate-pulse">CONNECTING...</span> : sosStatus === 'success' ? <span className="font-bold">SENT!</span> : <><AlertTriangle size={50} className="text-red-500 mb-2" /><span className="text-3xl font-black text-white tracking-widest">SOS</span></>}</button></div>
          </div>
        )}
        {activeTab === 'map' && (<div className="h-[70vh] rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl animate-in fade-in zoom-in duration-300"><MapContainer center={location} zoom={15} style={{ height: "100%", width: "100%" }}><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapUpdater center={location} /><Marker position={location}><Popup>Current Location</Popup></Marker></MapContainer></div>)}
      </div>
      <div className="fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex justify-around items-center z-50 pb-safe">
        <button onClick={() => setActiveTab('home')} className={`p-4 flex flex-col items-center gap-1 transition-colors ${activeTab==='home' ? 'text-cyan-400' : 'text-slate-600'}`}><Zap size={20}/><span className="text-[10px] font-bold uppercase">Sentry</span></button>
        <button onClick={() => setActiveTab('map')} className={`p-4 flex flex-col items-center gap-1 transition-colors ${activeTab==='map' ? 'text-cyan-400' : 'text-slate-600'}`}><Navigation size={20}/><span className="text-[10px] font-bold uppercase">Map</span></button>
      </div>
      <RakshakBot />
    </div>
  );
}

// --- MAIN APP ---
function App() {
  const [view, setView] = useState('landing'); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser && view !== 'admin') { 
            if (currentUser.emailVerified) { setUser(currentUser); setView('user'); }
        }
    });
    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (role, userData) => { setUser(userData); setView(role); };
  const handleLogout = async () => { if(auth) await signOut(auth); setUser(null); setView('landing'); };

  if (firebaseConfig.apiKey === "YOUR_API_KEY") {
      return <div className="min-h-screen bg-black text-red-500 flex items-center justify-center p-10 text-center font-mono">⚠️ SYSTEM HALTED: Missing Firebase Keys. Open src/App.jsx and paste your credentials.</div>;
  }

  return (
    <>
      {view === 'landing' && <LandingPage onLoginClick={() => setView('auth')} />}
      {view === 'auth' && <AuthPortal onAuthSuccess={handleAuthSuccess} onBack={() => setView('landing')} />}
      {view === 'admin' && <AdminDashboard onLogout={handleLogout} user={user} />}
      {view === 'user' && <UserApp onLogout={handleLogout} user={user} />}
    </>
  );
}

export default App;