import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  MessageSquare, 
  Settings, 
  Folder, 
  Battery, 
  Wifi, 
  Signal, 
  X, 
  Minus, 
  Maximize2, 
  Send,
  User,
  Bot,
  Terminal,
  Search,
  LayoutGrid,
  Calendar,
  Clock,
  Music,
  Camera,
  Mail,
  Phone,
  Globe,
  Menu,
  ChevronRight,
  Bell,
  Moon,
  Sun,
  Volume2
} from 'lucide-react';
import { chatWithGemini } from './services/geminiService';

// --- Types ---

interface WindowState {
  id: string;
  title: string;
  icon: any;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

// --- Components ---

const Logo = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <motion.div 
    className={`relative flex items-center justify-center ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-0 bg-orange-500 rounded-xl rotate-45 blur-sm opacity-50" />
    <div className="relative w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
      <div className="w-1/2 h-1/2 bg-white rounded-full opacity-20 blur-[2px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1/3 h-1/3 border-2 border-white/40 rounded-full" />
      </div>
    </div>
  </motion.div>
);

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Cinematic Glow */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.3 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[80vw] h-[80vw] bg-orange-500/20 blur-[150px] rounded-full"
      />
      
      <div className="relative flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ 
            duration: 1.5, 
            ease: [0.23, 1, 0.32, 1],
            delay: 0.5 
          }}
        >
          <Logo size={120} />
        </motion.div>
        
        <div className="flex flex-col items-center gap-2">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-4xl font-bold tracking-[0.3em] uppercase text-white"
          >
            Orange <span className="text-orange-500">AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="text-[10px] uppercase tracking-[0.5em] font-medium"
          >
            Intelligence Redefined
          </motion.p>
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-[2px] bg-white/10 rounded-full mt-8 overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 2, 
              ease: "easeInOut",
              delay: 2,
              onComplete: () => setTimeout(onComplete, 500)
            }}
            className="w-full h-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"
          />
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 3 }}
        className="absolute bottom-12 text-[10px] font-mono tracking-widest uppercase"
      >
        System Boot Sequence v2.4.0
      </motion.div>
    </motion.div>
  );
};

interface WindowProps {
  id: string;
  title: string; 
  icon: any; 
  onClose: () => void; 
  onMinimize: () => void; 
  children: React.ReactNode; 
  zIndex: number;
  onFocus: () => void;
  key?: React.Key;
}

const Window = ({ 
  title, 
  icon: Icon, 
  onClose, 
  onMinimize, 
  children, 
  zIndex, 
  onFocus 
}: WindowProps) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      drag
      dragMomentum={false}
      onPointerDown={onFocus}
      className="absolute w-full h-full md:w-[600px] md:h-[500px] md:rounded-2xl glass overflow-hidden flex flex-col top-0 left-0 md:top-auto md:left-auto"
      style={{ zIndex }}
    >
      {/* Window Header */}
      <div className="h-12 flex items-center justify-between px-4 bg-white/5 border-b border-white/10 cursor-move">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
            <Icon size={16} />
          </div>
          <span className="text-sm font-medium text-white/80">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onMinimize}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <Minus size={16} />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </motion.div>
  );
};

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am Orange AI. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await chatWithGemini(userMsg, history);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Sorry, I encountered an error.' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`p-2 rounded-xl ${msg.role === 'user' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/90'}`}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-orange-500/10 text-orange-100' : 'bg-white/5 text-white/80'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-white/40 text-xs animate-pulse">
            <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
            <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
            <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
            <span>Orange AI is thinking...</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Orange AI anything..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="p-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 rounded-xl transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

const SystemInfo = () => {
  const stats = [
    { label: 'CPU Usage', value: '12%', icon: Cpu, color: 'text-blue-400' },
    { label: 'Memory', value: '4.2 GB / 16 GB', icon: LayoutGrid, color: 'text-purple-400' },
    { label: 'Battery', value: '84%', icon: Battery, color: 'text-green-400' },
    { label: 'Storage', value: '128 GB / 512 GB', icon: Folder, color: 'text-orange-400' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
          <div className={`p-2 rounded-lg bg-white/5 w-fit ${stat.color}`}>
            <stat.icon size={20} />
          </div>
          <div>
            <div className="text-xs text-white/40 uppercase tracking-wider font-semibold">{stat.label}</div>
            <div className="text-lg font-medium text-white/90">{stat.value}</div>
          </div>
        </div>
      ))}
      <div className="col-span-2 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
        <div className="text-xs text-white/40 uppercase tracking-wider font-semibold">System Status</div>
        <div className="flex items-center gap-2 text-sm text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          All systems operational
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [time, setTime] = useState(new Date());
  const [isBooting, setIsBooting] = useState(true);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'ai', title: 'Orange AI', icon: MessageSquare, isOpen: true, isMinimized: false, zIndex: 10 },
    { id: 'system', title: 'System Status', icon: Cpu, isOpen: false, isMinimized: false, zIndex: 1 },
    { id: 'settings', title: 'Settings', icon: Settings, isOpen: false, isMinimized: false, zIndex: 1 },
    { id: 'files', title: 'Files', icon: Folder, isOpen: false, isMinimized: false, zIndex: 1 },
  ]);
  const [maxZIndex, setMaxZIndex] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleWindow = (id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        if (!w.isOpen) {
          const newZ = maxZIndex + 1;
          setMaxZIndex(newZ);
          return { ...w, isOpen: true, isMinimized: false, zIndex: newZ };
        }
        if (w.isMinimized) {
          const newZ = maxZIndex + 1;
          setMaxZIndex(newZ);
          return { ...w, isMinimized: false, zIndex: newZ };
        }
        return { ...w, isMinimized: true };
      }
      return w;
    }));
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const focusWindow = (id: string) => {
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col">
      <AnimatePresence>
        {isBooting && <SplashScreen onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>

      {/* Background Wallpaper */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-purple-900/40 to-black" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
      </div>

      {/* Top Bar */}
      <div className="relative z-50 h-12 md:h-10 px-4 md:px-6 flex items-center justify-between glass-dark border-none rounded-none">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => setIsSidePanelOpen(true)}
            className="p-2 rounded-xl hover:bg-white/10 text-white/80 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span className="text-xs font-bold tracking-widest uppercase hidden sm:inline">Orange OS</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-3 text-white/60">
            <Search size={14} className="hover:text-white transition-colors cursor-pointer" />
            <LayoutGrid size={14} className="hover:text-white transition-colors cursor-pointer hidden sm:block" />
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex items-center gap-2 md:gap-3 text-white/60">
            <Signal size={14} className="hidden xs:block" />
            <Wifi size={14} />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-medium">84%</span>
              <Battery size={14} />
            </div>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2 text-xs font-medium text-white/80">
            <span className="hidden sm:inline">{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <span>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {isSidePanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidePanelOpen(false)}
              className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-[280px] z-[70] glass-dark border-r border-white/10 flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Logo size={40} />
                  <div>
                    <div className="text-sm font-bold">Admin User</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">Pro Edition</div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSidePanelOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                <section>
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 px-2">Quick Controls</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: Wifi, label: 'Wi-Fi', active: true },
                      { icon: Signal, label: 'Mobile', active: true },
                      { icon: Moon, label: 'Focus', active: false },
                      { icon: Volume2, label: 'Sound', active: true },
                    ].map((ctrl, i) => (
                      <button key={i} className={`p-3 rounded-2xl flex flex-col gap-2 items-start transition-all ${ctrl.active ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                        <ctrl.icon size={18} />
                        <span className="text-[10px] font-medium">{ctrl.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 px-2">Notifications</div>
                  <div className="flex flex-col gap-2">
                    {[
                      { icon: Bell, title: 'System Update', time: '2m ago', desc: 'Version 2.4.0 is ready to install.' },
                      { icon: Mail, title: 'New Message', time: '15m ago', desc: 'Orange AI has a new suggestion.' },
                    ].map((notif, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <notif.icon size={12} className="text-orange-400" />
                            <span className="text-xs font-bold">{notif.title}</span>
                          </div>
                          <span className="text-[10px] text-white/30">{notif.time}</span>
                        </div>
                        <p className="text-[10px] text-white/50 leading-relaxed">{notif.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 px-2">Shortcuts</div>
                  <div className="flex flex-col gap-1">
                    {['Cloud Sync', 'Battery Saver', 'Privacy Report', 'System Logs'].map((item, i) => (
                      <button key={i} className="w-full p-3 rounded-xl hover:bg-white/5 flex items-center justify-between group text-white/60 hover:text-white transition-all">
                        <span className="text-xs">{item}</span>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-6 border-t border-white/10 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2 text-white/40">
                  <Settings size={14} />
                  <span className="text-[10px] font-medium uppercase tracking-wider">OS Settings</span>
                </div>
                <div className="text-[10px] text-white/20 font-mono">v2.4.0-stable</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Area */}
      <main className="relative flex-1 p-6 z-10 flex items-center justify-center">
        <AnimatePresence>
          {windows.map(w => w.isOpen && !w.isMinimized && (
            <Window 
              key={w.id}
              id={w.id}
              title={w.title}
              icon={w.icon}
              zIndex={w.zIndex}
              onClose={() => closeWindow(w.id)}
              onMinimize={() => toggleWindow(w.id)}
              onFocus={() => focusWindow(w.id)}
            >
              {w.id === 'ai' && <AIChat />}
              {w.id === 'system' && <SystemInfo />}
              {w.id === 'settings' && (
                <div className="flex flex-col gap-4">
                  <div className="text-sm text-white/60 italic">System settings are currently managed by Orange AI.</div>
                  <div className="grid gap-2">
                    {['Appearance', 'Network', 'Security', 'Privacy', 'About'].map(item => (
                      <div key={item} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between">
                        <span className="text-sm">{item}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {w.id === 'files' && (
                <div className="grid grid-cols-3 gap-4">
                  {['Documents', 'Images', 'Videos', 'Downloads', 'Projects', 'Backups'].map(folder => (
                    <div key={folder} className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
                        <Folder size={32} />
                      </div>
                      <span className="text-xs text-white/60">{folder}</span>
                    </div>
                  ))}
                </div>
              )}
            </Window>
          ))}
        </AnimatePresence>

        {/* Desktop Icons */}
        <div className="absolute top-6 left-6 grid grid-cols-1 gap-6">
          {windows.map(w => (
            <motion.div
              key={w.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleWindow(w.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className={`p-3 rounded-2xl glass transition-all group-hover:bg-white/20 ${w.isOpen && !w.isMinimized ? 'ring-2 ring-orange-500/50' : ''}`}>
                <w.icon size={24} className="text-white/80 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-medium text-white/60 group-hover:text-white drop-shadow-lg">{w.title}</span>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Dock */}
      <div className="relative z-50 h-20 flex items-center justify-center pb-4 px-4">
        <motion.div 
          layout
          className="glass-dark px-2 md:px-4 h-14 rounded-2xl flex items-center gap-1 md:gap-2 border border-white/10 max-w-full overflow-x-auto no-scrollbar"
        >
          {[
            { id: 'ai', icon: MessageSquare, color: 'bg-orange-500' },
            { id: 'system', icon: Cpu, color: 'bg-blue-500' },
            { id: 'files', icon: Folder, color: 'bg-yellow-500' },
            { id: 'mail', icon: Mail, color: 'bg-red-500' },
            { id: 'browser', icon: Globe, color: 'bg-indigo-500' },
            { id: 'music', icon: Music, color: 'bg-pink-500' },
            { id: 'camera', icon: Camera, color: 'bg-slate-500' },
            { id: 'settings', icon: Settings, color: 'bg-gray-500' },
          ].map((app) => (
            <motion.button
              key={app.id}
              whileHover={{ y: -8, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleWindow(app.id)}
              className="relative group p-2 md:p-2.5 rounded-xl transition-all hover:bg-white/10 flex-shrink-0"
            >
              <app.icon size={20} className="text-white/80 group-hover:text-white md:w-[22px] md:h-[22px]" />
              {windows.find(w => w.id === app.id)?.isOpen && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
              
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md glass text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                {app.id.charAt(0).toUpperCase() + app.id.slice(1)}
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
