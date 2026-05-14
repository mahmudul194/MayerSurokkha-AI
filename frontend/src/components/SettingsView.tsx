'use client';

import { cn } from "@/lib/utils";
import { 
  User, Shield, Bell, Globe, 
  Smartphone, Lock, Eye, ChevronRight
} from "lucide-react";

export function SettingsView({ t, language, setLanguage }: any) {
  const sections = [
    { 
      id: 'profile', 
      icon: User, 
      label: language === 'bn' ? "প্রোফাইল সেটিংস" : "Profile Settings",
      desc: language === 'bn' ? "আপনার ব্যক্তিগত তথ্য পরিচালনা করুন" : "Manage your personal information and health ID"
    },
    { 
      id: 'notifications', 
      icon: Bell, 
      label: language === 'bn' ? "নোটিফিকেশন" : "Notifications",
      desc: language === 'bn' ? "বিকাশ এবং চেকআপ অ্যালার্ট" : "Gestation and checkup alerts"
    },
    { 
      id: 'security', 
      icon: Lock, 
      label: language === 'bn' ? "তথ্য সুরক্ষা" : "Security",
      desc: language === 'bn' ? "তথ্য এনক্রিপশন এবং সুরক্ষা সেটিংস" : "Neural key and vault encryption"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="asymmetric-panel bg-white p-12 border-white shadow-2xl shadow-slate-200/30">
         <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">{language === 'bn' ? "সিস্টেম প্রেফারেন্স" : "System Preferences"}</h3>
         <p className="text-slate-400 font-black uppercase tracking-widest text-[13px] mb-12">{language === 'bn' ? "সিস্টেম সেটিংস এবং কনফিগারেশন" : "Neural Node Configuration"}</p>
         
         <div className="space-y-4">
            <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-slate-100 transition-all">
               <div className="flex items-center gap-6">
                  <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                     <Globe className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{language === 'bn' ? "ভাষা" : "Language"}</h4>
                     <p className="text-[13px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{language === 'bn' ? "বর্তমান: বাংলা" : "Current: English"}</p>
                  </div>
               </div>
               <button 
                 onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                 className="px-8 py-3 bg-white shadow-sm border border-slate-100 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
               >
                  {language === 'bn' ? "ENGLISH" : "বাংলা (BN)"}
               </button>
            </div>

            {sections.map((section) => (
               <div key={section.id} className="group flex items-center justify-between p-8 bg-slate-50/50 hover:bg-white rounded-[2.5rem] border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-6">
                     <div className="h-14 w-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:bg-blue-50 transition-all">
                        <section.icon className="h-7 w-7 text-slate-400 group-hover:text-blue-600" />
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{section.label}</h4>
                        <p className="text-[13px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{section.desc}</p>
                     </div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                     <ChevronRight className="h-5 w-5" />
                  </div>
               </div>
            ))}
         </div>
      </div>

      <div className="asymmetric-panel bg-slate-900 p-12 text-white relative overflow-hidden">
         <div className="relative z-10">
            <Shield className="h-12 w-12 text-blue-400 mb-8" />
            <h4 className="text-2xl font-black uppercase tracking-tight mb-4">{language === 'bn' ? "ডেটা প্রাইভেসি" : "Data Privacy"}</h4>
            <p className="text-blue-100/60 text-sm font-medium leading-relaxed max-w-md">
               {language === 'bn' ? "আপনার সকল স্বাস্থ্য তথ্য এনক্রিপ্ট করা এবং শুধুমাত্র আপনার এবং আপনার ডাক্তারের কাছে দৃশ্যমান।" : "All your health data is end-to-end encrypted and only accessible by you and your designated clinical node."}
            </p>
         </div>
         <Smartphone className="absolute right-[-20px] bottom-[-20px] h-64 w-64 text-white/5" />
      </div>
    </div>
  );
}
