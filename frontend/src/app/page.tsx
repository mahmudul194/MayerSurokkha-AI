"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Heart, Activity, Shield, User, 
  Menu, Plus, Phone, Bell, CheckCircle2, 
  ChevronRight, Mic, LayoutDashboard, Database,
  ArrowUpRight, Zap, Droplets, Thermometer,
  Stethoscope, Clock, Calendar, Users, AlertTriangle,
  Sparkles, Navigation2, Cloud, Sun, Baby, X, Settings, 
  BookOpen, MapPin, MessageSquare, Languages, Globe2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { translations } from '@/lib/translations';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MayerSurokkhaApp() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showSOS, setShowSOS] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [language, setLanguage] = useState<string>('en');
  const [isOnline, setIsOnline] = useState(true);
  const [prediction, setPrediction] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [targetMotherId, setTargetMotherId] = useState<string | null>(null);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  
  const mainRef = useRef<HTMLDivElement>(null);
  const role = (session?.user as any)?.role || 'MOTHER';
  const t = translations[language] || translations.en;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const savedLang = localStorage.getItem('surokkha_lang');
    if (savedLang) setLanguage(savedLang);
    
    // Intro Animation Sequence
    setTimeout(() => {
      setShowIntro(false);
      if (!savedLang) setShowLangModal(true);
      setIsLoading(false);
    }, 3500);

    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
  }, []);

  const selectLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('surokkha_lang', lang);
    setShowLangModal(false);
  };

  const handlePredict = async (vitals: any) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mother_id: "MS-0842", age: 24, week: 32, ...vitals })
      });
      const data = await res.json();
      setPrediction(data);
      
      // Save to local IndexedDB for Doctor/Worker visibility
      await db.healthRecords.add({
        mother_id: "MS-0842",
        name: session?.user?.name || "Ayesha Begum",
        age: 24,
        week: 32,
        bp_sys: vitals.bp_sys,
        bp_dia: vitals.bp_dia,
        risk_level: data.risk_level,
        risk_score: data.risk_score || 0,
        explanation: data.explanation,
        advice_bn: data.advice_bn,
        timestamp: Date.now(),
        synced: false,
        encrypted_data: db.encrypt(vitals)
      });

      setShowLogModal(false);
    } catch (err) {
      setPrediction({ risk_level: "Medium", explanation: language === 'bn' ? "এআই সিঙ্ক মোড সক্রিয়।" : "Local AI Sync Mode Active." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    import('@/lib/db').then(mod => mod.seedDatabase());
  }, []);

  const handleOnboard = async (data: any) => {
    try {
      await db.healthRecords.add({
        ...data,
        risk_level: 'Low',
        risk_score: 0,
        explanation: 'Initial Registration',
        timestamp: Date.now(),
        synced: false,
        encrypted_data: db.encrypt(data)
      });
      setShowOnboardModal(false);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (!isLoading && mainRef.current) {
      gsap.from(".asymmetric-panel", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
      });
    }
  }, [isLoading, role]);

  if (showIntro) return <IntroAnimation />;
  if (isLoading) return <LoadingScreen />;

  return (
    <div className={cn(
      "min-h-screen bg-[#f8fafc] text-slate-800 font-outfit relative selection:bg-blue-100",
      language === 'bn' && "font-bangla"
    )} ref={mainRef}>
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-100 rounded-full blur-[120px] opacity-40" />
      </div>
      
      {/* Serene Navbar */}
      <nav className="fixed top-0 z-50 w-full px-6 lg:px-12 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between glass-panel rounded-[2rem] px-8 py-4 border-white/50 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200">
              <Heart className="h-6 w-6 text-white fill-white" />
            </div>
            <div className="flex flex-col">
               <span className="text-xl font-black tracking-tight leading-none text-slate-900">MayerSurokkha</span>
               <span className={cn("font-black text-blue-500 uppercase tracking-widest mt-1",
                 language === 'bn' ? "text-[12px]" : "text-[10px]"
               )}>AI Health Core</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <SyncIndicator isOnline={isOnline} language={language} />
            <div className="flex items-center gap-4">
               <button onClick={() => setShowLangModal(true)} className={cn("flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all",
                 language === 'bn' ? "text-[12px]" : "text-[10px]"
               )}>
                  <Languages className="h-4 w-4" /> {language === 'bn' ? 'বাংলা' : 'English'}
               </button>
               <RoleBadge role={role} t={t} language={language} />
               <button onClick={() => signOut()} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
                  <ArrowUpRight className="h-4 w-4" />
               </button>
            </div>
          </div>

          <button onClick={() => setIsSidebarOpen(true)} className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all">
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} t={t} onSignOut={() => signOut()} language={language} onAIChat={() => { setShowAIChat(true); setIsSidebarOpen(false); }} />

      <main className="mx-auto max-w-7xl px-8 pt-36 pb-40 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {role === 'MOTHER' && <MotherView prediction={prediction} onSOS={() => setShowSOS(true)} onLog={() => setShowLogModal(true)} t={t} language={language} />}
            {role === 'DOCTOR' && <DoctorView t={t} language={language} />}
            {role === 'WORKER' && <WorkerView key="worker" t={t} language={language} onQuickLog={(id: string) => { setTargetMotherId(id); setShowLogModal(true); }} onOnboard={() => setShowOnboardModal(true)} />}
            {role === 'ADMIN' && <AdminView t={t} language={language} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showSOS && <SOSModal onClose={() => setShowSOS(false)} t={t} language={language} />}
        {showLogModal && <LogVitalsModal onClose={() => {setShowLogModal(false); setTargetMotherId(null);}} onAnalyze={handlePredict} isAnalyzing={isAnalyzing} t={t} language={language} />}
        {showLangModal && <InitialLanguageModal onSelect={selectLanguage} t={t} language={language} />}
        {showOnboardModal && <OnboardNodeModal onClose={() => setShowOnboardModal(false)} onOnboard={handleOnboard} t={t} language={language} />}
        {showAIChat && <AIChatModal onClose={() => setShowAIChat(false)} t={t} language={language} />}
      </AnimatePresence>

      <MobileNav activeRole={role} onToggleSidebar={() => setIsSidebarOpen(true)} />
    </div>
  );
}

// --- Animation Components ---

function IntroAnimation() {
  return (
    <div className="fixed inset-0 z-[1000] bg-white flex items-center justify-center overflow-hidden">
       <motion.div 
         initial={{ scale: 0.8, opacity: 0 }}
         animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
         transition={{ duration: 2, ease: "easeOut" }}
         className="text-center"
       >
          <div className="relative h-32 w-32 mx-auto mb-12">
             <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute inset-0 bg-blue-500 rounded-full blur-2xl"
             />
             <div className="relative h-full w-full bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-200">
                <Heart className="h-16 w-16 text-white fill-white" />
             </div>
          </div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic"
          >
             MayerSurokkha
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 1.5 }}
            className="h-1 w-full bg-blue-600 mt-6 rounded-full mx-auto max-w-[200px]"
          />
       </motion.div>
    </div>
  );
}

// --- Sub-Components ---

function Sidebar({ isOpen, onClose, t, onSignOut, language, onAIChat }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[101] w-[340px] bg-white p-10 flex flex-col shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-16 px-4">
               <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white fill-white" />
               </div>
               <span className="text-xl font-black tracking-tight text-slate-900 uppercase italic">MayerSurokkha</span>
            </div>

            <div className="space-y-4 flex-1">
               <SidebarItem icon={<LayoutDashboard />} label={t.dashboard} active onClick={onClose} />
               <SidebarItem icon={<Activity />} label={t.health_records} onClick={onClose} />
               <SidebarItem icon={<Calendar />} label={t.anc_schedule} onClick={onClose} />
               <SidebarItem icon={<BookOpen />} label={t.knowledge_base} onClick={onClose} />
               <SidebarItem icon={<MapPin />} label={t.nearby_centers} onClick={onClose} />
               <SidebarItem icon={<MessageSquare />} label={t.ai_chat} onClick={onAIChat} />
            </div>

            <div className="pt-12 border-t border-slate-100 space-y-4">
               <SidebarItem icon={<Settings />} label="Settings" />
               <button onClick={onSignOut} className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-black text-sm uppercase tracking-widest">
                  <X className="h-5 w-5" /> {t.terminate_session}
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={cn(
      "w-full flex items-center gap-5 p-4 rounded-2xl transition-all font-black text-sm uppercase tracking-widest group text-left",
      active ? "bg-blue-600 text-white shadow-xl shadow-blue-100" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
    )}>
      <div className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "text-slate-300 group-hover:text-blue-500")}>{icon}</div>
      {label}
    </button>
  );
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="relative h-20 w-20 mx-auto mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-blue-50 animate-ping" />
          <div className="relative flex h-full w-full items-center justify-center bg-white rounded-full border border-blue-100 shadow-xl">
            <Heart className="h-8 w-8 text-blue-500 fill-blue-500" />
          </div>
        </motion.div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 italic uppercase">Surokkha</h1>
        <p className={cn(
          "mt-2 text-slate-400 font-black uppercase tracking-[0.3em]",
          language === 'bn' ? "text-[12px]" : "text-[10px]"
        )}>{language === 'bn' ? "নিওরাল সিঙ্কিং..." : "Nexus Initializing..."}</p>
      </div>
    </div>
  );
}

function SyncIndicator({ isOnline, language }: { isOnline: boolean, language: string }) {
  return (
    <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm">
      <div className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_10px]", isOnline ? "bg-green-500 shadow-green-200" : "bg-red-500 shadow-red-200")} />
      <span className={cn(
        "font-black uppercase tracking-widest text-slate-500",
        language === 'bn' ? "text-[11px]" : "text-[9px]"
      )}>
        {isOnline ? (language === 'bn' ? "নিওরাল সিঙ্ক সক্রিয়" : "Neural Sync Active") : (language === 'bn' ? "লোকাল মোড" : "Local Vault Mode")}
      </span>
    </div>
  );
}

function RoleBadge({ role, t, language }: { role: string, t: any, language: string }) {
  const colors = {
    MOTHER: "text-blue-600 bg-blue-50 border-blue-100 shadow-blue-50",
    DOCTOR: "text-pink-600 bg-pink-50 border-pink-100 shadow-pink-50",
    WORKER: "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-50",
    ADMIN: "text-slate-600 bg-slate-50 border-slate-100 shadow-slate-50"
  };
  const roleLabels: any = { MOTHER: t.mother, DOCTOR: t.doctor, WORKER: t.worker, ADMIN: t.admin };
  return (
    <div className={cn(
      "px-5 py-2 rounded-full border font-black tracking-widest uppercase shadow-xs", 
      colors[role as keyof typeof colors],
      language === 'bn' ? "text-[11px]" : "text-[9px]"
    )}>
       {roleLabels[role] || role} Perspective
    </div>
  );
}

function MotherView({ prediction, onSOS, onLog, t, language }: any) {
  const { data: session } = useSession();
  const records = useLiveQuery(() => 
    db.healthRecords.where('mother_id').equals("MS-0842").toArray()
  );
  
  const latestRecord = records?.[records.length - 1];
  const currentWeek = latestRecord?.week || 28;
  const risk = prediction?.risk_level || latestRecord?.risk_level || "Low";

  const growthStages: any = {
    16: { name: language === 'bn' ? "আভাকাডো" : "Avocado", icon: <Droplets className="h-6 w-6" /> },
    20: { name: language === 'bn' ? "কলা" : "Banana", icon: <Sun className="h-6 w-6" /> },
    24: { name: language === 'bn' ? "ভুট্টা" : "Corn", icon: <Zap className="h-6 w-6" /> },
    28: { name: language === 'bn' ? "বেগুন" : "Eggplant", icon: <Baby className="h-6 w-6" /> },
    32: { name: language === 'bn' ? "কুমড়া" : "Squash", icon: <Activity className="h-6 w-6" /> },
    36: { name: language === 'bn' ? "পেঁপে" : "Papaya", icon: <Heart className="h-6 w-6" /> },
  };

  const currentGrowth = growthStages[currentWeek] || growthStages[28];

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="asymmetric-panel lg:col-span-8 bg-linear-to-br from-blue-600 to-indigo-700 p-16 relative overflow-hidden group">
           <div className="relative z-10 flex flex-col justify-between h-full text-white">
              <div>
                 <div className={cn("inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-white font-black uppercase tracking-widest mb-8",
                   language === 'bn' ? "text-[12px]" : "text-[10px]"
                 )}>
                    <Sun className="h-4 w-4" /> {language === 'bn' ? `শুভেচ্ছা • সপ্তাহ ${currentWeek}` : `Nexus Greeting • Week ${currentWeek}`}
                 </div>
                 <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tighter">
                    {language === 'bn' ? "আপনার যাত্রা," : "Your Journey,"} <br/> 
                    {language === 'bn' ? "সম্পূর্ণ সুরক্ষিত।" : "Fully Protected."}
                 </h2>
                 <p className="mt-8 text-blue-50 text-xl font-medium opacity-80 max-w-sm leading-relaxed italic border-l-2 border-white/20 pl-8">
                    {risk === 'High' 
                      ? (language === 'bn' ? "সতর্কতা: আপনার রক্তচাপ বেশি। অনুগ্রহ করে দ্রুত ডাক্তারের পরামর্শ নিন।" : "Warning: Elevated vitals detected. Please consult your physician immediately.")
                      : (language === 'bn' ? "এআই ডায়াগনস্টিকস নিশ্চিত করে যে আপনার গর্ভধারণ চিকিৎসাগতভাবে নিখুঁত।" : "AI diagnostics confirm your gestation is clinically on track.")
                    }
                 </p>
              </div>
              <div className="mt-12 flex gap-6">
                 <div className="bg-white/10 rounded-[2rem] p-8 backdrop-blur-xl border border-white/10 flex-1">
                    <span className={cn("text-blue-100 font-black uppercase tracking-widest opacity-60",
                        language === 'bn' ? "text-[12px]" : "text-[10px]"
                      )}>{language === 'bn' ? "শিশুর বৃদ্ধি" : "Baby Growth"}</span>
                    <div className="mt-2 text-3xl font-bold text-white flex items-center justify-between">{currentGrowth.name} {currentGrowth.icon}</div>
                 </div>
                 <div className="bg-white/10 rounded-[2rem] p-8 backdrop-blur-xl border border-white/10 flex-1">
                    <span className={cn("text-blue-100 font-black uppercase tracking-widest opacity-60",
                        language === 'bn' ? "text-[12px]" : "text-[10px]"
                      )}>{language === 'bn' ? "সম্ভাব্য প্রসবের তারিখ" : "Estimated Delivery"}</span>
                    <div className="mt-2 text-3xl font-bold text-white flex items-center justify-between">{language === 'bn' ? "ফেব্রুয়ারি ১৪" : "Feb 14"} <Heart className="h-6 w-6 text-white/40" /></div>
                 </div>
              </div>
           </div>
           <div className="absolute right-[-40px] bottom-[-40px] opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
              <Baby className="h-96 w-96 text-white fill-white" />
           </div>
        </div>

        <div className={cn(
          "asymmetric-panel lg:col-span-4 p-12 flex flex-col justify-between relative overflow-hidden",
          risk === 'High' ? "bg-red-50 border-red-100 shadow-xl shadow-red-200" : "bg-white shadow-2xl shadow-slate-200/40 border-white"
        )}>
           <div>
              <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-10 shadow-sm", risk === 'High' ? "bg-red-100" : "bg-blue-50")}>
                 <Shield className={cn("h-7 w-7", risk === 'High' ? "text-red-500" : "text-blue-500")} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 leading-tight">{t.diagnostic_summary}</h3>
              <p className="mt-6 text-slate-500 text-base leading-relaxed font-medium">
                 {prediction?.explanation || latestRecord?.explanation || "No recent logs detected. Please use the 'Log Vitals' tool to update your AI diagnostic score."}
              </p>
           </div>
           <div className="mt-10 pt-8 border-t border-slate-100">
              <button className={cn("flex items-center gap-4 font-black text-blue-600 uppercase tracking-[0.2em] hover:bg-blue-50 px-5 py-3 rounded-2xl transition-all w-full justify-between",
                 language === 'bn' ? "text-[12px]" : "text-[10px]"
               )}>
                 {t.audio_advice} <Mic className="h-5 w-5" />
              </button>
           </div>
        </div>
      </div>

      {/* Pregnancy Journey Timeline */}
      <div className="asymmetric-panel bg-white p-12 border-white shadow-2xl shadow-slate-200/30 overflow-hidden">
         <div className="flex items-center justify-between mb-12">
            <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.pregnancy_journey}</h3>
               <p className={cn("font-black text-slate-400 uppercase tracking-widest mt-1",
                 language === 'bn' ? "text-[12px]" : "text-[10px]"
               )}>{language === 'bn' ? "ইন্টারেক্টিভ জেস্টেশন ম্যাপ" : "Interactive Gestation Map"}</p>
            </div>
            <div className={cn("px-6 py-2 bg-blue-50 rounded-full text-blue-600 font-black uppercase tracking-widest border border-blue-100",
              language === 'bn' ? "text-[12px]" : "text-[10px]"
            )}>
               {language === 'bn' ? `বর্তমান: সপ্তাহ ${currentWeek}` : `Current: Week ${currentWeek}`}
            </div>
         </div>
         <div className="relative pt-10 pb-4 overflow-x-auto">
            <div className="flex gap-12 min-w-[1000px] items-center px-4">
               {[16, 20, 24, 28, 32, 36, 40].map((w) => (
                  <div key={w} className={cn(
                    "flex flex-col items-center gap-4 relative transition-all",
                    w === currentWeek ? "scale-125 z-10" : "opacity-40"
                  )}>
                     <div className={cn(
                       "h-16 w-16 rounded-2xl flex items-center justify-center font-black transition-all",
                       w === currentWeek ? "bg-blue-600 text-white shadow-xl shadow-blue-200" : "bg-slate-100 text-slate-400"
                     )}>
                        W{w}
                     </div>
                     <span className={cn("font-black uppercase tracking-widest", 
                        w === currentWeek ? "text-blue-600" : "text-slate-400",
                        language === 'bn' ? "text-[12px]" : "text-[9px]"
                      )}>
                         {w === currentWeek ? (language === 'bn' ? "সক্রিয়" : "Active") : (language === 'bn' ? "মাইলস্টোন" : "Milestone")}
                      </span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-6">
               <VitalBox 
                 icon={<Activity className="text-blue-500" />} 
                 label={t.bp_sys + " / " + t.bp_dia} 
                 value={latestRecord ? `${latestRecord.bp_sys}/${latestRecord.bp_dia}` : "--/--"} 
                 status={latestRecord ? (latestRecord.risk_level === 'Low' ? 'Optimal' : 'Caution') : "No Data"} 
                 color="blue" 
                 language={language} 
               />
               <VitalBox 
                 icon={<Thermometer className="text-pink-500" />} 
                 label={t.temperature} 
                 value={latestRecord ? "98.4 F" : "-- F"} 
                 status="Normal" 
                 color="pink" 
                 language={language} 
               />
            </div>
            <div className="asymmetric-panel bg-white p-10 shadow-xl shadow-slate-200/20 border-white">
               <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Sun className="h-5 w-5 text-amber-500" /> {t.daily_tip}
               </h4>
               <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                  {currentWeek >= 28 
                    ? (language === 'bn' ? '"আপনার শরীর এখন অতিরিক্ত আয়রনের প্রয়োজন বোধ করবে। প্রতিদিনের খাদ্যতালিকায় সবুজ শাকসবজি রাখুন।"' : '"Ensure you\'re consuming extra calcium and iron. At this stage, your baby\'s lungs are beginning to produce surfactant."')
                    : (language === 'bn' ? '"হাইড্রেটেড থাকুন এবং প্রতিদিন অন্তত ৮ গ্লাস জল পান করুন।"' : '"Stay hydrated and ensure you are drinking at least 8 glasses of water daily."')}
               </p>
            </div>

            {/* Health History */}
            <div className="asymmetric-panel bg-white p-10 border-white shadow-xl shadow-slate-200/20">
               <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-500" /> {t.health_records}
               </h4>
               <div className="space-y-6">
                  {records?.slice().reverse().map((record: any) => (
                     <div key={record.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                        <div>
                           <div className="text-sm font-black text-slate-900">BP: {record.bp_sys}/{record.bp_dia}</div>
                           <div className="text-[10px] font-bold text-slate-400 mt-1">
                              {new Date(record.timestamp).toLocaleDateString()} • {language === 'bn' ? `সপ্তাহ ${record.week}` : `Week ${record.week}`}
                           </div>
                        </div>
                        <div className={cn(
                           "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                           record.risk_level === 'High' ? "bg-red-100 text-red-600" : record.risk_level === 'Medium' ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
                        )}>
                           {language === 'bn' ? (record.risk_level === 'High' ? 'উচ্চ ঝুঁকি' : record.risk_level === 'Medium' ? 'মাঝারি ঝুঁকি' : 'স্বল্প ঝুঁকি') : record.risk_level}
                        </div>
                     </div>
                  ))}
                  {(!records || records.length === 0) && (
                     <div className="text-center py-8 text-slate-300 font-bold uppercase tracking-widest text-[10px]">
                        No logs recorded yet.
                     </div>
                  )}
               </div>
            </div>
         </div>
         <div className="space-y-8">
            <div className="asymmetric-panel bg-white p-10 border-white shadow-2xl shadow-slate-200/40">
               <h4 className="text-lg font-black text-slate-900 mb-6">{t.upcoming_checkups}</h4>
               <div className="space-y-4">
                  <CheckupItem date="Oct 24" label="Routine ANC" doc="Dr. Sabina" active language={language} />
                  <CheckupItem date="Nov 12" label="Growth Scan" doc="Radiology Center" language={language} />
               </div>
            </div>
            <button onClick={onLog} className="asymmetric-panel w-full p-10 bg-blue-600 text-white border-none group hover:scale-[1.02] transition-all flex flex-col items-center text-center shadow-2xl shadow-blue-200">
               <Plus className="h-16 w-16 mb-6 group-hover:rotate-90 transition-transform" />
               <h3 className="text-2xl font-black uppercase tracking-tight">{t.log_vitals}</h3>
            </button>
            <button onClick={onSOS} className="asymmetric-panel w-full p-8 bg-red-50 border-red-100 group flex items-center justify-between transition-all hover:bg-red-500 hover:text-white">
               <div>
                  <h4 className="text-lg font-black text-slate-900 group-hover:text-white uppercase tracking-tight">{t.sos}</h4>
               </div>
               <Phone className="h-8 w-8 text-red-600 group-hover:text-white" />
            </button>
         </div>
      </div>
    </div>
  );
}
lassName="text-2xl font-black uppercase tracking-tight">{t.log_vitals}</h3>
            </button>
            <button onClick={onSOS} className="asymmetric-panel w-full p-8 bg-red-50 border-red-100 group flex items-center justify-between transition-all hover:bg-red-500 hover:text-white">
               <div>
                  <h4 className="text-lg font-black text-slate-900 group-hover:text-white uppercase tracking-tight">{t.sos}</h4>
               </div>
               <Phone className="h-8 w-8 text-red-600 group-hover:text-white" />
            </button>
         </div>
      </div>
    </div>
  );
}

function CheckupItem({ date, label, doc, active, language }: any) {
   return (
      <div className={cn(
        "p-5 rounded-[1.5rem] border flex items-center justify-between transition-all",
        active ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-100"
      )}>
         <div>
            <div className={cn(
              "font-black uppercase tracking-widest", 
              active ? "text-blue-500" : "text-slate-400",
              language === 'bn' ? "text-[12px]" : "text-[9px]"
            )}>{date}</div>
            <div className="text-sm font-black text-slate-900 uppercase tracking-tight mt-1">{label}</div>
            <div className="text-[10px] font-bold text-slate-400 mt-1">{doc}</div>
         </div>
      </div>
   );
}

function VitalBox({ icon, label, value, status, color, language }: any) {
   const colors: any = { blue: "hover:border-blue-200", pink: "hover:border-pink-200", amber: "hover:border-amber-200", sky: "hover:border-sky-200" };
   return (
      <div className={cn("asymmetric-panel p-10 bg-white shadow-xl shadow-slate-200/20 border-white group transition-all", colors[color])}>
         <div className="mb-6 transition-transform group-hover:scale-110">{icon}</div>
         <div className="text-3xl font-black text-slate-900 tracking-tighter">{value}</div>
         <div className={cn(
           "font-black text-slate-400 uppercase tracking-widest mt-2",
           language === 'bn' ? "text-[12px]" : "text-[10px]"
         )}>{label}</div>
         <div className={cn(
           "font-bold mt-3 flex items-center gap-2",
           language === 'bn' ? "text-green-500 text-[11px]" : "text-green-500 text-[9px]"
         )}>
            <div className="h-2 w-2 rounded-full bg-green-500" /> {status}
         </div>
      </div>
   );
}

function DoctorView({ t, language }: any) {
   const records = useLiveQuery(() => db.healthRecords.orderBy('timestamp').reverse().toArray());

   if (!records) return <div className="p-10 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest">Initialising Secure Nexus...</div>;

   const highRisk = records.filter(r => r.risk_level === 'High');
   const mediumRisk = records.filter(r => r.risk_level === 'Medium');
   const lowRisk = records.filter(r => r.risk_level === 'Low');

   const priorityList = [...highRisk, ...mediumRisk, ...lowRisk];

   return (
      <div className="space-y-12">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <h2 className="text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none">{language === 'bn' ? 'ডাক্তার পোর্টাল' : 'Doctor Portal'}</h2>
               <p className="text-slate-500 mt-4 text-lg font-medium uppercase tracking-tight italic">{language === 'bn' ? 'ট্রায়াজ এবং অগ্রাধিকার পর্যবেক্ষণ' : 'Triage & Priority Monitoring'}</p>
            </div>
            <MetricCard label={t.urgent_review} value={highRisk.length.toString().padStart(2, '0')} color="red" language={language} />
         </div>

         <div className="space-y-6 mt-12">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">{t.priority_queue}</h3>
               <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 bg-blue-50 px-4 py-2 rounded-full uppercase tracking-widest">
                  <Activity className="h-3 w-3" /> {language === 'bn' ? 'রিয়েল-টাইম এআই ট্র্যাকিং' : 'Real-time AI Tracking'}
               </div>
            </div>
            
            <div className="grid gap-6">
               {priorityList.map(record => (
                  <PatientCard key={record.id} record={record} language={language} t={t} />
               ))}
               {priorityList.length === 0 && (
                  <div className="asymmetric-panel p-20 text-center border-dashed border-2 border-slate-100">
                     <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-8 w-8 text-slate-200" />
                     </div>
                     <p className="text-slate-400 font-black uppercase tracking-widest text-xs">{language === 'bn' ? 'কোনো মুলতুবি কেস নেই' : 'No pending cases in your sector'}</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}


function PatientCard({ record, language, t }: any) {
   const isHighRisk = record.risk_level === 'High';
   const colors = isHighRisk 
      ? 'bg-red-50 border-red-100 shadow-red-200/50' 
      : record.risk_level === 'Medium' 
         ? 'bg-amber-50 border-amber-100 shadow-amber-200/50'
         : 'bg-white border-slate-100 shadow-slate-200/50';

   const textColors = isHighRisk ? 'text-red-600' : record.risk_level === 'Medium' ? 'text-amber-600' : 'text-slate-600';

   return (
      <div className={cn("asymmetric-panel p-8 md:p-10 transition-all hover:scale-[1.01] shadow-xl", colors)}>
         <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
               <div className="flex items-center gap-4 mb-2">
                  <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", isHighRisk ? "bg-red-600 text-white" : "bg-slate-200 text-slate-600")}>
                     {language === 'bn' ? (isHighRisk ? 'উচ্চ ঝুঁকি' : record.risk_level === 'Medium' ? 'মাঝারি ঝুঁকি' : 'স্বল্প ঝুঁকি') : `${record.risk_level} RISK`}
                  </div>
                  <span className="text-sm font-bold text-slate-400">{record.mother_id} • {language === 'bn' ? `সপ্তাহ ${record.week}` : `Week ${record.week}`}</span>
               </div>
               <h4 className="text-3xl font-black text-slate-900 tracking-tight">{record.name}</h4>
               <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold text-slate-600">
                  <span className="flex items-center gap-1 bg-white/50 px-3 py-1 rounded-lg"><Activity className="h-4 w-4 text-blue-500" /> BP: {record.bp_sys}/{record.bp_dia}</span>
                  <span className="flex items-center gap-1 bg-white/50 px-3 py-1 rounded-lg"><AlertTriangle className="h-4 w-4 text-amber-500" /> {language === 'bn' ? 'স্কোর' : 'Score'}: {record.risk_score}</span>
               </div>
            </div>
            
            <div className="md:max-w-md w-full bg-white/60 p-6 rounded-[2rem] border border-white/50">
               <h5 className={cn("font-black uppercase tracking-widest text-xs mb-2", textColors)}>{t.diagnostic_summary}</h5>
               <p className="text-slate-700 font-medium text-sm leading-relaxed">{record.explanation}</p>
               
               {record.advice_bn && (
                  <div className="mt-4 pt-4 border-t border-slate-200/50">
                     <h5 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-1">{language === 'bn' ? 'বাংলা পরামর্শ' : 'Bengali Counsel'}</h5>
                     <p className="font-bangla text-slate-800 font-medium">{record.advice_bn}</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}


function WorkerView({ t, language, onQuickLog, onOnboard }: any) {
   const records = useLiveQuery(() => db.healthRecords.toArray());
   
   return (
      <div className="max-w-4xl mx-auto space-y-12">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">{t.worker} {language === 'bn' ? 'সাপোর্ট' : 'Support'}</h2>
               <p className="text-slate-500 mt-4 text-lg font-medium uppercase tracking-tight italic">{t.regional_deployment}</p>
            </div>
            <MetricCard label={t.registered_nodes} value={(records?.length || 0).toString().padStart(2, '0')} color="blue" language={language} />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button 
              onClick={onOnboard}
              className="asymmetric-panel w-full p-12 bg-blue-600 text-white border-none group flex flex-col items-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-200/40"
            >
               <Plus className="h-16 w-16 mb-6" />
               <h3 className="text-2xl font-black uppercase tracking-tight">{t.onboard_node}</h3>
               <p className="text-blue-100 mt-2 text-xs font-bold uppercase tracking-widest opacity-60">{language === 'bn' ? 'নতুন সদস্য নিবন্ধন করুন' : 'Register New Mother'}</p>
            </button>
            <button className="asymmetric-panel w-full p-12 bg-white text-slate-900 border-white group flex flex-col items-center hover:border-slate-200 transition-all shadow-xl shadow-slate-200/40">
               <Database className="h-16 w-16 mb-6 text-slate-300" />
               <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">{t.sync_vault}</h3>
               <p className="text-slate-400 mt-2 text-xs font-bold uppercase tracking-widest">{language === 'bn' ? '৩টি পেন্ডিং সিঙ্ক' : '3 Pending Syncs'}</p>
            </button>
         </div>

         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">{language === 'bn' ? 'আঞ্চলিক তালিকা' : 'Regional Deployment List'}</h3>
               <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-4 py-2 rounded-full uppercase tracking-widest">{language === 'bn' ? 'অফলাইন মোড সক্রিয়' : 'Offline Mode Active'}</span>
            </div>
            
            <div className="grid gap-4">
               {records?.map(record => (
                  <div key={record.id} className="glass-panel p-6 rounded-[2rem] flex items-center justify-between hover:border-blue-100 transition-all group">
                     <div className="flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-200 transition-colors">
                           {record.mother_id.split('-')[1]}
                        </div>
                        <div>
                           <div className="text-lg font-black text-slate-900">{record.name}</div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {language === 'bn' ? `সপ্তাহ ${record.week}` : `Week ${record.week}`} • {language === 'bn' ? (record.risk_level === 'High' ? 'উচ্চ ঝুঁকি' : record.risk_level === 'Medium' ? 'মাঝারি ঝুঁকি' : 'স্বল্প ঝুঁকি') : `${record.risk_level} RISK`}
                           </div>
                        </div>
                     </div>
                     <button 
                       onClick={() => onQuickLog(record.mother_id)}
                       className="h-12 px-6 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-sm"
                     >
                        {t.quick_log}
                     </button>
                  </div>
               ))}
               {(!records || records.length === 0) && (
                  <div className="p-16 text-center text-slate-300 font-black uppercase tracking-[0.2em] text-xs border-4 border-dotted border-slate-50 rounded-[3rem]">
                     {language === 'bn' ? 'এই সেক্টরে কোনো সদস্য নেই' : 'No nodes provisioned in this sector'}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}


function AdminView({ t, language }: any) {
   const records = useLiveQuery(() => db.healthRecords.toArray());
   const highRiskCount = records?.filter(r => r.risk_level === 'High').length || 0;
   
   return (
      <div className="space-y-12">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic">{t.admin_hub}</h2>
               <p className="text-slate-500 mt-4 text-lg font-medium uppercase tracking-tight italic">{t.global_operations}</p>
            </div>
            <div className="flex gap-4">
               <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100 shadow-sm">
                  <Cloud className="h-6 w-6 text-green-500" />
               </div>
               <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                  <Zap className="h-6 w-6 text-blue-500" />
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MetricCard label={t.registered_nodes} value={(records?.length || 0 + 1750).toString()} color="blue" language={language} />
            <MetricCard label={t.high_risk_triage} value={highRiskCount.toString().padStart(2, '0')} color="red" language={language} />
            <MetricCard label={t.active_workers} value="42" color="green" language={language} />
         </div>

         <div className="asymmetric-panel p-12 bg-slate-900 text-white border-none relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-6">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">{t.system_integrity}</span>
               </div>
               <h3 className="text-4xl font-black tracking-tighter leading-tight max-w-xl group-hover:text-blue-400 transition-colors">
                  {language === 'bn' 
                    ? `এআই রিস্ক ইঞ্জিন বর্তমানে ১২টি গ্রামীণ সেক্টরে ১.৮ হাজার সক্রিয় মাতৃ নোড পর্যবেক্ষণ করছে।` 
                    : `AI Risk Engine is currently monitoring 1.8k active maternal nodes across 12 rural sectors.`}
               </h3>
               <button className="mt-10 px-8 py-4 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all shadow-lg shadow-white/10">
                  {language === 'bn' ? 'গ্লোবাল হিটম্যাপ দেখুন' : 'View Global Heatmap'}
               </button>
            </div>
            <div className="absolute right-[-10%] top-[-20%] w-[60%] h-[140%] bg-blue-600/20 blur-[120px] rounded-full group-hover:bg-blue-600/30 transition-all" />
         </div>
      </div>
   );
}



function MetricCard({ label, value, color, language }: any) {
   const colors: any = { red: "bg-red-50 border-red-100 text-red-600", blue: "bg-blue-50 border-blue-100 text-blue-600", green: "bg-green-50 border-green-100 text-green-600" };
   return (
      <div className={cn("asymmetric-panel p-12 relative overflow-hidden", colors[color])}>
         <div className="text-6xl font-black tracking-tighter">{value}</div>
         <div className="mt-4 text-[11px] font-black uppercase tracking-widest opacity-60">{label}</div>
      </div>
   );
}

// --- Modals ---

function InitialLanguageModal({ onSelect, t, language }: { onSelect: (lang: string) => void, t: any, language: string }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-2xl p-8">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="max-w-2xl w-full glass-panel rounded-[4rem] p-20 text-center shadow-[0_40px_100px_rgba(0,0,0,0.2)] bg-white border-white"
      >
        <div className="mx-auto h-24 w-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-12 shadow-xl shadow-blue-100">
          <Languages className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase italic">{t.language_selection}</h2>
        <p className="text-slate-500 text-lg font-medium mb-16 italic uppercase tracking-tight">{t.choose_perspective}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <button 
             onClick={() => onSelect('bn')}
             className="group relative overflow-hidden h-32 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-blue-600 hover:border-blue-500 transition-all p-8 text-left"
           >
              <div className="relative z-10">
                 <div className="text-3xl font-black text-slate-900 group-hover:text-white transition-colors">বাংলা</div>
                                   <div className={cn("font-black text-slate-400 group-hover:text-blue-200 transition-colors uppercase tracking-widest mt-1",
                    language === 'bn' ? "text-[12px]" : "text-[10px]"
                  )}>{language === 'bn' ? "মাতৃভাষা" : "Mother Tongue"}</div>

              </div>
              <Sparkles className="absolute right-8 top-1/2 -translate-y-1/2 h-12 w-12 text-blue-100 group-hover:text-white/20 transition-colors" />
           </button>
           <button 
             onClick={() => onSelect('en')}
             className="group relative overflow-hidden h-32 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-blue-600 hover:border-blue-500 transition-all p-8 text-left"
           >
              <div className="relative z-10">
                 <div className="text-3xl font-black text-slate-900 group-hover:text-white transition-colors">English</div>
                                   <div className={cn("font-black text-slate-400 group-hover:text-blue-200 transition-colors uppercase tracking-widest mt-1",
                    language === 'bn' ? "text-[12px]" : "text-[10px]"
                  )}>{language === 'bn' ? "বৈশ্বিক মান" : "Global Standard"}</div>

              </div>
              <Globe2 className="absolute right-8 top-1/2 -translate-y-1/2 h-12 w-12 text-blue-100 group-hover:text-white/20 transition-colors" />
           </button>
        </div>
      </motion.div>
    </div>
  );
}

function SOSModal({ onClose, t, language }: any) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-red-900/40 backdrop-blur-3xl p-4 lg:p-8">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="max-w-xl w-full asymmetric-panel bg-white border-red-100 p-10 lg:p-20 text-center shadow-[0_40px_100px_rgba(0,0,0,0.1)]"
      >
        <div className="mx-auto h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mb-10 animate-bounce shadow-xl shadow-red-100">
          <Phone className="h-12 w-12 text-red-600 fill-red-600/10" />
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">{t.sos}</h2>
        <p className="mt-6 text-slate-500 font-medium text-lg leading-relaxed">
          {language === 'bn' ? 'জরুরী স্বাস্থ্য সেবার জন্য জাতীয় হেল্পলাইনে কল করুন।' : 'Call the National Health Helpline for immediate medical assistance.'}
        </p>
        <div className="mt-12 flex flex-col gap-4">
           <a 
             href="tel:16263"
             className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-black rounded-[2rem] shadow-2xl shadow-red-200 uppercase tracking-widest text-lg transition-all"
           >
             {language === 'bn' ? 'কল করুন ১৬২৬৩' : 'CALL 16263'}
           </a>
           <button 
             onClick={onClose}
             className={cn("w-full py-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-[2rem] uppercase tracking-widest transition-all", language === 'bn' ? "text-[13px]" : "text-[11px]")}
           >
             {t.cancel}
           </button>
        </div>
      </motion.div>
    </div>
  );
}

function LogVitalsModal({ onClose, onAnalyze, isAnalyzing, t, language }: any) {
   const [formData, setFormData] = useState({
     bp_sys: '', bp_dia: '', temperature: '', heart_rate: '', fetal_movement: 'normal', swelling: false
   });

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onAnalyze({
         bp_sys: Number(formData.bp_sys),
         bp_dia: Number(formData.bp_dia),
         temperature: Number(formData.temperature) || 98.6,
         heart_rate: Number(formData.heart_rate) || 80,
         fetal_movement: formData.fetal_movement,
         swelling: formData.swelling,
         headache_severity: 'none' // Defaulting for now
      });
   };

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-3xl p-4 lg:p-8 overflow-y-auto">
         <motion.div 
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: 50, opacity: 0 }}
           className="max-w-2xl w-full asymmetric-panel bg-white border-white p-8 lg:p-16 shadow-2xl shadow-slate-900/10 my-auto"
         >
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">{t.log_vitals}</h2>
               <button onClick={onClose} className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors"><X className="h-6 w-6 text-slate-400" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className={cn("block font-black text-slate-500 uppercase tracking-widest mb-2", language === 'bn' ? "text-[11px]" : "text-[9px]")}>{t.bp_sys}</label>
                     <input type="number" required value={formData.bp_sys} onChange={e => setFormData({...formData, bp_sys: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500" placeholder="120" />
                  </div>
                  <div>
                     <label className={cn("block font-black text-slate-500 uppercase tracking-widest mb-2", language === 'bn' ? "text-[11px]" : "text-[9px]")}>{t.bp_dia}</label>
                     <input type="number" required value={formData.bp_dia} onChange={e => setFormData({...formData, bp_dia: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500" placeholder="80" />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className={cn("block font-black text-slate-500 uppercase tracking-widest mb-2", language === 'bn' ? "text-[11px]" : "text-[9px]")}>{t.temperature}</label>
                     <input type="number" step="0.1" value={formData.temperature} onChange={e => setFormData({...formData, temperature: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500" placeholder="98.6" />
                  </div>
                  <div>
                     <label className={cn("block font-black text-slate-500 uppercase tracking-widest mb-2", language === 'bn' ? "text-[11px]" : "text-[9px]")}>{t.heart_rate}</label>
                     <input type="number" value={formData.heart_rate} onChange={e => setFormData({...formData, heart_rate: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500" placeholder="80" />
                  </div>
               </div>

               <div>
                  <label className={cn("block font-black text-slate-500 uppercase tracking-widest mb-2", language === 'bn' ? "text-[11px]" : "text-[9px]")}>{t.fetal_movement}</label>
                  <select value={formData.fetal_movement} onChange={e => setFormData({...formData, fetal_movement: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 appearance-none">
                     <option value="normal">{language === 'bn' ? "স্বাভাবিক" : "Normal"}</option>
                     <option value="decreased">{language === 'bn' ? "কমে গেছে" : "Decreased"}</option>
                     <option value="increased">{language === 'bn' ? "বেড়েছে" : "Increased"}</option>
                  </select>
               </div>

               <div className="flex items-center gap-4 py-4">
                  <input type="checkbox" id="swelling" checked={formData.swelling} onChange={e => setFormData({...formData, swelling: e.target.checked})} className="w-6 h-6 rounded text-blue-600 focus:ring-blue-500 border-slate-300" />
                  <label htmlFor="swelling" className="font-bold text-slate-700">{t.swelling}</label>
               </div>

               <div className="pt-6 border-t border-slate-100 flex gap-4">
                  <button type="button" onClick={onClose} className={cn("flex-1 h-16 bg-slate-100 text-slate-600 font-black rounded-[1.5rem] uppercase tracking-widest hover:bg-slate-200 transition-colors", language === 'bn' ? "text-[13px]" : "text-[11px]")}>{t.cancel}</button>
                  <button type="submit" disabled={isAnalyzing} className={cn("flex-[2] h-16 bg-blue-600 text-white font-black rounded-[1.5rem] uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-xl shadow-blue-200 disabled:opacity-50", language === 'bn' ? "text-[13px]" : "text-[11px]")}>
                     {isAnalyzing ? (language === 'bn' ? 'বিশ্লেষণ চলছে...' : 'Analyzing...') : t.submit_vitals}
                  </button>
               </div>
            </form>
         </motion.div>
      </div>
   );
}


function MobileNav({ activeRole, onToggleSidebar }: any) {
   return (
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-[90%] md:hidden">
         <div className="glass-panel rounded-[3.5rem] px-12 py-6 flex items-center justify-around border-white shadow-2xl shadow-slate-900/10">
            <NavItem icon={<LayoutDashboard className="h-6 w-6" />} active />
            <NavItem icon={<Activity className="h-6 w-6" />} />
            <div className="relative -top-14">
               <button className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-200 ring-[12px] ring-[#f8fafc] active:scale-90 transition-all">
                  <Plus className="h-10 w-10 text-white" />
               </button>
            </div>
            <NavItem icon={<Bell className="h-6 w-6" />} />
            <button onClick={onToggleSidebar} className="p-2 text-slate-300 hover:text-slate-900 transition-all"><Menu className="h-6 w-6" /></button>
         </div>
      </div>
   );
}

function NavItem({ icon, active }: any) {
   return (
      <button className={cn("p-2 transition-all duration-500", active ? "text-blue-500 scale-125" : "text-slate-300")}>
         {icon}
      </button>
   );
}

function OnboardNodeModal({ onClose, onOnboard, t, language }: any) {
  const [formData, setFormData] = useState({ name: '', age: '', week: '', mother_id: `MS-${Math.floor(1000 + Math.random() * 9000)}` });
  
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-3xl p-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-xl w-full asymmetric-panel bg-white p-12 shadow-2xl">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-8">Onboard Node</h2>
        <div className="space-y-6">
          <input type="text" placeholder="Mother Name" className="w-full h-14 bg-slate-50 rounded-2xl px-6 font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Age" className="w-full h-14 bg-slate-50 rounded-2xl px-6 font-bold" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
            <input type="number" placeholder="Gestation Week" className="w-full h-14 bg-slate-50 rounded-2xl px-6 font-bold" value={formData.week} onChange={e => setFormData({...formData, week: e.target.value})} />
          </div>
          <button onClick={() => onOnboard(formData)} className="w-full h-16 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Provision Node</button>
          <button onClick={onClose} className="w-full text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}
function AIChatModal({ onClose, t, language }: any) {
  const [messages, setMessages] = useState([{ role: 'ai', text: language === 'bn' ? 'আসসালামু আলাইকুম! আমি আপনার স্বাস্থ্য সহকারী। আমি আপনাকে কীভাবে সাহায্য করতে পারি?' : 'Hello! I am your AI Health Assistant. How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ message: input, language })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Connection lost. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-3xl p-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-2xl w-full h-[80vh] bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
        <div className="p-8 bg-blue-600 text-white flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                 <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                 <h3 className="text-xl font-black uppercase tracking-tight italic">Surokkha AI</h3>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-blue-100 uppercase tracking-widest opacity-60">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Active
                 </div>
              </div>
           </div>
           <button onClick={onClose} className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
              <Plus className="h-5 w-5 rotate-45" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
           {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                 <div className={cn(
                   "max-w-[80%] p-6 rounded-[2rem] font-medium text-sm leading-relaxed",
                   m.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"
                 )}>
                    {m.text}
                 </div>
              </div>
           ))}
           {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-slate-50 p-6 rounded-[2rem] rounded-tl-none border border-slate-100">
                    <div className="flex gap-1">
                       <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce" />
                       <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                       <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                 </div>
              </div>
           )}
        </div>

        <div className="p-8 border-t border-slate-100">
           <div className="flex gap-4">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder={language === 'bn' ? 'এখানে লিখুন...' : 'Type your message...'} 
                className="flex-1 h-14 bg-slate-50 rounded-2xl px-6 font-bold text-slate-900 border-none focus:ring-2 focus:ring-blue-100" 
              />
              <button onClick={sendMessage} className="h-14 w-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                 <ArrowUpRight className="h-6 w-6" />
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
