"use client";

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Heart, Globe2, Mail, Lock, ArrowRight, ShieldCheck, Users, Stethoscope, Briefcase, Sparkles, Activity, Shield, Sun, Baby, Languages } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MOTHER');
  const [isLoading, setIsLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showLangModal, setShowLangModal] = useState(false);
  const [language, setLanguage] = useState<string>('en');
  const router = useRouter();
  
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const t = translations[language] || translations.en;

  useEffect(() => {
    const savedLang = localStorage.getItem('surokkha_lang');
    if (savedLang) setLanguage(savedLang);

    setTimeout(() => {
      setShowIntro(false);
      if (!savedLang) setShowLangModal(true);
    }, 3500);

    if (!showIntro && !showLangModal) {
      const tl = gsap.timeline();
      tl.from(leftPanelRef.current, { x: -60, opacity: 0, duration: 1.2, ease: "power3.out" })
        .from(rightPanelRef.current, { x: 60, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=1.0");
    }
  }, [showIntro, showLangModal]);

  const selectLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('surokkha_lang', lang);
    setShowLangModal(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await signIn('credentials', { email, password, role, redirect: false });
    if (res?.ok) router.push('/');
    setIsLoading(false);
  };

  if (showIntro) return <IntroAnimation />;

  return (
    <div className={cn(
      "min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row relative overflow-hidden selection:bg-blue-100",
      language === 'bn' && "font-bangla"
    )}>
      <AnimatePresence>
         {showLangModal && <InitialLanguageModal onSelect={selectLanguage} t={t} />}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-blue-50/80 via-white to-pink-50/80" />
      </div>

      {/* Left Panel */}
      <div ref={leftPanelRef} className="hidden lg:flex flex-1 flex-col justify-between p-24 relative overflow-hidden border-r border-slate-100 bg-white/40 backdrop-blur-3xl z-10">
        <div className="relative z-10">
           <div className="flex items-center gap-4 mb-20">
              <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
                 <Heart className="h-8 w-8 text-white fill-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Mayer Surokkha</span>
           </div>
           
           <h1 className="text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
              {language === 'bn' ? "একজন সুস্থ মা।" : "A HEALTHY MOTHER."} <br/> 
              <span className="text-blue-600">{language === 'bn' ? "একজন নিরাপদ শিশু।" : "A SAFE BABY."}</span>
           </h1>
        </div>
        <div className="absolute right-[-50px] bottom-[-50px] opacity-5"><Baby className="h-[700px] w-[700px] text-blue-600" /></div>
      </div>

      {/* Right Panel */}
      <div ref={rightPanelRef} className="flex-1 flex items-center justify-center p-8 lg:p-24 relative z-10">
        <motion.div className="max-w-md w-full glass-panel rounded-[4rem] p-12 lg:p-16 border-white shadow-2xl bg-white/90">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{t.welcome}</h2>
            <p className="text-slate-400 text-[14px] mt-3 font-black tracking-[0.5em] uppercase">{t.nexus_portal}</p>
          </div>

          <div className="flex gap-2 mb-10 bg-slate-50 p-2 rounded-3xl border border-slate-100">
             <RoleTab label={t.mother} icon={<Users />} active={role === 'MOTHER'} onClick={() => setRole('MOTHER')} isBangla={language === 'bn'} />
             <RoleTab label={t.doctor} icon={<Stethoscope />} active={role === 'DOCTOR'} onClick={() => setRole('DOCTOR')} isBangla={language === 'bn'} />
             <RoleTab label={t.worker} icon={<Briefcase />} active={role === 'WORKER'} onClick={() => setRole('WORKER')} isBangla={language === 'bn'} />
             <RoleTab label={t.admin} icon={<ShieldCheck />} active={role === 'ADMIN'} onClick={() => setRole('ADMIN')} isBangla={language === 'bn'} />
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <FormInput label={t.email_label} name="email" value={email} onChange={(e: any) => setEmail(e.target.value)} icon={<Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />} isBangla={language === 'bn'} />
            <FormInput label={t.password_label} name="password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} icon={<Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />} isBangla={language === 'bn'} />

            <button type="submit" disabled={isLoading} className="w-full h-20 bg-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-4 group mt-4 uppercase tracking-widest text-sm">
              {isLoading ? "Validating..." : t.login_btn}
              {!isLoading && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />}
            </button>
          </form>

          <button onClick={() => signIn('google')} className="mt-8 w-full h-16 bg-white border border-slate-100 text-slate-700 font-black rounded-3xl transition-all flex items-center justify-center gap-4 shadow-sm uppercase tracking-widest text-[12px]">
            <Globe2 className="h-5 w-5 text-blue-500" /> {t.google_btn}
          </button>

          <div className="mt-12 text-center">
            <p className="text-slate-400 text-[13px] font-black uppercase tracking-widest">
              {t.signup_link}
              <button onClick={() => router.push('/signup')} className="text-blue-600 ml-2 underline">{t.signup_btn}</button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function IntroAnimation() {
  return (
    <div className="fixed inset-0 z-[1000] bg-white flex items-center justify-center overflow-hidden">
       <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: [0.8, 1.1, 1], opacity: 1 }} transition={{ duration: 2, ease: "easeOut" }} className="text-center">
          <div className="relative h-32 w-32 mx-auto mb-12">
             <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-blue-500 rounded-full blur-2xl" />
             <div className="relative h-full w-full bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-200"><Heart className="h-16 w-16 text-white fill-white" /></div>
          </div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Mayer Surokkha</motion.h1>
       </motion.div>
    </div>
  );
}

function InitialLanguageModal({ onSelect, t }: { onSelect: (lang: string) => void, t: any }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-2xl p-8">
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="max-w-2xl w-full glass-panel rounded-[4rem] p-20 text-center shadow-2xl bg-white">
        <h2 className="text-5xl font-black text-slate-900 mb-4 uppercase italic">{t.language_selection}</h2>
        <p className="text-slate-500 mb-16 italic uppercase tracking-tight">{t.choose_perspective}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <button onClick={() => onSelect('bn')} className="h-32 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-blue-600 hover:text-white transition-all p-8 text-left">
              <div className="text-3xl font-black">বাংলা</div>
              <div className="text-[10px] uppercase mt-1">মাতৃভাষা</div>
           </button>
           <button onClick={() => onSelect('en')} className="h-32 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-blue-600 hover:text-white transition-all p-8 text-left">
              <div className="text-3xl font-black">English</div>
              <div className="text-[10px] uppercase mt-1">Global Standard</div>
           </button>
        </div>
      </motion.div>
    </div>
  );
}

function FormInput({ label, value, onChange, icon, type = "text", isBangla }: any) {
  return (
    <div className="space-y-3">
       <label className={cn(
         "font-black text-slate-400 uppercase tracking-widest ml-2",
         isBangla ? "text-[14px]" : "text-[12px]"
       )}>{label}</label>
       <div className="relative">
          {icon}
          <input type={type} value={value} onChange={onChange} className="w-full h-16 bg-slate-50 border border-slate-100 rounded-3xl px-16 text-slate-900 font-black outline-hidden focus:border-blue-300 transition-all tracking-widest" required />
       </div>
    </div>
  );
}

function RoleTab({ icon, label, active, onClick, isBangla }: any) {
  return (
    <button onClick={onClick} className={cn(
      "flex-1 h-24 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 transition-all",
      active ? 'bg-white text-blue-600 shadow-xl border border-slate-100' : 'text-slate-300 hover:bg-slate-100'
    )}>
      <div className={active ? "scale-110" : ""}>{icon}</div>
      <span className={cn(
        "font-black uppercase tracking-widest text-center px-1",
        isBangla ? "text-[13px]" : "text-[11px]"
      )}>{label}</span>
    </button>
  );
}
