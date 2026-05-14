'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Shield, User, MapPin, ChevronRight, 
  Sparkles, CheckCircle2, Navigation
} from "lucide-react";
import { cn } from "@/lib/utils";

export function OnboardNodeModal({ isOpen, onClose, onComplete, t, language }: any) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: "", nid: "", village: "" });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                     <User className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{t.register_mother}</h3>
               </div>
               <button onClick={onClose} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                  <X className="h-5 w-5" />
               </button>
            </div>

            <div className="p-10">
               <div className="flex gap-2 mb-10">
                  {[1, 2, 3].map((s) => (
                     <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-all", s <= step ? "bg-emerald-500" : "bg-slate-100")} />
                  ))}
               </div>

               {step === 1 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-2">{language === 'bn' ? "মায়ের পূর্ণ নাম" : "Mother's Full Name"}</label>
                        <input 
                           type="text" 
                           value={data.name}
                           onChange={(e) => setData({...data, name: e.target.value})}
                           className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-emerald-100"
                           placeholder={language === 'bn' ? "পূর্ণ নাম লিখুন..." : "Enter full name..."}
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-2">{language === 'bn' ? "জাতীয় পরিচয়পত্র নম্বর (NID)" : "National ID / Identifier"}</label>
                        <input 
                           type="text" 
                           value={data.nid}
                           onChange={(e) => setData({...data, nid: e.target.value})}
                           className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-emerald-100"
                           placeholder={language === 'bn' ? "এনআইডি নম্বর লিখুন..." : "Enter NID number..."}
                        />
                     </div>
                     <button 
                       onClick={() => setStep(2)}
                       className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-100 flex items-center justify-center gap-3"
                     >
                        {language === 'bn' ? "পরবর্তী" : "Continue"} <ChevronRight className="h-4 w-4" />
                     </button>
                  </motion.div>
               )}

               {step === 2 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-2">{language === 'bn' ? "গ্রাম / ওয়ার্ড" : "Village / Ward"}</label>
                        <input 
                           type="text" 
                           value={data.village}
                           onChange={(e) => setData({...data, village: e.target.value})}
                           className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-emerald-100"
                           placeholder={language === 'bn' ? "গ্রামের নাম লিখুন..." : "Enter location..."}
                        />
                     </div>
                     <button 
                       onClick={() => setStep(3)}
                       className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-100 flex items-center justify-center gap-3"
                     >
                        {language === 'bn' ? "নিবন্ধন নিশ্চিত করুন" : "Confirm Registration"} <ChevronRight className="h-4 w-4" />
                     </button>
                  </motion.div>
               )}

               {step === 3 && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                     <div className="h-20 w-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-emerald-500">
                        <CheckCircle2 className="h-10 w-10" />
                     </div>
                     <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-4">{language === 'bn' ? "নিবন্ধন সফল হয়েছে" : "Registration Complete"}</h4>
                     <p className="text-slate-400 font-medium mb-10">{language === 'bn' ? "মায়ের তথ্য সফলভাবে 'মায়ের সুরক্ষা' নেটওয়ার্কে যুক্ত করা হয়েছে।" : "Mother has been onboarded to the Mayer Surokkha Neural Network."}</p>
                     <button 
                       onClick={onClose}
                       className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200"
                     >
                        {language === 'bn' ? "ড্যাশবোর্ড দেখুন" : "Access Dashboard"}
                     </button>
                  </motion.div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
