import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { 
  getAuth, signInWithPopup, GoogleAuthProvider, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  sendEmailVerification, signOut, onAuthStateChanged} from "firebase/auth";
import { 
  AlertTriangle, Shield, Zap, 
  Cpu, Key, Loader2, Mail, User, Lock, MessageSquare, X, Send, LogOut, UserPlus, Trash2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet'; 
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

// --- FIREBASE CONFIGURATION ---
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

// --- CONFIG ---
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

// --- RAKSHAK BOT ---
function RakshakBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Rakshak Neural Link Established.' }]);
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
      let reply = "Processing data... Query not recognized.";
      const lower = userText.toLowerCase();
      if (lower.includes('admin')) reply = "Admin access requires Commander Level 5 clearance.";
      else if (lower.includes('sos')) reply = "SOS Protocol triggers instant cloud dispatch to emergency contacts.";
      else if (lower.includes('hi') || lower.includes('hello')) reply = "Greetings. Rakshak Systems operational.";
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="group relative flex items-center justify-center w-16 h-16 bg-cyan-500 hover:bg-cyan-400 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all hover:scale-110">
          <MessageSquare size={32} className="text-slate-900" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-800 border border-slate-700 text-slate-300 rounded-bl-none'}`}>
                    {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[10px] text-cyan-500/70 animate-pulse pl-2">Computing...</div>}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-slate-950/50 border-t border-slate-800 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter command..." className="flex-1 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none transition-all" />
            <button type="submit" className="text-cyan-500 hover:text-white transition-colors"><Send size={16} /></button>
          </form>
        </div>
      )}
    </div>
  );
}

// --- AUTH PORTAL ---
function AuthPortal({ onAuthSuccess, onBack }: { onAuthSuccess: (role: string, data: any) => void, onBack: () => void }) {
  const [role, setRole] = useState('user'); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminKey, setAdminKey] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setIsRegistering(false); await signOut(auth); 
    } catch (err: any) { setError(err.message.replace("Firebase:", "").trim()); } 
    finally { setIsLoading(false); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) throw new Error("Email not verified.");
      onAuthSuccess("user", userCredential.user);
    } catch (err: any) { setError(err.message.replace("Firebase:", "").trim()); } 
    finally { setIsLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onAuthSuccess("user", result.user);
    } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
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

// --- HELPER COMPONENT ---
interface StatBoxProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

function StatBox({ label, value, icon }: StatBoxProps) { 
  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
      <div className="p-3 bg-slate-950 rounded-xl">{icon}</div>
      <div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-xs font-bold text-slate-500 uppercase">{label}</div>
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
         
         <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatBox label="System Load" value="12%" icon={<Cpu className="text-blue-500"/>} />
            <StatBox label="Total Alerts" value={history.length} icon={<AlertTriangle className="text-yellow-500"/>} />
            <StatBox label="Encryption" value="AES-256" icon={<Key className="text-emerald-500"/>} />
            <StatBox label="Latency" value="24ms" icon={<Zap className="text-purple-500"/>} />
         </div>

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

// --- USER DASHBOARD (MERGED: MAP + SENSORS + CONTACTS) ---
function UserApp({ onLogout }: { onLogout: () => void, user: any }) {
  // 1. CONTACTS STATE (Persisted)
  const [contacts, setContacts] = useState<{id: number, name: string, phone: string}[]>(() => {
    const saved = localStorage.getItem('rakshak_contacts');
    return saved ? JSON.parse(saved) : [];
  });
  
  // 2. SENSOR STATE (Restored)
  const [activeTab, setActiveTab] = useState('defense'); 
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [location, setLocation] = useState<[number, number]>([20.5937, 78.9629]); // Default India
  const [stats, setStats] = useState({ speed: 0, gForce: 1.0, altitude: 0 });

  // 3. EFFECT: SAVE CONTACTS
  useEffect(() => {
    localStorage.setItem('rakshak_contacts', JSON.stringify(contacts));
  }, [contacts]);

  // 4. EFFECT: GET REAL LOCATION & SENSORS
  useEffect(() => {
    // GPS Tracker
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
        setStats(prev => ({
          ...prev,
          speed: pos.coords.speed ? (pos.coords.speed * 3.6) : 0, // Convert m/s to km/h
          altitude: pos.coords.altitude || 0
        }));
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    // Accelerometer (G-Force)
    const handleMotion = (e: DeviceMotionEvent) => {
      if (e.accelerationIncludingGravity) {
        const { x, y, z } = e.accelerationIncludingGravity;
        // Calculate total G-Force magnitude
        const g = Math.sqrt((x || 0)**2 + (y || 0)**2 + (z || 0)**2) / 9.8;
        setStats(prev => ({ ...prev, gForce: parseFloat(g.toFixed(2)) }));
      }
    };
    window.addEventListener('devicemotion', handleMotion);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  // Contact Handlers
  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, { id: Date.now(), name: newContact.name, phone: newContact.phone }]);
      setNewContact({ name: '', phone: '' });
    }
  };
  const removeContact = (id: number) => setContacts(contacts.filter(c => c.id !== id));

  return (
    <div className="min-h-screen bg-black text-gray-200 pb-20">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Shield className="text-cyan-500 w-6 h-6" />
            <span className="font-bold text-lg tracking-wider">RAKSHAK</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout} className="text-slate-400">
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-6">
        
        {/* TABS */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('defense')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'defense' ? 'bg-cyan-950 text-cyan-400' : 'text-slate-500'}`}
          >
            DEFENSE PROTOCOL
          </button>
          <button 
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'contacts' ? 'bg-cyan-950 text-cyan-400' : 'text-slate-500'}`}
          >
            CONTACTS
          </button>
        </div>

        {/* --- VIEW 1: DEFENSE (Map + Sensors + SOS) --- */}
        {activeTab === 'defense' && (
          <div className="space-y-4">
            
            {/* LIVE SENSOR DASHBOARD (Restored) */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-500 font-bold">SPEED</div>
                <div className="text-xl font-mono text-cyan-400">{stats.speed.toFixed(0)} <span className="text-xs">km/h</span></div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-500 font-bold">G-FORCE</div>
                <div className={`text-xl font-mono ${stats.gForce > 2 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                  {stats.gForce}g
                </div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-500 font-bold">ALTITUDE</div>
                <div className="text-xl font-mono text-purple-400">{stats.altitude.toFixed(0)}m</div>
              </div>
            </div>

            {/* MAP (Restored) */}
            <div className="h-64 rounded-2xl overflow-hidden border border-slate-700 relative z-0">
               {/* @ts-ignore */}
               <MapContainer center={location} zoom={15} style={{ height: "100%", width: "100%" }}>
                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                 {/* @ts-ignore */}
                 <Marker position={location} icon={new Icon({iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41]})}>
                   <Popup>Your Live Location</Popup>
                 </Marker>
               </MapContainer>
            </div>

            {/* SOS BUTTON */}
            <div className="flex flex-col items-center justify-center py-4">
              <button
                onClick={() => setIsSOSActive(!isSOSActive)}
                className={`relative group w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${isSOSActive ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.6)]' : 'bg-slate-800 hover:bg-red-900/30 border-4 border-slate-700 hover:border-red-500/50'}`}
              >
                <div className={`absolute inset-0 rounded-full border-2 border-dashed border-white/20 animate-[spin_10s_linear_infinite] ${isSOSActive ? 'opacity-100' : 'opacity-0'}`} />
                <div className="flex flex-col items-center">
                  <AlertTriangle size={32} className={`mb-1 ${isSOSActive ? 'text-white animate-bounce' : 'text-red-500'}`} />
                  <span className={`text-xl font-black tracking-widest ${isSOSActive ? 'text-white' : 'text-red-500'}`}>SOS</span>
                </div>
              </button>
              <p className="mt-4 text-slate-500 text-xs font-mono text-center">
                {isSOSActive ? "TRANSMITTING DISTRESS SIGNAL..." : "TAP TO ACTIVATE EMERGENCY BEACON"}
              </p>
            </div>
          </div>
        )}

        {/* --- VIEW 2: CONTACTS (Kept Safe) --- */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
               <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                 <UserPlus size={16} /> Add Guardian
               </h3>
               <div className="space-y-2">
                 <Input 
                   placeholder="Guardian Name" 
                   className="bg-slate-950 border-slate-800 text-white"
                   value={newContact.name}
                   onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                 />
                 <Input 
                   placeholder="Phone Number" 
                   className="bg-slate-950 border-slate-800 text-white"
                   value={newContact.phone}
                   onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                 />
                 <Button onClick={handleAddContact} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                   SAVE CONTACT
                 </Button>
               </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider pl-1">
                Your Trusted Network ({contacts.length})
              </h3>
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-white">{contact.name}</div>
                      <div className="text-xs text-slate-400">{contact.phone}</div>
                    </div>
                  </div>
                  <button onClick={() => removeContact(contact.id)} className="text-red-500 hover:bg-red-950/30 p-2 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Helper Bot */}
      <RakshakBot />
    </div>
  );
}

// --- VISUAL LANDING PAGE ---
function LandingPage({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <div className="min-h-screen bg-black">
      <Header onLoginClick={onLoginClick} />
      <main className="pt-16">
        <Hero />
        <Features />
        <InteractiveDemo />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

// --- MAIN APP (PERSISTENT LOGIN FIX) ---
function App() {
  const [view, setView] = useState('landing'); 
  const [user, setUser] = useState<any>(null); // Changed type to 'any' to handle the Commander object
  const [isAuthChecking, setIsAuthChecking] = useState(true); 

  useEffect(() => {
    const checkLogin = async () => {
      // 1. CHECK FOR COMMANDER (The "Secret" Login)
      const localRole = localStorage.getItem('rakshak_role');
      
      if (localRole === 'admin') {
        // Manually restore the Commander session
        setUser({ email: "COMMANDER", uid: "admin-local" });
        setView('admin');
        setIsAuthChecking(false);
        return; // Stop here, we are done
      }

      // 2. CHECK FOR FIREBASE USERS (Regular People)
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setView('user');
        } else {
          // Only go to landing if we aren't already an admin
          if (localRole !== 'admin') {
            setView('landing');
          }
        }
        setIsAuthChecking(false);
      });
      return () => unsubscribe();
    };

    checkLogin();
  }, []);

  // UPDATED: Save to Local Storage when logging in
  const handleAuthSuccess = (role: string, userData: any) => { 
    if (role === 'admin') {
      localStorage.setItem('rakshak_role', 'admin');
    }
    setUser(userData); 
    setView(role); 
  };

  // UPDATED: Clear Local Storage when logging out
  const handleLogout = async () => { 
    localStorage.removeItem('rakshak_role'); // Forget the commander
    if(auth) await signOut(auth); 
    setUser(null); 
    setView('landing'); 
  };

  if (isAuthChecking) {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-cyan-500 w-12 h-12" />
            <div className="text-cyan-500 font-mono text-sm tracking-[0.2em] animate-pulse">
                ESTABLISHING SECURE UPLINK...
            </div>
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