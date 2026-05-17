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
import { VoiceAssistantView } from '@/components/VoiceAssistantView';
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
  const [activeTab, setActiveTabState] = useState('dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = sessionStorage.getItem('activeTab');
      if (savedTab) {
        setActiveTabState(savedTab);
      }
    }
  }, []);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('activeTab', tab);
    }
  };

  const [isOnline, setIsOnline] = useState(true);
  const [profileName, setProfileName] = useState("Ayesha Begum");

  useEffect(() => {
    const loadProfileName = async () => {
      try {
        const records = await db.healthRecords.where('mother_id').equals("MS-0842").toArray();
        if (records.length > 0) {
          const latest = records[records.length - 1];
          if (latest.name) {
            setProfileName(latest.name);
          }
        }
      } catch (err) {
        console.error("Could not load profile name", err);
      }
    };
    loadProfileName();
  }, []);

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
    let risk_level: 'Low' | 'Medium' | 'High' = 'Low';
    let risk_score = 15;
    let explanation = "Vitals are within clinical norms.";
    let advice_bn = "আপনার ভাইটালস স্বাভাবিক আছে। সুস্থ থাকুন।";

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const payload = {
        mother_id: "MS-0842",
        age: 24,
        week: vitals.week,
        bp_sys: vitals.bp_sys,
        bp_dia: vitals.bp_dia,
        swelling: vitals.swelling,
        headache_severity: vitals.headache_severity,
        fever: vitals.fever,
        diabetes_history: vitals.diabetes_history,
        fetal_movement: vitals.fetal_movement,
        bleeding: vitals.bleeding
      };

      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        risk_level = result.risk_level as 'Low' | 'Medium' | 'High';
        risk_score = result.risk_score;
        explanation = result.explanation;
        advice_bn = result.advice_bn || advice_bn;
        showToast(language === 'bn' ? "ভাইটালস এআই দ্বারা সফলভাবে বিশ্লেষণ করা হয়েছে!" : "Vitals successfully analyzed by AI!", "success");
      } else {
        throw new Error("API call failed");
      }
    } catch (e) {
      console.warn("Offline Node Mode: Running local rules classification fallback.", e);
      // Lightweight Offline Rule-based Classification (Clinical Safety First)
      if (vitals.bleeding) {
        risk_level = 'High';
        risk_score = 95;
        explanation = "Emergency Alert: Vaginal bleeding detected during gestation. Immediate clinical transportation required.";
        advice_bn = "জরুরী সতর্কবার্তা: গর্ভাবস্থায় রক্তক্ষরণ দেখা গেছে। অবিলম্বে হাসপাতালে যোগাযোগ করুন।";
      } else if (vitals.bp_sys >= 140 || vitals.bp_dia >= 90) {
        risk_level = 'High';
        risk_score = 80;
        explanation = "Critical Danger: Elevated blood pressure indicates Gestational Hypertension. Danger of Pre-eclampsia.";
        advice_bn = "উচ্চ রক্তচাপ ধরা পড়েছে। এটি গর্ভকালীন প্রি-এক্লাম্পসিয়ার ঝুঁকি নির্দেশ করে। অবিলম্বে বিশ্রাম ও পরামর্শ নিন।";
      } else if (vitals.fetal_movement === 'reduced') {
        risk_level = 'High';
        risk_score = 75;
        explanation = "Warning: Reduced fetal kicks count (<10 in 2 hours). Fetal distress risk. Consult doctor.";
        advice_bn = "বাচ্চার নড়াচড়া স্বাভাবিকের চেয়ে কম। অবিলম্বে চিকিৎসকের সাথে কথা বলুন।";
      } else if (vitals.swelling || vitals.fever) {
        risk_level = 'Medium';
        risk_score = 45;
        explanation = "Precautionary Note: Swelling/edema or fever present. Monitor blood pressure daily and stay hydrated.";
        advice_bn = "হাত-পা ফোলা বা শরীরে জ্বর রয়েছে। প্রতিদিন রক্তচাপ পরিমাপ করুন ও প্রচুর পানি পান করুন।";
      }
      showToast(language === 'bn' ? "ভাইটালস অফলাইন নিয়মে সংরক্ষিত হয়েছে!" : "Vitals logged locally in Offline Mode!", "info");
    }

    await db.healthRecords.add({
      mother_id: "MS-0842",
      name: "Ayesha Begum",
      age: 24,
      week: vitals.week,
      bp_sys: vitals.bp_sys,
      bp_dia: vitals.bp_dia,
      temp: vitals.temp,
      risk_level,
      risk_score,
      explanation,
      advice_bn,
      timestamp: Date.now(),
      synced: navigator.onLine,
      encrypted_data: db.encrypt({
        bp_sys: vitals.bp_sys,
        bp_dia: vitals.bp_dia,
        temp: vitals.temp,
        week: vitals.week,
        swelling: vitals.swelling,
        headache_severity: vitals.headache_severity,
        fever: vitals.fever,
        diabetes_history: vitals.diabetes_history,
        fetal_movement: vitals.fetal_movement,
        bleeding: vitals.bleeding
      })
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
                  <div className="text-sm font-black text-slate-900 uppercase">{profileName}</div>
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{userRole} NODE 0842</div>
               </div>
               <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center font-black">
                  {profileName[0] || "A"}
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
                {activeTab === 'voice' && <VoiceAssistantView t={t} language={language} showToast={showToast} />}
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
