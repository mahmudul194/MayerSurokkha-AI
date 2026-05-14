'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/db';
import { translations } from '@/lib/translations';

// Modular Components
import { Sidebar } from '@/components/Sidebar';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MotherView } from '@/components/MotherView';
import { DoctorView } from '@/components/DoctorView';
import { WorkerView } from '@/components/WorkerView';
import { AdminView } from '@/components/AdminView';
import { ChatView } from '@/components/ChatView';
import { KnowledgeView } from '@/components/KnowledgeView';
import { ANCView } from '@/components/ANCView';
import { NearbyView } from '@/components/NearbyView';
import { SettingsView } from '@/components/SettingsView';
import { LogVitalsModal } from '@/components/LogVitalsModal';
import { OnboardNodeModal } from '@/components/OnboardNodeModal';
import { CustomToast, ToastType } from '@/components/CustomToast';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('bn');
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'info',
    visible: false
  });

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 5000);
  };

  // Modal States (Only for actions, not features)
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
    showToast(language === 'bn' ? "সাফল্যের সাথে সিঙ্ক হয়েছে" : "Neural Link Sync Complete", "success");
  };

  if (status === 'loading' || loading) return <LoadingScreen language={language} />;
  if (status === 'unauthenticated') return null;

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
      />

      <main className={`transition-all duration-500 ${collapsed ? 'pl-24' : 'pl-80'}`}>
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-12 sticky top-0 z-40">
           <div className="flex items-center gap-6">
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{activeTab}</h1>
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
                {activeTab === 'settings' && <SettingsView language={language} setLanguage={setLanguage} t={t} showToast={showToast} />}
                {activeTab === 'chat' && <ChatView t={t} language={language} showToast={showToast} />}
                {activeTab === 'knowledge' && <KnowledgeView t={t} language={language} showToast={showToast} />}
                {activeTab === 'anc' && <ANCView t={t} language={language} showToast={showToast} />}
                {activeTab === 'nearby' && <NearbyView t={t} language={language} showToast={showToast} />}
                {activeTab === 'dashboard' && (
                  <>
                    {userRole === 'MOTHER' && (
                      <MotherView 
                        onSOS={() => showToast(t.sos_triggered || "SOS Alert Sent to Nodes", "error")} 
                        onLog={() => setShowLogModal(true)} 
                        t={t} 
                        language={language}
                        isAudioPlaying={isAudioPlaying}
                        setIsAudioPlaying={setIsAudioPlaying}
                        showToast={showToast}
                      />
                    )}
                    {userRole === 'DOCTOR' && <DoctorView t={t} language={language} showToast={showToast} />}
                    {userRole === 'WORKER' && (
                      <WorkerView 
                        onSync={handleSync} 
                        onRegister={() => setShowOnboardModal(true)} 
                        isSyncing={isSyncing} 
                        t={t} 
                        language={language} 
                        showToast={showToast}
                      />
                    )}
                    {userRole === 'ADMIN' && <AdminView t={t} language={language} showToast={showToast} />}
                  </>
                )}
             </motion.div>
          </AnimatePresence>
        </div>
      </main>

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

      <CustomToast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
