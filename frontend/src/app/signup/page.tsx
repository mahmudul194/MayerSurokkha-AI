"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Heart, Globe2, Mail, Lock, User, ArrowRight, ShieldCheck, Users, Stethoscope, Briefcase, Sparkles, Activity, Baby } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { translations } from '@/lib/translations';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MOTHER');
  const [isLoading, setIsLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
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
    }, 3500);

    if (!showIntro) {
      const tl = gsap.timeline();
      tl.from(leftPanelRef.current, { x: -60, opacity: 0, duration: 1.2, ease: "power3.out" })
        .from(rightPanelRef.current, { x: 60, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=1.0");
    }
  }, [showIntro]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/login');
    }, 1500);
  };

  if (showIntro) return <IntroAnimation />;

  return (
    <div className={cn(
      "min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row relative overflow-hidden selection:bg-blue-100",
      language === 'bn' && "font-bangla"
    )}>
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-blue-50/80 via-white to-pink-50/80" />
      </div>

      {/* Left Panel */}
      <div ref={leftPanelRef} className="hidden lg:flex flex-1 flex-col justify-between p-24 relative overflow-hidden border-r border-slate-100 bg-white/40 backdrop-blur-3xl z-10">
        <div className="relative z-10">
           <div className="flex items-center gap-4 mb-20">
              <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
                 <Sparkles className="h-8 w-8 text-white fill-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">MayerSurokkha</span>
           </div>
           
           <h1 className="text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
              {language === 'bn' ? "যত্নে গড়া" : "JOIN THE"} <br/> 
              <span className="text-blue-600">{language === 'bn' ? "নতুন ভবিষ্যৎ।" : "NEXUS OF CARE."}</span>
           </h1>
        </div>
        <div className="absolute right-[-50px] bottom-[-50px] opacity-5"><Heart className="h-[700px] w-[700px] text-blue-600 fill-blue-600" /></div>
      </div>

      {/* Right Panel */}
      <div ref={rightPanelRef} className="flex-1 flex items-center justify-center p-8 lg:p-24 relative z-10">
        <motion.div className="max-w-md w-full glass-panel rounded-[4rem] p-12 lg:p-16 border-white shadow-2xl bg-white/90">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{t.create_node}</h2>
            <p className="text-slate-400 text-[10px] mt-3 font-black tracking-[0.5em] uppercase">{t.provisioning}</p>
          </div>

          <div className="flex gap-2 mb-10 bg-slate-50 p-2 rounded-3xl border border-slate-100">
             <RoleTab label={t.mother} icon={<Users />} active={role === 'MOTHER'} onClick={() => setRole('MOTHER')} isBangla={language === 'bn'} />
             <RoleTab label={t.doctor} icon={<Stethoscope />} active={role === 'DOCTOR'} onClick={() => setRole('DOCTOR')} isBangla={language === 'bn'} />
             <RoleTab label={t.worker} icon={<Briefcase />} active={role === 'WORKER'} onClick={() => setRole('WORKER')} isBangla={language === 'bn'} />
             <RoleTab label={t.admin} icon={<ShieldCheck />} active={role === 'ADMIN'} onClick={() => setRole('ADMIN')} isBangla={language === 'bn'} />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <FormInput label={t.display_name} name="name" placeholder="Fatema Begum" value={name} onChange={(e: any) => setName(e.target.value)} isBangla={language === 'bn'} />
            <FormInput label={t.email_label} name="email" placeholder="mother@nexus.ai" value={email} onChange={(e: any) => setEmail(e.target.value)} isBangla={language === 'bn'} />
            <FormInput label={t.password_label} name="password" placeholder="••••••••" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} isBangla={language === 'bn'} />

            <button type="submit" disabled={isLoading} className="w-full h-20 bg-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-4 group mt-6 uppercase tracking-widest text-xs">
              {isLoading ? "Provisioning..." : t.signup_btn}
              {!isLoading && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              {t.existing_node}
              <button onClick={() => router.push('/login')} className="text-blue-600 ml-2 underline">{t.initiate_login}</button>
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
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">MayerSurokkha</motion.h1>
       </motion.div>
    </div>
  );
}

function FormInput({ label, name, placeholder, type = "text", value, onChange, isBangla }: any) {
  return (
    <div className="space-y-2">
       <label className={cn(
         "font-black text-slate-400 uppercase tracking-widest ml-2",
         isBangla ? "text-[12px]" : "text-[10px]"
       )}>{label}</label>
       <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full h-16 bg-slate-50 border border-slate-100 rounded-3xl px-8 text-slate-900 font-black outline-hidden focus:border-blue-300 transition-all tracking-widest" required />
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
        isBangla ? "text-[11px]" : "text-[8px]"
      )}>{label}</span>
    </button>
  );
}
