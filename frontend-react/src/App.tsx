import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { 
  getAuth, signInWithPopup, GoogleAuthProvider, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  sendEmailVerification, signOut, onAuthStateChanged
} from "firebase/auth";
import { 
  AlertTriangle, Shield, Zap, 
  Key, Loader2, Mail, User, Lock, MessageSquare, X, Send, LogOut, UserPlus, Trash2,
  Globe, Activity, Radio, PhoneCall} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react'; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet'; 
import 'leaflet/dist/leaflet.css';

// --- VISUAL COMPONENTS ---
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { InteractiveDemo } from '@/components/landing/InteractiveDemo';
import { Pricing } from '@/components/landing/Pricing';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

// --- FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyAuozu4A_9OtGusVCO_pyDt8o8mKl0h3ig",
  authDomain: "rakshak-89deb.firebaseapp.com",
  projectId: "rakshak-89deb",
  storageBucket: "rakshak-89deb.firebasestorage.app",
  messagingSenderId: "101062187555",
  appId: "1:101062187555:web:5d4b6aaa1f420c4e366f96"
};

let app, auth: any, googleProvider: any;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
} catch (e) {
    console.error("Firebase Init Error:", e);
}

const API_URL = "https://rakshak-api-sovy.onrender.com";

// --- ERROR BOUNDARY ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-red-500 flex flex-col items-center justify-center p-10 font-mono text-center">
          <AlertTriangle size={48} className="mb-4" />
          <h1 className="text-xl font-bold">SYSTEM CRITICAL ERROR</h1>
          <p className="mt-4 bg-gray-900 p-4 border border-red-900 rounded text-xs overflow-auto max-w-lg">
            {this.state.error && this.state.error.toString()}
          </p>
          <button onClick={() => window.location.reload()} className="mt-6 bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-500">
            REBOOT SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- HELPER TO FORCE MAP TO FOLLOW USER ---
function RecenterMap({ location }: { location: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(location, map.getZoom());
  }, [location]);
  return null;
}

// --- SMART RAKSHAK BOT ---
function RakshakBot({ stats, user }: { stats?: any, user?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Rakshak Neural Link Established. Ready.' }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "Processing data...";
      const lower = userText.toLowerCase();
      
      if (lower.includes('status') || lower.includes('report')) {
        if (stats) {
            reply = `SYSTEM NOMINAL.\nSpeed: ${stats.speed?.toFixed(1) || 0} km/h\nG-Force: ${stats.gForce || 1}g\nAltitude: ${stats.altitude?.toFixed(0) || 0}m`;
        } else {
            reply = "Sensor data unavailable. Please initialize Defense Protocol.";
        }
      } 
      else if (lower.includes('location') || lower.includes('where')) {
         if (stats?.location) {
             reply = `GPS LOCK ESTABLISHED.\nLat: ${stats.location[0].toFixed(4)}\nLng: ${stats.location[1].toFixed(4)}`;
         } else {
             reply = "GPS Signal Lost.";
         }
      }
      else if (lower.includes('sos') || lower.includes('help')) reply = "The SOS System is autonomous. Upon high-G impact, it will auto-dial guardians and upload coordinates.";
      else if (lower.includes('hi') || lower.includes('hello')) reply = `Greetings ${user?.email ? user.email.split('@')[0] : 'Operator'}. Rakshak systems operational.`;
      else reply = "Command not recognized. Try 'Status', 'Location', or 'Help'.";

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="group relative flex items-center justify-center w-16 h-16 bg-cyan-600 hover:bg-cyan-500 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all hover:scale-110">
          <MessageSquare size={32} className="text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
        </button>
      )}
      {isOpen && (
        <div className="w-[320px] h-[450px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-white text-sm">RAKSHAK AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-black/40">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-800 border border-slate-700 text-slate-300 rounded-bl-none'}`}>
                    {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[10px] text-cyan-500/70 animate-pulse pl-2">Analyzing sensors...</div>}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-slate-950/50 border-t border-slate-800 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Query system..." className="flex-1 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none transition-all" />
            <button type="submit" className="text-cyan-500 hover:text-white transition-colors"><Send size={16} /></button>
          </form>
        </div>
      )}
    </div>
  );
}

// --- AUTH COMPONENTS (Kept same as before) ---
function AuthPortal({ onAuthSuccess, onBack }: { onAuthSuccess: (role: string, data: any) => void, onBack: () => void }) {
  const [role, setRole] = useState('user'); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminKey, setAdminKey] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user); setIsRegistering(false); await signOut(auth); 
    } catch (err: any) { setError(err.message.replace("Firebase:", "").trim()); } finally { setIsLoading(false); }
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) throw new Error("Email not verified.");
      onAuthSuccess("user", userCredential.user);
    } catch (err: any) { setError(err.message.replace("Firebase:", "").trim()); } finally { setIsLoading(false); }
  };
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try { const result = await signInWithPopup(auth, googleProvider); onAuthSuccess("user", result.user); } 
    catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    setTimeout(() => {
        if (email === "commander" && adminKey === "rakshak-alpha") { onAuthSuccess("admin", { email: "COMMANDER", uid: "ADM-001" }); } 
        else { setError("Access Denied"); setIsLoading(false); }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className={`absolute top-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 ${role === 'admin' ? 'bg-red-600/20' : 'bg-cyan-500/10'}`}></div>
      <div className={`bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm border transition-colors duration-500 relative z-10 ${role === 'admin' ? 'border-red-500/50' : 'border-slate-700'}`}>
        <button onClick={onBack} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={20}/></button>
        <div className="flex bg-slate-950 p-1 rounded-xl mb-8 border border-slate-800">
            <button onClick={() => setRole('user')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'user' ? 'bg-cyan-500 text-slate-900' : 'text-slate-500 hover:text-white'}`}>USER</button>
            <button onClick={() => setRole('admin')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'admin' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white'}`}>COMMANDER</button>
        </div>
        {error && <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs flex items-center gap-2"><AlertTriangle size={14}/> {error}</div>}
        {role === 'user' && (
            <div className="mt-6 space-y-4">
                <button onClick={handleGoogleLogin} className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-xl flex justify-center items-center gap-3 text-sm transition-transform hover:scale-[1.02]">Continue with Google</button>
                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                    <div className="relative"><Mail className="absolute left-4 top-3.5 text-slate-500" size={18} /><input type="email" placeholder="Email" required className="w-full bg-slate-950 text-white pl-12 pr-4 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                    <div className="relative"><Key className="absolute left-4 top-3.5 text-slate-500" size={18} /><input type="password" placeholder="Password" required className="w-full bg-slate-950 text-white pl-12 pr-4 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                    <button type="submit" disabled={isLoading} className="w-full bg-cyan-500/10 hover:bg-cyan-500 text-cyan-500 hover:text-slate-900 font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 border border-cyan-500/50">{isLoading ? <Loader2 className="animate-spin" /> : (isRegistering ? 'Register' : 'Login')}</button>
                </form>
            </div>
        )}
        {role === 'admin' && (
            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="relative"><User className="absolute left-4 top-3.5 text-red-500" size={18} /><input type="text" placeholder="Commander ID" required className="w-full bg-slate-950 text-red-500 pl-12 pr-4 py-3 rounded-xl border border-red-900/50 focus:border-red-500 outline-none font-mono" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div className="relative"><Lock className="absolute left-4 top-3.5 text-red-500" size={18} /><input type="password" placeholder="Access Key" required className="w-full bg-slate-950 text-red-500 pl-12 pr-4 py-3 rounded-xl border border-red-900/50 focus:border-red-500 outline-none font-mono tracking-widest" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} /></div>
                <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 shadow-[0_0_30px_rgba(220,38,38,0.4)]">{isLoading ? <Loader2 className="animate-spin" /> : "ESTABLISH UPLINK"}</button>
            </form>
        )}
      </div>
    </div>
  );
}

// --- ADMIN DASHBOARD ---
function AdminDashboard({ onLogout, user }: { onLogout: () => void, user: any }) {
  const [history, setHistory] = useState<any[]>([]);
  useEffect(() => { axios.get(`${API_URL}/view_history`).then(res => setHistory(res.data)).catch(console.error); }, []);
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans overflow-y-auto border-t-4 border-red-600">
       <div className="max-w-7xl mx-auto">
         <header className="flex justify-between items-center mb-10 bg-red-950/20 p-6 rounded-2xl border border-red-900/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
               <div className="bg-red-600 text-white p-3 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.5)]"><Lock size={24}/></div>
               <div><h1 className="font-black text-2xl leading-none text-red-500 tracking-tighter">COMMAND CENTER</h1><span className="text-xs text-red-400/60 uppercase tracking-[0.3em]">CMDR: {user?.email || "Unknown"}</span></div>
            </div>
            <button onClick={onLogout} className="bg-slate-900 text-slate-400 hover:text-white px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-800"><LogOut size={16} /> ABORT SESSION</button>
         </header>
         <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 bg-slate-950"><h3 className="font-bold text-slate-300">Encrypted Incident Logs</h3></div>
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-900 text-xs uppercase font-bold text-slate-500"><tr><th className="p-4">ID</th><th className="p-4">Coordinates</th><th className="p-4">Payload</th><th className="p-4">Timestamp</th></tr></thead>
              <tbody className="divide-y divide-slate-800">{history.map((log) => (<tr key={log.id} className="hover:bg-slate-800/50 transition-colors"><td className="p-4 font-mono text-emerald-500">ID-{log.id}</td><td className="p-4 font-mono">{log.location}</td><td className="p-4 text-white font-medium">{log.message}</td><td className="p-4 font-mono text-xs">{log.timestamp}</td></tr>))}</tbody>
            </table>
         </div>
       </div>
    </div>
  );
}

// --- USER DASHBOARD (AUTO-DIALER + REALISTIC MAP) ---
function UserApp({ onLogout }: { onLogout: () => void, user: any }) {
  // STATE
  const [contacts, setContacts] = useState<{id: number, name: string, phone: string, telegramId?: string}[]>(() => {
    const saved = localStorage.getItem('rakshak_contacts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeTab, setActiveTab] = useState('defense'); 
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', telegramId: '' });
  const [location, setLocation] = useState<[number, number]>([20.5937, 78.9629]); 
  const [stats, setStats] = useState({ speed: 0, gForce: 1.0, altitude: 0, location: location });
  const [, setCrashDetected] = useState(false);
  const [statusLog, setStatusLog] = useState<string>("");
  const [isCalling, setIsCalling] = useState(false); // New Call UI State

  const CRASH_THRESHOLD = 2.5; 
  const TELEGRAM_BOT_TOKEN = "7953049187:AAH0pP1sU2_kKO_CqW_2J2aFf_Vj_X-a3_o"; // Replace with your real token

  useEffect(() => { localStorage.setItem('rakshak_contacts', JSON.stringify(contacts)); }, [contacts]);

  // --- AUTOMATIC ALERT SYSTEM (Direct, Fast, Automatic) ---
  const triggerSOS = async () => {
    if (isSOSActive) return; 
    setIsSOSActive(true);
    setCrashDetected(true);
    setStatusLog("CRASH DETECTED! INITIATING AUTO-PROTOCOLS...");

    const googleMapsLink = `https://www.google.com/maps?q=${location[0]},${location[1]}`;
    const alertMsg = `🚨 SOS! CRASH DETECTED!\nSpeed: ${stats.speed.toFixed(0)} km/h\nG: ${stats.gForce}g\n\n📍 ${googleMapsLink}`;

    if (contacts.length > 0) {
      const primary = contacts[0];
      const cleanPhone = primary.phone.replace(/\D/g, ''); 

      // 1. AUTO-CALL SIMULATION (Visible UI for Differentiator)
      setIsCalling(true);
      setStatusLog(`📡 ESTABLISHING DIRECT VOICE LINK: ${primary.name}...`);
      
      // On WEB: We must prompt. On NATIVE: This would run SmsManager/CallManager
      setTimeout(() => {
         window.open(`tel:${cleanPhone}`, '_self');
         setStatusLog("✅ VOICE LINK ESTABLISHED.");
      }, 2000);

      // 2. TELEGRAM AUTO-SEND (Zero Clicks)
      if (primary.telegramId) {
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: primary.telegramId, text: alertMsg })
        }).then(() => setStatusLog(prev => prev + "\n✅ TELEGRAM DATA PACKET SENT.")).catch(e => console.error(e));
      }
    } else {
        setStatusLog("⚠️ NO GUARDIANS FOUND! SYSTEM STANDBY.");
    }
  };

  // SENSORS
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setLocation(newLoc);
        setStats(prev => ({ ...prev, speed: pos.coords.speed ? (pos.coords.speed * 3.6) : 0, altitude: pos.coords.altitude || 0, location: newLoc }));
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
    const handleMotion = (e: DeviceMotionEvent) => {
      if (e.accelerationIncludingGravity) {
        const { x, y, z } = e.accelerationIncludingGravity;
        const g = Math.sqrt((x || 0)**2 + (y || 0)**2 + (z || 0)**2) / 9.8;
        const currentG = parseFloat(g.toFixed(2));
        setStats(prev => ({ ...prev, gForce: currentG }));
        if (currentG > CRASH_THRESHOLD && !isSOSActive) { triggerSOS(); }
      }
    };
    window.addEventListener('devicemotion', handleMotion);
    return () => { navigator.geolocation.clearWatch(watchId); window.removeEventListener('devicemotion', handleMotion); };
  }, [isSOSActive, contacts]); 

  // CONTACT HELPERS
  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, { id: Date.now(), name: newContact.name, phone: newContact.phone, telegramId: newContact.telegramId }]);
      setNewContact({ name: '', phone: '', telegramId: '' });
    }
  };
  const removeContact = (id: number) => setContacts(contacts.filter(c => c.id !== id));

  return (
    <div className="min-h-screen bg-black text-gray-200 pb-20 font-sans">
      {/* CALLING OVERLAY (Differentiator UI) */}
      <AnimatePresence>
        {isCalling && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center space-y-8">
                <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center animate-ping">
                    <PhoneCall size={48} className="text-white"/>
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-black text-white">AUTO-DIALING</h2>
                    <p className="text-xl text-red-200 mt-2">{contacts[0]?.name} ({contacts[0]?.phone})</p>
                </div>
                <button onClick={() => setIsCalling(false)} className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-xl hover:bg-gray-200">CANCEL UPLINK</button>
            </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Shield className="text-cyan-500 w-6 h-6" />
            <span className="font-bold text-lg tracking-wider text-white">RAKSHAK</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout} className="text-slate-400 hover:text-white"><LogOut size={20} /></Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-6">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button onClick={() => setActiveTab('defense')} className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-widest transition-all ${activeTab === 'defense' ? 'bg-cyan-950 text-cyan-400 border border-cyan-900/50' : 'text-slate-500'}`}>DEFENSE</button>
          <button onClick={() => setActiveTab('contacts')} className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-widest transition-all ${activeTab === 'contacts' ? 'bg-cyan-950 text-cyan-400 border border-cyan-900/50' : 'text-slate-500'}`}>CONTACTS</button>
        </div>

        {activeTab === 'defense' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-center flex flex-col items-center">
                <Activity size={14} className="text-cyan-600 mb-1" />
                <div className="text-[10px] text-slate-500 font-bold tracking-widest">SPEED</div>
                <div className="text-xl font-mono text-cyan-400">{stats.speed.toFixed(0)}</div>
              </div>
              <div className={`p-3 rounded-xl border text-center flex flex-col items-center transition-all ${stats.gForce > 2 ? 'bg-red-950/30 border-red-500/50 animate-pulse' : 'bg-slate-900/50 border-slate-800'}`}>
                <Zap size={14} className={`${stats.gForce > 2 ? 'text-red-500' : 'text-yellow-600'} mb-1`} />
                <div className="text-[10px] text-slate-500 font-bold tracking-widest">G-FORCE</div>
                <div className={`text-xl font-mono ${stats.gForce > 2 ? 'text-red-500' : 'text-white'}`}>{stats.gForce}g</div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-center flex flex-col items-center">
                <Radio size={14} className="text-purple-600 mb-1" />
                <div className="text-[10px] text-slate-500 font-bold tracking-widest">ALTITUDE</div>
                <div className="text-xl font-mono text-purple-400">{stats.altitude.toFixed(0)}m</div>
              </div>
            </div>

            <button onClick={() => setShowMap(!showMap)} className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-900/50 transition-all flex items-center justify-center gap-2 text-sm font-bold"><Globe size={18} /> {showMap ? "CLOSE SAT-FEED" : "LIVE SAT-FEED"}</button>

            <AnimatePresence>
                {showMap && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 300, opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="rounded-2xl overflow-hidden border-2 border-slate-700 relative shadow-2xl">
                        {/* THE DARK MODE SATELLITE HACK: CSS FILTER */}
                        <div className="w-full h-full" style={{ filter: "grayscale(20%) brightness(70%) contrast(110%)" }}>
                            {/* @ts-ignore */}
                            <MapContainer center={location} zoom={18} style={{ height: "100%", width: "100%" }}>
                                <RecenterMap location={location} /> 
                                <TileLayer url="http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" subdomains={['mt0', 'mt1', 'mt2', 'mt3']} attribution='© Google Maps' />
                                {/* @ts-ignore */}
                                <Marker position={location} icon={new Icon({iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41]})}><Popup>TARGET</Popup></Marker>
                            </MapContainer>
                        </div>
                        {/* Overlay to mimic HUD */}
                        <div className="absolute top-4 right-4 bg-black/50 px-2 py-1 rounded text-[10px] text-green-400 font-mono border border-green-500/30 z-[400]">SAT-LINK: ACTIVE</div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col items-center justify-center py-4">
              <button onClick={triggerSOS} className={`relative group w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ${isSOSActive ? 'bg-red-600 shadow-[0_0_80px_rgba(220,38,38,0.6)] scale-105' : 'bg-slate-800 hover:bg-red-900/30 border-4 border-slate-700 hover:border-red-500/50'}`}>
                {isSOSActive && <div className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-75"></div>}
                <div className="flex flex-col items-center z-10"><AlertTriangle size={48} className={`mb-1 ${isSOSActive ? 'text-white animate-bounce' : 'text-red-500'}`} /><span className={`text-2xl font-black tracking-widest ${isSOSActive ? 'text-white' : 'text-red-500'}`}>SOS</span></div>
              </button>
              {statusLog && (<div className="mt-6 w-full bg-slate-900 border border-slate-700 p-4 rounded-xl"><div className="flex items-center gap-2 mb-2 text-cyan-400 text-xs font-bold uppercase tracking-wider"><Activity size={12} className="animate-pulse"/> System Log</div><div className="font-mono text-xs text-slate-300 whitespace-pre-line">{statusLog}</div></div>)}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
               <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2"><UserPlus size={16} /> Add Guardian</h3>
               <div className="space-y-2">
                 <Input placeholder="Name" className="bg-slate-950 border-slate-800 text-white" value={newContact.name} onChange={(e) => setNewContact({...newContact, name: e.target.value})}/>
                 <Input placeholder="Phone (Required)" className="bg-slate-950 border-slate-800 text-white" value={newContact.phone} onChange={(e) => setNewContact({...newContact, phone: e.target.value})}/>
                 <Input placeholder="Telegram ID (Optional for Auto-Text)" className="bg-slate-950 border-slate-800 text-white" value={newContact.telegramId} onChange={(e) => setNewContact({...newContact, telegramId: e.target.value})}/>
                 <Button onClick={handleAddContact} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold">SAVE CONTACT</Button>
               </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider pl-1">Your Trusted Network ({contacts.length})</h3>
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400"><User size={20} /></div><div><div className="font-bold text-white">{contact.name}</div><div className="text-xs text-slate-400">{contact.phone}</div></div></div>
                  <div className="flex gap-2"><button onClick={() => window.open(`tel:${contact.phone}`)} className="text-green-500 hover:bg-green-950/30 p-2 rounded-lg transition-colors"><PhoneCall size={18} /></button><button onClick={() => removeContact(contact.id)} className="text-red-500 hover:bg-red-950/30 p-2 rounded-lg transition-colors"><Trash2 size={18} /></button></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <RakshakBot />
    </div>
  );
}

// --- VISUAL LANDING PAGE ---
function LandingPage({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <div className="min-h-screen bg-black">
      <Header onLoginClick={onLoginClick} />
      <main className="pt-16"><Hero /><Features /><InteractiveDemo /><Pricing /><Testimonials /><FAQ /><CTA /></main>
      <Footer />
    </div>
  );
}

// --- MAIN APP ---
function App() {
  const [view, setView] = useState('landing'); 
  const [user, setUser] = useState<any>(null); 
  const [isAuthChecking, setIsAuthChecking] = useState(true); 

  useEffect(() => {
    const checkLogin = async () => {
      const localRole = localStorage.getItem('rakshak_role');
      if (localRole === 'admin') { setUser({ email: "COMMANDER", uid: "admin-local" }); setView('admin'); setIsAuthChecking(false); return; }
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) { setUser(currentUser); setView('user'); } 
        else { if (localRole !== 'admin') setView('landing'); }
        setIsAuthChecking(false);
      });
      return () => unsubscribe();
    };
    checkLogin();
  }, []);

  const handleAuthSuccess = (role: string, userData: any) => { if (role === 'admin') localStorage.setItem('rakshak_role', 'admin'); setUser(userData); setView(role); };
  const handleLogout = async () => { localStorage.removeItem('rakshak_role'); if(auth) await signOut(auth); setUser(null); setView('landing'); };

  if (isAuthChecking) {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-cyan-500 w-12 h-12" />
            <div className="text-cyan-500 font-mono text-sm tracking-[0.2em] animate-pulse">ESTABLISHING SECURE UPLINK...</div>
        </div>
    );
  }

  return (
    <ErrorBoundary>
        {view === 'landing' && <LandingPage onLoginClick={() => setView('auth')} />}
        {view === 'auth' && <AuthPortal onAuthSuccess={handleAuthSuccess} onBack={() => setView('landing')} />}
        {view === 'admin' && <AdminDashboard onLogout={handleLogout} user={user} />}
        {view === 'user' && <UserApp onLogout={handleLogout} user={user} />}
    </ErrorBoundary>
  );
}

export default App;