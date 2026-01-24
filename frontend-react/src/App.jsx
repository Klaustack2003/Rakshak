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
  X, Send, LogOut, Key, Loader2, Mail, User, AlertTriangle, Activity 
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// --- CONFIG ---
const API_URL = "https://rakshak-api-sovy.onrender.com";
const CRASH_G_FORCE = 15;
const ALARM_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

function MapUpdater({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

// --- SMART AI BOT ENGINE ---
const botKnowledge = {
  greetings: ["Hello! Rakshak Systems online.", "Greetings. How can I assist with your safety?", "Hi there! I am ready to help."],
  product: "Rakshak uses your phone's accelerometer and GPS to detect crashes instantly. No hardware needed.",
  pricing: "Rakshak Core is free for everyone. Enterprise features are available for fleet managers.",
  support: "I am connecting you to a human agent... (Simulation: Ticket #992 Created).",
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

    // AI BRAIN SIMULATION
    setTimeout(() => {
      let reply = botKnowledge.default;
      const lower = userText.toLowerCase();

      if (lower.match(/hi|hello|hey|yo/)) reply = botKnowledge.greetings[Math.floor(Math.random() * botKnowledge.greetings.length)];
      else if (lower.match(/work|how|what/)) reply = botKnowledge.product;
      else if (lower.match(/free|cost|price/)) reply = botKnowledge.pricing;
      else if (lower.match(/help|support|issue|problem/)) reply = botKnowledge.support;
      else if (lower.match(/thank/)) reply = "You are welcome. Stay safe.";

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="group relative flex items-center justify-center w-16 h-16 bg-cyan-500 hover:bg-cyan-400 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all hover:scale-110">
          <MessageSquare size={32} className="text-slate-900" />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce"></span>
        </button>
      )}
      
      {isOpen && (
        <div className="w-[350px] h-[500px] bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Cpu size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Rakshak AI</h3>
                <span className="text-[10px] text-cyan-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span> Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-sm' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-bl-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-700 bg-slate-900/50 flex gap-2">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Type your query..." 
              className="flex-1 bg-slate-950 text-white text-xs px-4 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none transition-all"
            />
            <button type="submit" className="p-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl transition-all"><Send size={18} /></button>
          </form>
        </div>
      )}
    </div>
  );
}

// --- LANDING PAGE (TECHY UPGRADE) ---
function LandingPage({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 py-3' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg group-hover:shadow-cyan-500/50 transition-all">
              <Shield size={24} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter">RAKSHAK <span className="text-cyan-400">.IO</span></span>
          </div>
          <button onClick={onLoginClick} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full font-bold text-xs border border-slate-700 hover:border-cyan-500/50 transition-all">
            ACCESS TERMINAL
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-48 pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
          SYSTEM STATUS: OPERATIONAL
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white via-slate-200 to-slate-600 bg-clip-text text-transparent max-w-5xl mx-auto leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
          AUTONOMOUS <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">SAFETY PROTOCOL</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          Advanced sensor fusion algorithms detect accidents in <span className="text-white font-bold">120ms</span> and autonomously dispatch emergency services via encrypted cloud uplink.
        </p>

        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <button onClick={onLoginClick} className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:scale-105">
            INITIATE SYSTEM <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* TECH GRID */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard icon={<Cpu size={32} className="text-cyan-400" />} title="Neural Sensor Engine" desc="Differentiates between potholes and crashes using 3-axis accelerometer data processed at 60Hz." />
          <FeatureCard icon={<Globe size={32} className="text-blue-400" />} title="Global Telemetry" desc="Real-time uplink to Rakshak Cloud ensures data persistence even if the device is destroyed." />
          <FeatureCard icon={<Zap size={32} className="text-purple-400" />} title="Zero-Latency Dispatch" desc="Bypasses call centers. Alerts are sent directly to emergency contacts via Telegram API." />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-center">
        <p className="text-slate-600 text-xs tracking-widest">&copy; 2026 RAKSHAK DEFENSE SYSTEMS. ARCHITECT: SUBHADIP DAS.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300">
      <div className="mb-6 p-4 bg-slate-950 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-inner">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// --- AUTH PORTAL (With Tabs) ---
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
      setMessage("Verification Link Sent! Please check your email.");
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
            setError("Access Denied: Invalid Credentials");
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
            <button onClick={() => { setRole('user'); setError(''); }} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'user' ? 'bg-cyan-500 text-slate-900' : 'text-slate-500 hover:text-white'}`}>USER</button>
            <button onClick={() => { setRole('admin'); setError(''); }} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'admin' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white'}`}>COMMANDER</button>
        </div>
        <h2 className="text-2xl font-bold text-center mb-1 text-white">{role === 'user' ? (isRegistering ? 'New Account' : 'Welcome Back') : 'RESTRICTED AREA'}</h2>
        
        {error && <div className="mt-4 p-3 bg-red-500/20 text-red-200 text-xs rounded-lg flex gap-2"><AlertTriangle size={14}/> {error}</div>}
        {message && <div className="mt-4 p-3 bg-emerald-500/20 text-emerald-200 text-xs rounded-lg flex gap-2"><Activity size={14}/> {message}</div>}

        {role === 'user' ? (
            <div className="mt-6 space-y-4">
                <button onClick={handleGoogleLogin} className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-xl flex justify-center items-center gap-3 text-sm">
                   <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Continue with Google
                </button>
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
function AdminDashboard({ onLogout }) {
  const [history, setHistory] = useState([]);
  useEffect(() => { axios.get(`${API_URL}/view_history`).then(res => setHistory(res.data)).catch(console.error); }, []);
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans overflow-y-auto border-t-4 border-red-600">
       <div className="max-w-7xl mx-auto">
         <header className="flex justify-between items-center mb-10 bg-red-950/20 p-6 rounded-2xl border border-red-900/50 backdrop-blur-md">
            <div className="flex items-center gap-4"><div className="bg-red-600 text-white p-3 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.5)]"><Lock size={24}/></div><div><h1 className="font-black text-2xl leading-none text-red-500 tracking-tighter">COMMAND CENTER</h1><span className="text-xs text-red-400/60 uppercase tracking-[0.3em]">Clearance Level 5</span></div></div>
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

// --- USER APP ---
function UserApp({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState('home');
  const [sosStatus, setSosStatus] = useState('idle');
  const [acceleration, setAcceleration] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  const [location, setLocation] = useState([20.5937, 78.9629]); 
  
  // FIXED: Using useRef for Audio to prevent "Value cannot be modified" error
  const audioRef = useRef(new Audio(ALARM_URL));

  useEffect(() => {
    audioRef.current.load();
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setLocation([pos.coords.latitude, pos.coords.longitude]);
          setSpeed(((pos.coords.speed || 0) * 3.6).toFixed(0));
        },
        null, { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const playAlarm = useCallback(() => {
    // FIXED: Modifying .current properties is allowed
    audioRef.current.currentTime = 0;
    audioRef.current.volume = 1.0;
    audioRef.current.play().catch(console.error);
  }, []);

  const handleSOS = useCallback(async (msg = "Manual SOS") => {
    setSosStatus('sending');
    playAlarm(); 
    try {
        await axios.post(`${API_URL}/crash_alert`, { user_id: 101, location: `${location[0]},${location[1]}`, message: msg });
        setSosStatus('success');
        setTimeout(() => setSosStatus('idle'), 5000);
    } catch { setSosStatus('idle'); alert("Offline Mode"); }
  }, [playAlarm, location]);

  useEffect(() => {
    if (autoMode) {
      const handleMotion = (event) => {
        let x = event.acceleration?.x || 0;
        let y = event.acceleration?.y || 0;
        let z = event.acceleration?.z || 0;
        
        const totalForce = Math.sqrt(x*x + y*y + z*z);
        const impactForce = Math.abs(totalForce - 9.8);
        setAcceleration(impactForce.toFixed(1));
        if (impactForce > CRASH_G_FORCE && sosStatus === 'idle') handleSOS(`🚨 AUTO-CRASH: ${impactForce.toFixed(1)}G`);
      };
      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [autoMode, sosStatus, handleSOS]);

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser && view !== 'admin') { 
            // Only auto-login verified users
            if (currentUser.emailVerified) { 
                setUser(currentUser);
                setView('user');
            }
        }
    });
    return () => unsubscribe();
  }, []); // eslint-disable-line

  const handleAuthSuccess = (role, userData) => { setUser(userData); setView(role); };
  const handleLogout = async () => { await signOut(auth); setUser(null); setView('landing'); };

  return (
    <>
      {view === 'landing' && <LandingPage onLoginClick={() => setView('auth')} />}
      {view === 'auth' && <AuthPortal onAuthSuccess={handleAuthSuccess} onBack={() => setView('landing')} />}
      {view === 'admin' && <AdminDashboard onLogout={handleLogout} />}
      {view === 'user' && <UserApp onLogout={handleLogout} user={user} />}
    </>
  );
}

export default App;