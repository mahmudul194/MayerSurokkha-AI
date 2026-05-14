'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Activity, Heart, Shield, Plus, 
  ChevronRight, Thermometer, Droplets
} from "lucide-react";
import { cn } from "@/lib/utils";

export function LogVitalsModal({ isOpen, onClose, onSave, t, language }: any) {
  const [vitals, setVitals] = useState({
    bp_sys: 120,
    bp_dia: 80,
    temp: 98.4,
    weight: 65,
    week: 28
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
               <div className="flex items-center gap-6">
                  <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                     <Plus className="h-7 w-7 text-white" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.log_vitals}</h3>
                     <p className="text-slate-400 font-black uppercase tracking-widest text-[13px] mt-1">Manual Vitals Entry Protocol</p>
                  </div>
               </div>
               <button onClick={onClose} className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                  <X className="h-6 w-6" />
               </button>
            </div>

            <div className="p-12 space-y-8">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-2">{t.bp_sys} (mmHg)</label>
                     <input 
                        type="number" 
                        value={vitals.bp_sys}
                        onChange={(e) => setVitals({...vitals, bp_sys: parseInt(e.target.value)})}
                        className="w-full h-16 bg-slate-50 border-none rounded-2xl px-6 text-xl font-black focus:ring-2 focus:ring-blue-100"
                     />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-2">{t.bp_dia} (mmHg)</label>
                     <input 
                        type="number" 
                        value={vitals.bp_dia}
                        onChange={(e) => setVitals({...vitals, bp_dia: parseInt(e.target.value)})}
                        className="w-full h-16 bg-slate-50 border-none rounded-2xl px-6 text-xl font-black focus:ring-2 focus:ring-blue-100"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-2">{t.temperature} (F)</label>
                     <input 
                        type="number" 
                        step="0.1"
                        value={vitals.temp}
                        onChange={(e) => setVitals({...vitals, temp: parseFloat(e.target.value)})}
                        className="w-full h-16 bg-slate-50 border-none rounded-2xl px-6 text-xl font-black focus:ring-2 focus:ring-blue-100"
                     />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-2">{language === 'bn' ? "গর্ভাবস্থার সপ্তাহ" : "Gestation Week"}</label>
                     <input 
                        type="number" 
                        value={vitals.week}
                        onChange={(e) => setVitals({...vitals, week: parseInt(e.target.value)})}
                        className="w-full h-16 bg-slate-50 border-none rounded-2xl px-6 text-xl font-black focus:ring-2 focus:ring-blue-100"
                     />
                  </div>
               </div>

               <button 
                 onClick={() => onSave(vitals)}
                 className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
               >
                  <Activity className="h-6 w-6" /> {language === 'bn' ? "তথ্য সংরক্ষণ করুন" : "Save Vitals Protocol"}
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
