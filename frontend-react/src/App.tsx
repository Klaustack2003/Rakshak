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
  Cpu, Key, Loader2, Mail, User, Lock, MessageSquare, X, Send, LogOut, UserPlus, Trash2,
  Globe, Activity, Radio, CheckCircle, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react'; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet'; 
import 'leaflet/dist/leaflet.css';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

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
          <button onClick={() => window.location.reload()} className="mt-6 bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-500">REBOOT SYSTEM</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- RAKSHAK BOT ---
function RakshakBot({ stats, user }: { stats?: any, user?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Rakshak Neural Link Established. Ready.' }]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput("");

    setTimeout(() => {
      let reply = "Processing...";
      const lower = userText.toLowerCase();
      if (lower.includes('status')) reply = `SPEED: ${stats?.speed?.toFixed(1) || 0} km/h\nG-FORCE: ${stats?.gForce || 1}g`;
      else if (lower.includes('location')) reply = `GPS: ${stats?.location?.lat.toFixed(4)}, ${stats?.location?.lng.toFixed(4)}`;
      else if (lower.includes('sos')) reply = "SOS Triggered. Sending Telegram Data Packet.";
      else reply = "Command not recognized.";
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="flex items-center justify-center w-16 h-16 bg-cyan-600 hover:bg-cyan-500 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all hover:scale-110">
          <MessageSquare size={32} className="text-white" />
        </button>
      )}
      {isOpen && (
        <div className="w-[320px] h-[400px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex justify-between items-center">
            <span className="font-bold text-white text-sm">RAKSHAK AI</span>
            <button onClick={() => setIsOpen(false)}><X size={18} className="text-slate-400" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-xs ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'}`}>{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-slate-950/50 border-t border-slate-800 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Query..." className="flex-1 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none" />
            <button type="submit"><Send size={16} className="text-cyan-500" /></button>
          </form>
        </div>
      )}
    </div>
  );
}

// --- AUTH COMPONENTS ---
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
      onAuthSuccess("user", userCredential.user);
    } catch (err: any) { setError(err.message.replace("Firebase:", "").trim()); } finally { setIsLoading(false); }
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess("user", userCredential.user);
    } catch (err: any) { setError(err.message.replace("Firebase:", "").trim()); } finally { setIsLoading(false); }
  };
  const handleGoogleLogin = async () => {
    try { const result = await signInWithPopup(auth, googleProvider); onAuthSuccess("user", result.user); } 
    catch (err: any) { setError(err.message); }
  };
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    setTimeout(() => {
        if (email === "commander" && adminKey === "rakshak-alpha") { onAuthSuccess("admin", { email: "COMMANDER", uid: "ADM-001" }); } 
        else { setError("Access Denied"); setIsLoading(false); }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-700 relative z-10">
        <button onClick={onBack} className="absolute top-6 right-6 text-slate-500"><X size={20}/></button>
        <div className="flex bg-slate-950 p-1 rounded-xl mb-8 border border-slate-800">
            <button onClick={() => setRole('user')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${role === 'user' ? 'bg-cyan-500 text-slate-900' : 'text-slate-500'}`}>USER</button>
            <button onClick={() => setRole('admin')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${role === 'admin' ? 'bg-red-600 text-white' : 'text-slate-500'}`}>COMMANDER</button>
        </div>
        {error && <div className="mt-4 p-3 bg-red-500/20 text-red-200 text-xs flex items-center gap-2"><AlertTriangle size={14}/> {error}</div>}
        
        {role === 'user' && (
            <div className="mt-6 space-y-4">
                <button onClick={handleGoogleLogin} className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl text-sm hover:scale-[1.02] transition-transform">Continue with Google</button>
                <div className="flex items-center gap-2 text-slate-500 text-xs justify-center"><div className="h-[1px] bg-slate-800 flex-1"></div>OR<div className="h-[1px] bg-slate-800 flex-1"></div></div>
                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email" required className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" required className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" disabled={isLoading} className="w-full bg-cyan-500/10 text-cyan-500 font-bold py-3 rounded-xl border border-cyan-500/50 hover:bg-cyan-500 hover:text-slate-900 transition-all">{isLoading ? <Loader2 className="animate-spin" /> : (isRegistering ? 'Register New ID' : 'Login')}</button>
                </form>
                <button onClick={() => setIsRegistering(!isRegistering)} className="w-full text-center text-xs text-slate-500 hover:text-white mt-4 underline">{isRegistering ? "Already have an account? Login" : "New Operator? Create Account"}</button>
            </div>
        )}
        {role === 'admin' && (
            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
                <input type="text" placeholder="Commander ID" required className="w-full bg-slate-950 text-red-500 p-3 rounded-xl border border-red-900/50 focus:border-red-500 outline-none font-mono" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Access Key" required className="w-full bg-slate-950 text-red-500 p-3 rounded-xl border border-red-900/50 focus:border-red-500 outline-none font-mono" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} />
                <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-500 transition-all">{isLoading ? <Loader2 className="animate-spin" /> : "ESTABLISH UPLINK"}</button>
            </form>
        )}
      </div>
    </div>
  );
}

// --- ADMIN DASHBOARD (CONNECTED PROPERLY) ---
function AdminDashboard({ onLogout, user, history, clearHistory }: { onLogout: () => void, user: any, history: any[], clearHistory: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans overflow-y-auto border-t-4 border-red-600">
       <div className="max-w-7xl mx-auto">
         <header className="flex justify-between items-center mb-10 bg-red-950/20 p-6 rounded-2xl border border-red-900/50 backdrop-blur-md">
            <h1 className="font-black text-2xl text-red-500">COMMAND CENTER <span className="text-xs text-red-400/60 uppercase ml-2">CMDR: {user?.email}</span></h1>
            <button onClick={onLogout} className="bg-slate-900 text-slate-400 hover:text-white px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-800"><LogOut size={16} /> ABORT</button>
         </header>
         <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950">
                <h3 className="font-bold text-slate-300">Live Incident Stream</h3>
                <div className="flex items-center gap-4">
                    <div className="text-xs text-emerald-500 animate-pulse font-mono">LIVE FEED ACTIVE</div>
                    <button onClick={clearHistory} className="text-xs text-red-500 hover:text-white underline">Clear Logs</button>
                </div>
            </div>
            {history.length === 0 ? (
                <div className="p-12 text-center text-slate-600 text-sm font-mono">NO ACTIVE INCIDENTS DETECTED.<br/>SYSTEM STANDBY.</div>
            ) : (
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900 text-xs uppercase font-bold text-slate-500"><tr><th className="p-4">Time</th><th className="p-4">Location</th><th className="p-4">User ID</th><th className="p-4">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-800">{history.map((log, i) => (<tr key={i} className="hover:bg-slate-800/50 animate-in fade-in slide-in-from-left-4"><td className="p-4 font-mono text-emerald-500">{log.time}</td><td className="p-4 font-mono">{log.location}</td><td className="p-4 text-white">{log.user}</td><td className="p-4 font-bold text-red-500 flex items-center gap-2"><AlertTriangle size={14}/> {log.status}</td></tr>))}</tbody>
                </table>
            )}
         </div>
       </div>
    </div>
  );
}

// --- USER DASHBOARD (FIXED MAP + HISTORY) ---
function UserApp({ onLogout, user, addHistory }: { onLogout: () => void, user: any, addHistory: (log: any) => void }) {
  // AUTO-ADD KLAUS (YOUR ID)
  const [contacts, setContacts] = useState<{id: number, name: string, phone: string, telegramId?: string}[]>(() => {
    const saved = localStorage.getItem('rakshak_contacts');
    if (!saved) {
        return [{ id: 1, name: "Klaus", phone: "0000000000", telegramId: "1958635120" }];
    }
    return JSON.parse(saved);
  });
  
  const [activeTab, setActiveTab] = useState('defense'); 
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', telegramId: '' });
  const [location, setLocation] = useState<{ lat: number, lng: number }>({ lat: 20.5937, lng: 78.9629 }); 
  const [stats, setStats] = useState({ speed: 0, gForce: 1.0, altitude: 0, location: location });
  const [statusLog, setStatusLog] = useState<string>("");

  // LOAD GOOGLE MAPS
  const { isLoaded } = useLoadScript({ googleMapsApiKey: "" }); 

  const CRASH_THRESHOLD = 2.5; 
  // YOUR TOKEN
  const TELEGRAM_BOT_TOKEN = "8233755831:AAF_r2lFh1QdzUkshyybkHkQigcC0-Urh-k"; 

  useEffect(() => { localStorage.setItem('rakshak_contacts', JSON.stringify(contacts)); }, [contacts]);

  // --- THE SOS PROTOCOL ---
  const triggerSOS = async () => {
    if (isSOSActive) return; 
    setIsSOSActive(true);
    setStatusLog("CRASH DETECTED! INITIATING TELEGRAM UPLINK...");

    // 1. SOUND SIREN
    const audio = new Audio("https://cdn.pixabay.com/audio/2024/09/19/09/52/police-siren-26154.mp3"); 
    audio.play().catch(e => console.log("Audio Blocked", e));

    // 2. SAVE TO BACKEND (SYNC)
    const newLog = {
        time: new Date().toLocaleTimeString(),
        location: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
        user: user.email,
        status: "SOS DEPLOYED"
    };
    addHistory(newLog); // Update Parent State (Instant)

    // FIX: PROPER GOOGLE MAPS UNIVERSAL LINK
    const googleMapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    const alertMsg = `🚨 *SOS! CRASH DETECTED!* 🚨\n\n👤 *User:* ${user.email}\n🚀 *Speed:* ${stats.speed.toFixed(0)} km/h\n💥 *G-Force:* ${stats.gForce}g\n\n📍 *LIVE LOCATION:*\n${googleMapsLink}`;

    if (contacts.length > 0) {
      const primary = contacts[0];

      // STEP 1: TELEGRAM
      if (primary.telegramId) {
        setStatusLog(prev => prev + `\n📡 Sending Data to ID: ${primary.telegramId}...`);
        
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${primary.telegramId}&text=${encodeURIComponent(alertMsg)}&parse_mode=Markdown`;
        
        fetch(url)
        .then(res => res.json())
        .then(data => {
            if(data.ok) {
                setStatusLog(prev => prev + "\n✅ TELEGRAM SENT SUCCESSFULLY!");
            } else {
                setStatusLog(prev => prev + `\n❌ TELEGRAM ERROR: ${data.description}`);
            }
        })
        .catch(err => setStatusLog(prev => prev + "\n❌ NETWORK ERROR: Check Connection."));
      } else {
        setStatusLog(prev => prev + "\n⚠️ SKIPPED TELEGRAM (No ID).");
      }

      // STEP 2: AUTO-RESET
      setTimeout(() => {
         setIsSOSActive(false);
         setStatusLog("✅ PROTOCOL COMPLETE. SYSTEM RESET.");
      }, 10000); 

    } else {
        setStatusLog("⚠️ NO GUARDIANS FOUND! SYSTEM STANDBY.");
        setTimeout(() => setIsSOSActive(false), 3000);
    }
  };

  // SENSORS
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(newLoc);
        setStats(prev => ({ ...prev, speed: pos.coords.speed ? (pos.coords.speed * 3.6) : 0, altitude: pos.coords.altitude || 0, location: newLoc }));
      }, (err) => console.error(err), { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
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

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, { id: Date.now(), name: newContact.name, phone: newContact.phone, telegramId: newContact.telegramId }]);
      setNewContact({ name: '', phone: '', telegramId: '' });
    }
  };
  const removeContact = (id: number) => setContacts(contacts.filter(c => c.id !== id));

  return (
    <div className="min-h-screen bg-black text-gray-200 pb-20 font-sans">
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
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-center flex flex-col items-center"><Activity size={14} className="text-cyan-600 mb-1" /><div className="text-[10px] text-slate-500 font-bold tracking-widest">SPEED</div><div className="text-xl font-mono text-cyan-400">{stats.speed.toFixed(0)}</div></div>
              <div className={`p-3 rounded-xl border text-center flex flex-col items-center transition-all ${stats.gForce > 2 ? 'bg-red-950/30 border-red-500/50 animate-pulse' : 'bg-slate-900/50 border-slate-800'}`}><Zap size={14} className={`${stats.gForce > 2 ? 'text-red-500' : 'text-yellow-600'} mb-1`} /><div className="text-[10px] text-slate-500 font-bold tracking-widest">G-FORCE</div><div className={`text-xl font-mono ${stats.gForce > 2 ? 'text-red-500' : 'text-white'}`}>{stats.gForce}g</div></div>
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-center flex flex-col items-center"><Radio size={14} className="text-purple-600 mb-1" /><div className="text-[10px] text-slate-500 font-bold tracking-widest">ALTITUDE</div><div className="text-xl font-mono text-purple-400">{stats.altitude.toFixed(0)}m</div></div>
            </div>

            <button onClick={() => setShowMap(!showMap)} className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-900/50 transition-all flex items-center justify-center gap-2 text-sm font-bold"><Globe size={18} /> {showMap ? "CLOSE SAT-FEED" : "LIVE SAT-FEED"}</button>

            <AnimatePresence>
                {showMap && isLoaded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 300, opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="rounded-2xl overflow-hidden border-2 border-slate-700 relative shadow-2xl">
                        <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={location} zoom={18} options={{ mapTypeId: 'hybrid', disableDefaultUI: true, zoomControl: true }}><MarkerF position={location} /></GoogleMap>
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
                 <Input placeholder="Telegram ID (Required for Auto-Text)" className="bg-slate-950 border-slate-800 text-white" value={newContact.telegramId} onChange={(e) => setNewContact({...newContact, telegramId: e.target.value})}/>
                 <div className="text-[10px] text-slate-500">To get ID: Search for your bot in Telegram, type /start.</div>
                 <Button onClick={handleAddContact} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold">SAVE CONTACT</Button>
               </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider pl-1">Your Trusted Network ({contacts.length})</h3>
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400"><User size={20} /></div>
                      <div>
                          <div className="font-bold text-white">{contact.name}</div>
                          <div className="text-xs text-slate-400">{contact.phone}</div>
                          {contact.telegramId ? <div className="text-[10px] text-green-500 flex items-center gap-1"><Zap size={8}/> Telegram Active</div> : <div className="text-[10px] text-red-500 flex items-center gap-1"><AlertTriangle size={8}/> No Telegram ID</div>}
                      </div>
                  </div>
                  <div className="flex gap-2"><button onClick={() => removeContact(contact.id)} className="text-red-500 hover:bg-red-950/30 p-2 rounded-lg transition-colors"><Trash2 size={18} /></button></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <RakshakBot stats={stats} user={user} />
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

// --- MAIN APP (CENTRAL STATE) ---
function App() {
  const [view, setView] = useState('landing'); 
  const [user, setUser] = useState<any>(null); 
  const [isAuthChecking, setIsAuthChecking] = useState(true); 
  // STATE LIFTING: Load history once here
  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('rakshak_history');
    return saved ? JSON.parse(saved) : [];
  });

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
  
  // UPDATE BOTH STATE AND STORAGE
  const addHistoryLog = (log: any) => { 
      const updated = [log, ...history];
      setHistory(updated);
      localStorage.setItem('rakshak_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
      localStorage.removeItem('rakshak_history');
      setHistory([]);
  };

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
        {view === 'admin' && <AdminDashboard onLogout={handleLogout} user={user} history={history} clearHistory={clearHistory} />}
        {view === 'user' && <UserApp onLogout={handleLogout} user={user} addHistory={addHistoryLog} />}
    </ErrorBoundary>
  );
}

export default App;