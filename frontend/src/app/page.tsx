'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/db';
import { translations } from '@/lib/translations';

// Modular Components
import { Sidebar } from '@/components/Sidebar';
import { LoadingScreen, SyncIndicator } from '@/components/LoadingScreen';
import { MotherView } from '@/components/MotherView';
import { DoctorView } from '@/components/DoctorView';
import { WorkerView } from '@/components/WorkerView';
import { AdminView } from '@/components/AdminView';
import { AIChatModal } from '@/components/AIChatModal';
import { KnowledgeBaseModal } from '@/components/KnowledgeBaseModal';
import { ANCModal } from '@/components/ANCModal';
import { NearbyCentersModal } from '@/components/NearbyCentersModal';
import { LogVitalsModal } from '@/components/LogVitalsModal';
import { OnboardNodeModal } from '@/components/OnboardNodeModal';
import { SettingsView } from '@/components/SettingsView';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('bn');
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(true);
  
  // Modal States
  const [showAIChat, setShowAIChat] = useState(false);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [showANCModal, setShowANCModal] = useState(false);
  const [showNearbyCenters, setShowNearbyCenters] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const t = (translations as any)[language];
  const userRole = (session?.user as any)?.role || 'MOTHER';

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const handleLogVitals = async (vitals: any) => {
    await db.healthRecords.add({
      ...vitals,
      mother_id: "MS-0842",
      risk_level: vitals.bp_sys > 140 ? 'High' : 'Low',
      explanation: vitals.bp_sys > 140 ? 'Elevated blood pressure detected. Immediate rest and consultation recommended.' : 'Vitals are within clinical norms.',
      advice_bn: vitals.bp_sys > 140 ? 'উচ্চ রক্তচাপ ধরা পড়েছে। অনুগ্রহ করে বিশ্রাম নিন এবং ডাক্তারের পরামর্শ নিন।' : 'আপনার ভাইটালস স্বাভাবিক আছে।',
      timestamp: new Date()
    });
    setShowLogModal(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSyncing(false);
  };

  if (loading) return <LoadingScreen language={language} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      <Sidebar 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        role={userRole}
        t={t}
        onAIChat={() => setShowAIChat(true)}
        onKnowledge={() => setShowKnowledgeBase(true)}
        onANC={() => setShowANCModal(true)}
        onNearby={() => setShowNearbyCenters(true)}
      />

      <main className={`transition-all duration-500 ${collapsed ? 'pl-24' : 'pl-80'}`}>
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-12 sticky top-0 z-40">
           <div className="flex items-center gap-6">
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{activeTab === 'settings' ? (language === 'bn' ? "সেটিংস" : "Settings") : t.dashboard}</h1>
              <SyncIndicator isOnline={isOnline} language={language} />
           </div>
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <div className="text-sm font-black text-slate-900 uppercase">{session?.user?.name || "Fatema Begum"}</div>
                 <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{userRole} NODE 0842</div>
              </div>
              <div className="h-12 w-12 bg-slate-100 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center font-black text-slate-400">
                 {session?.user?.name?.[0] || "F"}
              </div>
           </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
             <motion.div
               key={`${userRole}-${activeTab}`}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.5 }}
             >
                {activeTab === 'settings' ? (
                  <SettingsView language={language} setLanguage={setLanguage} t={t} />
                ) : (
                  <>
                    {userRole === 'MOTHER' && (
                      <MotherView 
                        onSOS={() => alert("SOS Triggered")} 
                        onLog={() => setShowLogModal(true)} 
                        t={t} 
                        language={language}
                        isAudioPlaying={isAudioPlaying}
                        setIsAudioPlaying={setIsAudioPlaying}
                      />
                    )}
                    {userRole === 'DOCTOR' && <DoctorView t={t} language={language} />}
                    {userRole === 'WORKER' && (
                      <WorkerView 
                        onSync={handleSync} 
                        onRegister={() => setShowOnboardModal(true)} 
                        isSyncing={isSyncing} 
                        t={t} 
                        language={language} 
                      />
                    )}
                    {userRole === 'ADMIN' && <AdminView t={t} language={language} />}
                  </>
                )}
             </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AIChatModal 
        isOpen={showAIChat} 
        onClose={() => setShowAIChat(false)} 
        t={t} 
        language={language} 
      />
      <KnowledgeBaseModal 
        isOpen={showKnowledgeBase} 
        onClose={() => setShowKnowledgeBase(false)} 
        t={t} 
        language={language} 
      />
      <ANCModal 
        isOpen={showANCModal} 
        onClose={() => setShowANCModal(false)} 
        currentWeek={28}
        t={t} 
        language={language} 
      />
      <NearbyCentersModal 
        isOpen={showNearbyCenters} 
        onClose={() => setShowNearbyCenters(false)} 
        t={t} 
        language={language} 
      />
      <LogVitalsModal 
        isOpen={showLogModal} 
        onClose={() => setShowLogModal(false)} 
        onSave={handleLogVitals}
        t={t} 
        language={language} 
      />
      <OnboardNodeModal 
        isOpen={showOnboardModal} 
        onClose={() => setShowOnboardModal(false)} 
        t={t} 
        language={language} 
      />
    </div>
  );
}

