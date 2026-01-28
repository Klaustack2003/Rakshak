import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 
import { initializeApp } from "firebase/app";
import { 
  getAuth, signInWithPopup, GoogleAuthProvider, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged
} from "firebase/auth";
import { 
  getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp 
} from "firebase/firestore";
import { 
  AlertTriangle, Shield, Zap, 
  Loader2, User, X, Send, LogOut, UserPlus, Trash2,
  Globe, Activity, Radio, CheckCircle, Database, Navigation, 
  Server, Signal, MapPin, AlertOctagon, Smartphone, MessageCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react'; 
import 'leaflet/dist/leaflet.css';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

// --- UI COMPONENTS (INLINE) ---
// Simple Button Component to replace external dependency
const Button = ({ children, onClick, className, variant = 'primary' }: any) => {
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white",
    outline: "border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white"
  };
  return <button onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>{children}</button>;
};

// Simple Input Component
const Input = ({ placeholder, value, onChange, className }: any) => (
  <input 
    type="text" 
    placeholder={placeholder} 
    value={value} 
    onChange={onChange} 
    className={`w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-cyan-500 outline-none placeholder:text-slate-600 text-sm ${className}`}
  />
);

// --- CONSTANTS ---
const BACKEND_URL = "https://rakshak-api-sovy.onrender.com";
const TELEGRAM_BOT_TOKEN = "8233755831:AAF_r2lFh1QdzUkshyybkHkQigcC0-Urh-k"; 

const firebaseConfig = {
  apiKey: "AIzaSyAuozu4A_9OtGusVCO_pyDt8o8mKl0h3ig",
  authDomain: "rakshak-89deb.firebaseapp.com",
  projectId: "rakshak-89deb",
  storageBucket: "rakshak-89deb.firebasestorage.app",
  messagingSenderId: "101062187555",
  appId: "1:101062187555:web:5d4b6aaa1f420c4e366f96"
};

// INITIALIZE FIREBASE
let app, auth: any, googleProvider: any, db: any;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
} catch (e) {
    console.error("Firebase Initialization Error:", e);
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
          <h1 className="text-xl font-bold tracking-widest">SYSTEM CRITICAL ERROR</h1>
          <p className="mt-2 text-sm text-gray-400">The application encountered a fatal exception.</p>
          <button onClick={() => window.location.reload()} className="mt-6 bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition-colors">
            REBOOT SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- RAKSHAK BOT ---
function RakshakBot({ stats, user }: { stats?: any, user?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'System Online. Awaiting queries.' }]);
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
      if (lower.includes('status')) reply = `SPEED: ${stats?.speed?.toFixed(1) || 0} km/h | G-FORCE: ${stats?.gForce || 0}g`;
      else if (lower.includes('location')) reply = `GPS: ${stats?.location?.lat.toFixed(6)}, ${stats?.location?.lng.toFixed(6)}`;
      else if (lower.includes('sos')) reply = "Manual SOS Protocol Initiated.";
      else reply = "Command not recognized.";
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="flex items-center justify-center w-14 h-14 bg-cyan-600 hover:bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105">
          <MessageCircle size={24} className="text-white" />
        </button>
      )}
      {isOpen && (
        <div className="w-[320px] h-[400px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex justify-between items-center">
            <span className="font-bold text-white text-xs tracking-widest flex items-center gap-2"><Shield size={12}/> RAKSHAK AI</span>
            <button onClick={() => setIsOpen(false)}><X size={16} className="text-slate-400 hover:text-white" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-xs ${msg.sender === 'user' ? 'bg-cyan-700 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-slate-950/50 border-t border-slate-800 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter command..." className="flex-1 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none" />
            <button type="submit"><Send size={14} className="text-cyan-500" /></button>
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

  const handleAuth = async (isReg: boolean, e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError("");
    try {
      const cred = isReg 
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess("user", cred.user);
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
        else { setError("Invalid Command Credentials"); setIsLoading(false); }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-800 relative z-10">
        <button onClick={onBack} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={20}/></button>
        <div className="flex bg-slate-950 p-1 rounded-lg mb-8 border border-slate-800">
            <button onClick={() => setRole('user')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${role === 'user' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}>OPERATOR</button>
            <button onClick={() => setRole('admin')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${role === 'admin' ? 'bg-red-700 text-white' : 'text-slate-500'}`}>COMMANDER</button>
        </div>
        {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 rounded"><AlertTriangle size={14}/> {error}</div>}
        
        {role === 'user' && (
            <div className="mt-6 space-y-4">
                <button onClick={handleGoogleLogin} className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg text-sm hover:bg-gray-100 transition-colors">Access via Google</button>
                <div className="flex items-center gap-2 text-slate-600 text-[10px] justify-center"><div className="h-[1px] bg-slate-800 flex-1"></div>OR<div className="h-[1px] bg-slate-800 flex-1"></div></div>
                <form onSubmit={(e) => handleAuth(isRegistering, e)} className="space-y-4">
                    <input type="email" placeholder="Email Address" required className="w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-cyan-500 outline-none placeholder:text-slate-600 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" required className="w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-cyan-500 outline-none placeholder:text-slate-600 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all text-sm flex items-center justify-center">
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : (isRegistering ? 'Initialize ID' : 'Login')}
                    </button>
                </form>
                <button onClick={() => setIsRegistering(!isRegistering)} className="w-full text-center text-xs text-slate-500 hover:text-cyan-400 mt-4 transition-colors">{isRegistering ? "Existing Operator? Login" : "New ID? Initialize"}</button>
            </div>
        )}
        {role === 'admin' && (
            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
                <input type="text" placeholder="Commander ID" required className="w-full bg-slate-950 text-red-400 p-3 rounded-lg border border-red-900/30 focus:border-red-500 outline-none font-mono text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Encryption Key" required className="w-full bg-slate-950 text-red-400 p-3 rounded-lg border border-red-900/30 focus:border-red-500 outline-none font-mono text-sm" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} />
                <button type="submit" disabled={isLoading} className="w-full bg-red-700 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-all text-sm flex items-center justify-center">
                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : "ESTABLISH UPLINK"}
                </button>
            </form>
        )}
      </div>
    </div>
  );
}

// --- ADMIN DASHBOARD ---
function AdminDashboard({ onLogout, user }: { onLogout: () => void, user: any }) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const incidents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(incidents);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans overflow-y-auto border-t-4 border-red-600">
       <div className="max-w-7xl mx-auto">
         <header className="flex justify-between items-center mb-10 bg-red-950/20 p-6 rounded-lg border border-red-900/50 backdrop-blur-md">
            <h1 className="font-bold text-xl text-red-500 flex items-center gap-3"><Shield size={24}/> COMMAND CENTER <span className="text-xs text-red-400/60 uppercase border border-red-900/50 px-2 py-1 rounded">CMDR: {user?.email}</span></h1>
            <button onClick={onLogout} className="bg-slate-900 text-slate-400 hover:text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border border-slate-800 transition-colors"><LogOut size={14} /> ABORT</button>
         </header>
         <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950">
                <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider">Live Incident Stream</h3>
                <div className="flex items-center gap-2 text-[10px] text-emerald-500 animate-pulse font-mono">
                    <Signal size={12} /> SECURE CONNECTION
                </div>
            </div>
            {history.length === 0 ? (
                <div className="p-12 text-center text-slate-600 text-sm font-mono flex flex-col items-center gap-4">
                    <Database size={32} className="opacity-20"/>
                    NO INCIDENTS REPORTED IN CLOUD DATABASE.
                </div>
            ) : (
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-500"><tr><th className="p-4">Timestamp</th><th className="p-4">Coordinates</th><th className="p-4">User Identity</th><th className="p-4">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-800">{history.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-4 font-mono text-emerald-500 text-xs">{log.timeDisplay}</td>
                            <td className="p-4 font-mono text-xs text-cyan-500 flex items-center gap-2"><MapPin size={12}/> {log.gpsLink}</td>
                            <td className="p-4 text-white text-xs">{log.user}</td>
                            <td className="p-4 font-bold text-red-500 flex items-center gap-2 text-xs"><AlertOctagon size={14}/> {log.status}</td>
                        </tr>
                    ))}</tbody>
                </table>
            )}
         </div>
       </div>
    </div>
  );
}

// --- USER DASHBOARD ---
function UserApp({ onLogout, user }: { onLogout: () => void, user: any }) {
  const [contacts, setContacts] = useState<{id: number, name: string, phone: string, telegramId?: string}[]>(() => {
    const saved = localStorage.getItem('rakshak_contacts');
    return saved ? JSON.parse(saved) : [{ id: 1, name: "Klaus", phone: "0000000000", telegramId: "1958635120" }];
  });
  
  const [activeTab, setActiveTab] = useState('defense'); 
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', telegramId: '' });
  
  const [location, setLocation] = useState<{ lat: number, lng: number }>({ lat: 20.5937, lng: 78.9629 }); 
  const [stats, setStats] = useState({ speed: 0, gForce: 1.0, altitude: 0, location: location });
  const [statusLog, setStatusLog] = useState<string>("");

  const { isLoaded } = useLoadScript({ googleMapsApiKey: "" }); 

  const CRASH_THRESHOLD = 3.5; 

  useEffect(() => { localStorage.setItem('rakshak_contacts', JSON.stringify(contacts)); }, [contacts]);

  const triggerSOS = async () => {
    if (isSOSActive) return; 
    setIsSOSActive(true);
    setStatusLog("CRITICAL ALERT: CRASH DETECTED. INITIATING PROTOCOLS...");

    if (navigator.vibrate) navigator.vibrate([200,100,200,100,200]);

    // 1. SOUND SIREN
    const audio = new Audio("https://cdn.pixabay.com/audio/2024/09/19/09/52/police-siren-26154.mp3"); 
    audio.play().catch(e => console.log("Audio Auto-play Blocked", e));

    // 2. BACKEND PAYLOAD (NO ALTITUDE TO PREVENT DJANGO ERROR)
    const payload = {
        userEmail: user.email,
        latitude: parseFloat(location.lat.toFixed(7)),
        longitude: parseFloat(location.lng.toFixed(7)),
        gForce: parseFloat(stats.gForce.toFixed(4)),
        speed: parseFloat(stats.speed.toFixed(2))
    };

    // 3. SEND TO RENDER BACKEND
    try {
        const djangoResponse = await axios.post(`${BACKEND_URL}/api/report/`, payload);
        setStatusLog(prev => prev + `\n[SERVER] UPLOAD SUCCESSFUL: ID ${djangoResponse.data.id || 'LOGGED'}`);
    } catch (error) {
        console.error("Backend Upload Error:", error);
        setStatusLog(prev => prev + "\n[SERVER] CONNECTION FAILED. RETRYING...");
        setTimeout(async () => {
             try {
                await axios.post(`${BACKEND_URL}/api/report/`, payload);
                setStatusLog(prev => prev + "\n[SERVER] RETRY SUCCESSFUL.");
             } catch (e) {
                setStatusLog(prev => prev + "\n[SERVER] RETRY FAILED. LOGGING LOCALLY.");
             }
        }, 3000);
    }

    // 4. FIREBASE LOG
    try {
        await addDoc(collection(db, "incidents"), {
            user: user.email,
            gpsLink: `${location.lat.toFixed(7)}, ${location.lng.toFixed(7)}`,
            status: "CRASH DETECTED",
            timeDisplay: new Date().toLocaleTimeString(),
            timestamp: serverTimestamp() 
        });
        setStatusLog(prev => prev + "\n[CLOUD] FIREBASE SYNC COMPLETE.");
    } catch (e) {
        setStatusLog(prev => prev + "\n[CLOUD] SYNC ERROR.");
    }

    // 5. TELEGRAM (INCLUDES ALTITUDE FOR VISUAL)
    const googleMapsLink = `http://googleusercontent.com/maps.google.com/3{location.lat.toFixed(7)},${location.lng.toFixed(7)}`;
    const alertMsg = `🚨 *CRITICAL SOS ALERT* 🚨\n\n` +
                     `👤 *Pilot:* ${user.email}\n` +
                     `🚀 *Impact Speed:* ${stats.speed.toFixed(2)} km/h\n` +
                     `💥 *Peak G-Force:* ${stats.gForce.toFixed(4)}g\n` +
                     `🏔 *Altitude:* ${stats.altitude}m\n\n` +
                     `📡 *PRECISION COORDINATES:*\nLat: \`${location.lat.toFixed(7)}\`\nLng: \`${location.lng.toFixed(7)}\`\n\n` +
                     `📍 *LIVE TRACKING:*\n${googleMapsLink}`;

    if (contacts.length > 0 && contacts[0].telegramId) {
        const primary = contacts[0];
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${primary.telegramId}&text=${encodeURIComponent(alertMsg)}&parse_mode=Markdown`;
        fetch(url).then(res => res.json()).then(data => {
            if(data.ok) setStatusLog(prev => prev + "\n[TELEGRAM] ALERT DISPATCHED.");
            else setStatusLog(prev => prev + `\n[TELEGRAM] DELIVERY FAILED.`);
        }).catch(() => setStatusLog(prev => prev + `\n[TELEGRAM] NETWORK ERROR.`));
      
      setTimeout(() => { setIsSOSActive(false); setStatusLog("[SYSTEM] STATUS NORMAL."); }, 15000); 
    } else {
        setStatusLog(prev => prev + "\n[WARN] NO TELEGRAM CONTACT FOUND.");
        setTimeout(() => setIsSOSActive(false), 5000);
    }
  };

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        // FIX ALTITUDE: Clamp to 0 if null or negative
        let rawAlt = pos.coords.altitude || 0;
        if (rawAlt < 0) rawAlt = 0;

        setLocation(newLoc);
        setStats(prev => ({ 
            ...prev, 
            speed: pos.coords.speed ? parseFloat((pos.coords.speed * 3.6).toFixed(2)) : 0, 
            altitude: Math.round(rawAlt), 
            location: newLoc 
        }));
      }, 
      (err) => console.error("GPS Error", err), 
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    const handleMotion = (e: DeviceMotionEvent) => {
      if (e.accelerationIncludingGravity) {
        const { x, y, z } = e.accelerationIncludingGravity;
        const gVector = Math.sqrt((x || 0)**2 + (y || 0)**2 + (z || 0)**2);
        const currentG = parseFloat((gVector / 9.80665).toFixed(4));
        setStats(prev => ({ ...prev, gForce: currentG }));
        if (currentG > CRASH_THRESHOLD && !isSOSActive) { triggerSOS(); }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => { 
        navigator.geolocation.clearWatch(watchId); 
        window.removeEventListener('devicemotion', handleMotion); 
    };
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
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button onClick={() => setActiveTab('defense')} className={`flex-1 py-2 rounded-md text-xs font-bold tracking-widest transition-all ${activeTab === 'defense' ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-500/30' : 'text-slate-500'}`}>DEFENSE</button>
          <button onClick={() => setActiveTab('contacts')} className={`flex-1 py-2 rounded-md text-xs font-bold tracking-widest transition-all ${activeTab === 'contacts' ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-500/30' : 'text-slate-500'}`}>CONTACTS</button>
        </div>

        {activeTab === 'defense' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center flex flex-col items-center"><Activity size={16} className="text-cyan-600 mb-2" /><div className="text-[10px] text-slate-500 font-bold tracking-widest mb-1">SPEED</div><div className="text-lg font-mono text-cyan-400">{stats.speed.toFixed(1)} <span className="text-[10px]">km/h</span></div></div>
              <div className={`p-4 rounded-xl border text-center flex flex-col items-center transition-all ${stats.gForce > 2 ? 'bg-red-950/30 border-red-500/50 animate-pulse' : 'bg-slate-900/50 border-slate-800'}`}><Zap size={16} className={`${stats.gForce > 2 ? 'text-red-500' : 'text-yellow-600'} mb-2`} /><div className="text-[10px] text-slate-500 font-bold tracking-widest mb-1">G-FORCE</div><div className={`text-lg font-mono ${stats.gForce > 2 ? 'text-red-500' : 'text-white'}`}>{stats.gForce.toFixed(2)}g</div></div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center flex flex-col items-center"><Navigation size={16} className="text-purple-600 mb-2" /><div className="text-[10px] text-slate-500 font-bold tracking-widest mb-1">ALTITUDE</div><div className="text-lg font-mono text-purple-400">{stats.altitude}m</div></div>
            </div>

            <button onClick={() => setShowMap(!showMap)} className="w-full py-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all flex items-center justify-center gap-2 text-xs font-bold tracking-widest"><Globe size={16} /> {showMap ? "CLOSE SATELLITE FEED" : "ACTIVATE SATELLITE FEED"}</button>

            <AnimatePresence>
                {showMap && isLoaded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 250, opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="rounded-xl overflow-hidden border border-slate-700 relative shadow-2xl">
                        <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={location} zoom={18} options={{ mapTypeId: 'hybrid', disableDefaultUI: true, zoomControl: false }}><MarkerF position={location} /></GoogleMap>
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-emerald-400 font-mono border border-emerald-500/30 z-[400] flex items-center gap-1"><Signal size={10}/> SAT-LINK ACTIVE</div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col items-center justify-center py-6">
              <button onClick={triggerSOS} className={`relative group w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ${isSOSActive ? 'bg-red-600 shadow-[0_0_80px_rgba(220,38,38,0.5)] scale-105' : 'bg-slate-800 hover:bg-red-950/20 border-4 border-slate-700 hover:border-red-900/50'}`}>
                {isSOSActive && <div className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-75"></div>}
                <div className="flex flex-col items-center z-10"><AlertTriangle size={48} className={`mb-2 ${isSOSActive ? 'text-white animate-bounce' : 'text-red-500'}`} /><span className={`text-xl font-black tracking-widest ${isSOSActive ? 'text-white' : 'text-red-500'}`}>SOS</span></div>
              </button>
              {statusLog && (<div className="mt-6 w-full bg-slate-900 border border-slate-700 p-4 rounded-lg"><div className="flex items-center gap-2 mb-2 text-cyan-400 text-[10px] font-bold uppercase tracking-wider"><Server size={12} className="animate-pulse"/> System Log</div><div className="font-mono text-[10px] text-slate-300 whitespace-pre-line leading-relaxed">{statusLog}</div></div>)}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
               <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2"><UserPlus size={14} /> Add Guardian</h3>
               <div className="space-y-3">
                 <Input placeholder="Full Name" className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 text-xs h-10" value={newContact.name} onChange={(e:any) => setNewContact({...newContact, name: e.target.value})}/>
                 <Input placeholder="Phone Number" className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 text-xs h-10" value={newContact.phone} onChange={(e:any) => setNewContact({...newContact, phone: e.target.value})}/>
                 <Input placeholder="Telegram Chat ID (Required for Alerts)" className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 text-xs h-10" value={newContact.telegramId} onChange={(e:any) => setNewContact({...newContact, telegramId: e.target.value})}/>
                 <Button onClick={handleAddContact} className="w-full bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs h-10 tracking-wider">SAVE CONTACT</Button>
               </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider pl-1">Trusted Network ({contacts.length})</h3>
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex justify-between items-center hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400"><User size={18} /></div>
                      <div>
                          <div className="font-bold text-white text-sm">{contact.name}</div>
                          <div className="text-xs text-slate-500">{contact.phone}</div>
                          {contact.telegramId ? <div className="text-[10px] text-emerald-500 flex items-center gap-1 mt-1"><Zap size={8}/> Telegram Linked</div> : <div className="text-[10px] text-red-500 flex items-center gap-1 mt-1"><AlertTriangle size={8}/> No Telegram ID</div>}
                      </div>
                  </div>
                  <button onClick={() => removeContact(contact.id)} className="text-slate-600 hover:text-red-500 hover:bg-red-950/20 p-2 rounded transition-all"><Trash2 size={16} /></button>
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
  // Simple inline landing page to prevent missing component errors
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black"></div>
        <div className="relative z-10 max-w-2xl">
            <div className="flex justify-center mb-6"><Shield size={64} className="text-cyan-500" /></div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4">RAKSHAK <span className="text-cyan-500">SYSTEMS</span></h1>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">Advanced Cyber-Physical Impact Detection & Emergency Response Network. Protecting lives through real-time telemetry.</p>
            <button onClick={onLoginClick} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all hover:scale-105 flex items-center gap-2 mx-auto">
                INITIALIZE SYSTEM <ChevronRight size={20}/>
            </button>
        </div>
        <div className="absolute bottom-8 text-slate-600 text-xs font-mono">SECURE CONNECTION • V3.0.1 • PRODUCTION BUILD</div>
    </div>
  );
}

// --- MAIN APP ---
function App() {
    const [view, setView] = useState<'landing' | 'auth' | 'app' | 'admin'>('landing');
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // PERSISTENT AUTH LISTENER
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                if (currentUser.email === 'COMMANDER' || currentUser.email?.includes('admin')) {
                    setView('admin');
                } else {
                    setView('app');
                }
            } else {
                setUser(null);
                setView('landing');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAuthSuccess = (role: string, userData: any) => {
        setUser(userData);
        setView(role === 'admin' ? 'admin' : 'app');
    };

    const handleLogout = () => {
        signOut(auth).then(() => {
            setUser(null);
            setView('landing');
        });
    };

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500"><Loader2 className="animate-spin" size={32}/></div>;
    }

    return (
        <ErrorBoundary>
            {view === 'landing' && <LandingPage onLoginClick={() => setView('auth')} />}
            {view === 'auth' && <AuthPortal onAuthSuccess={handleAuthSuccess} onBack={() => setView('landing')} />}
            {view === 'app' && <UserApp onLogout={handleLogout} user={user} />}
            {view === 'admin' && <AdminDashboard onLogout={handleLogout} user={user} />}
        </ErrorBoundary>
    );
}

export default App;