'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Activity, Heart, Shield, Plus, 
  Thermometer, AlertTriangle, AlertCircle, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

export function LogVitalsModal({ isOpen, onClose, onSave, t, language }: any) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vitals, setVitals] = useState({
    bp_sys: 120,
    bp_dia: 80,
    temp: 98.4,
    week: 16,
    swelling: false,
    headache_severity: "none" as "none" | "mild" | "moderate" | "severe",
    fever: false,
    diabetes_history: false,
    fetal_movement: "normal" as "normal" | "reduced",
    bleeding: false
  });

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave(vitals);
      setStep(1); // Reset step for next open
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" 
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 20 }} 
            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
               <div className="flex items-center gap-6">
                  <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                     <Plus className="h-7 w-7 text-white" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.log_vitals}</h3>
                     <p className="text-slate-400 font-black uppercase tracking-widest text-[11px] mt-0.5">
                       {language === 'bn' ? "ক্লিনিক্যাল ভাইটাল ও উপসর্গ এন্ট্রি" : "Clinical Vitals & Symptoms Protocol"}
                     </p>
                  </div>
               </div>
               <button onClick={onClose} className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                  <X className="h-6 w-6" />
               </button>
            </div>

            {/* Stepper Indicator */}
            <div className="px-12 pt-8 flex items-center justify-between">
              <span className={cn(
                "text-xs font-black uppercase tracking-widest",
                step === 1 ? "text-blue-600" : "text-slate-400"
              )}>
                {language === 'bn' ? "১. শারীরিক ভাইটালস" : "1. Core Vitals"}
              </span>
              <div className="h-px w-24 bg-slate-100 mx-4 flex-1" />
              <span className={cn(
                "text-xs font-black uppercase tracking-widest",
                step === 2 ? "text-blue-600" : "text-slate-400"
              )}>
                {language === 'bn' ? "২. গর্ভকালীন জটিলতা" : "2. Danger Symptoms"}
              </span>
            </div>

            {/* Step Content */}
            <div className="p-12 flex-1">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
                           {t.bp_sys} (mmHg)
                         </label>
                         <input 
                            type="number" 
                            value={vitals.bp_sys || ""}
                            onChange={(e) => setVitals({...vitals, bp_sys: parseInt(e.target.value) || 0})}
                            className="w-full h-16 bg-slate-50 border-none rounded-2xl px-6 text-xl font-black focus:ring-2 focus:ring-blue-100"
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
                           {t.bp_dia} (mmHg)
                         </label>
                         <input 
                            type="number" 
                            value={vitals.bp_dia || ""}
                            onChange={(e) => setVitals({...vitals, bp_dia: parseInt(e.target.value) || 0})}
                            className="w-full h-16 bg-slate-50 border-none rounded-2xl px-6 text-xl font-black focus:ring-2 focus:ring-blue-100"
                         />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
                           {t.temperature} (°F)
                         </label>
                         <input 
                            type="number" 
                            step="0.1"
                            value={vitals.temp || ""}
                            onChange={(e) => setVitals({...vitals, temp: parseFloat(e.target.value) || 0})}
                            className="w-full h-16 bg-slate-50 border-none rounded-2xl px-6 text-xl font-black focus:ring-2 focus:ring-blue-100"
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
                           {language === 'bn' ? "গর্ভকালীন সপ্তাহ" : "Gestation Week"}
                         </label>
                         <input 
                            type="number" 
                            value={vitals.week || ""}
                            onChange={(e) => setVitals({...vitals, week: parseInt(e.target.value) || 0})}
                            className="w-full h-16 bg-slate-50 border-none rounded-2xl px-6 text-xl font-black focus:ring-2 focus:ring-blue-100"
                         />
                      </div>
                    </div>

                    <button 
                      onClick={() => setStep(2)}
                      className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-blue-100 transition-all mt-6"
                    >
                       <span>{language === 'bn' ? "পরবর্তী ধাপ" : "Next: Check Symptoms"}</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Symptoms Matrix */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Swelling */}
                      <button 
                        onClick={() => setVitals({...vitals, swelling: !vitals.swelling})}
                        className={cn(
                          "p-4 rounded-xl border text-left flex flex-col justify-between transition-all h-28",
                          vitals.swelling 
                            ? "bg-amber-50 border-amber-300 text-amber-900" 
                            : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <span className="text-xs font-black uppercase tracking-wider">
                          {language === 'bn' ? "হাত-পা ফোলা ভাব" : "Swelling / Edema"}
                        </span>
                        <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded bg-white/60 self-start mt-2">
                          {vitals.swelling ? (language === 'bn' ? "হ্যাঁ" : "Yes") : (language === 'bn' ? "না" : "No")}
                        </span>
                      </button>

                      {/* Fever */}
                      <button 
                        onClick={() => setVitals({...vitals, fever: !vitals.fever})}
                        className={cn(
                          "p-4 rounded-xl border text-left flex flex-col justify-between transition-all h-28",
                          vitals.fever 
                            ? "bg-amber-50 border-amber-300 text-amber-900" 
                            : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <span className="text-xs font-black uppercase tracking-wider">
                          {language === 'bn' ? "উচ্চ জ্বর বা কাঁপুনি" : "High Fever"}
                        </span>
                        <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded bg-white/60 self-start mt-2">
                          {vitals.fever ? (language === 'bn' ? "হ্যাঁ" : "Yes") : (language === 'bn' ? "না" : "No")}
                        </span>
                      </button>

                      {/* Diabetes */}
                      <button 
                        onClick={() => setVitals({...vitals, diabetes_history: !vitals.diabetes_history})}
                        className={cn(
                          "p-4 rounded-xl border text-left flex flex-col justify-between transition-all h-28",
                          vitals.diabetes_history 
                            ? "bg-emerald-50 border-emerald-300 text-emerald-950" 
                            : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <span className="text-xs font-black uppercase tracking-wider">
                          {language === 'bn' ? "ডায়াবেটিস ইতিহাস" : "Diabetes History"}
                        </span>
                        <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded bg-white/60 self-start mt-2">
                          {vitals.diabetes_history ? (language === 'bn' ? "হ্যাঁ" : "Yes") : (language === 'bn' ? "না" : "No")}
                        </span>
                      </button>

                      {/* Bleeding (🚨 Dangerous!) */}
                      <button 
                        onClick={() => setVitals({...vitals, bleeding: !vitals.bleeding})}
                        className={cn(
                          "p-4 rounded-xl border text-left flex flex-col justify-between transition-all h-28 border-dashed",
                          vitals.bleeding 
                            ? "bg-red-50 border-red-500 text-red-900 shadow-md shadow-red-100 animate-pulse" 
                            : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-red-600">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {language === 'bn' ? "যোনিপথে রক্তপাত" : "Vaginal Bleeding"}
                        </span>
                        <span className={cn(
                          "text-[10px] font-black uppercase px-2 py-0.5 rounded self-start mt-2",
                          vitals.bleeding ? "bg-red-600 text-white" : "bg-white/60 text-slate-500"
                        )}>
                          {vitals.bleeding ? (language === 'bn' ? "জরুরী বিপদ!" : "Emergency!") : (language === 'bn' ? "না" : "No")}
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Headache Severity Dropdown */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                          {language === 'bn' ? "মাথাব্যথার তীব্রতা" : "Headache Severity"}
                        </label>
                        <select
                          value={vitals.headache_severity}
                          onChange={(e: any) => setVitals({...vitals, headache_severity: e.target.value})}
                          className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="none">{language === 'bn' ? "মাথাব্যথা নেই" : "No Headache"}</option>
                          <option value="mild">{language === 'bn' ? "সামান্য মাথাব্যথা" : "Mild Headache"}</option>
                          <option value="moderate">{language === 'bn' ? "মাঝারি ব্যথ" : "Moderate Headache"}</option>
                          <option value="severe">{language === 'bn' ? "তীব্র মাথাব্যথা" : "Severe Headache"}</option>
                        </select>
                      </div>

                      {/* Fetal Kicks / Movement */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                          {language === 'bn' ? "বাচ্চার নড়াচড়া" : "Fetal Kicking Status"}
                        </label>
                        <select
                          value={vitals.fetal_movement}
                          onChange={(e: any) => setVitals({...vitals, fetal_movement: e.target.value})}
                          className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="normal">{language === 'bn' ? "স্বাভাবিক নড়াচড়া" : "Normal kicks (10+)"}</option>
                          <option value="reduced">{language === 'bn' ? "নড়াচড়া হ্রাস পেয়েছে" : "Reduced kicks (<10)"}</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button 
                        onClick={() => setStep(1)}
                        className="w-1/3 py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest transition-all"
                      >
                         {language === 'bn' ? "পেছনে" : "Back"}
                      </button>
                      <button 
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="w-2/3 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-blue-100 transition-all"
                      >
                         {isSubmitting ? (
                           <RefreshCw className="h-5 w-5 animate-spin" />
                         ) : (
                           <Activity className="h-5 w-5" />
                         )}
                         <span>{language === 'bn' ? "তথ্য সংরক্ষণ ও এআই বিশ্লেষণ" : "Save & Analyze"}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
