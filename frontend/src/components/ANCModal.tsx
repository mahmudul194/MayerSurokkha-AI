'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Calendar, CheckCircle2, Circle, 
  Clock, AlertCircle, Heart, ChevronDown, ChevronUp, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAncSchedule } from "@/hooks/anc/useAncSchedule";

export function ANCModal({ isOpen, onClose, t, language, showToast }: any) {
  const { 
    schedule, 
    toggleStatus, 
    lmpDate, 
    setLmp, 
    edd, 
    currentGestationWeek 
  } = useAncSchedule(language, showToast);

  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const handleLmpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLmp(e.target.value);
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
            className="relative w-full max-w-3xl h-[85vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-50"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="h-14 w-14 bg-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
                     <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.anc_schedule}</h3>
                     <p className="text-slate-400 font-black uppercase tracking-widest text-[11px] mt-0.5">
                       {language === 'bn' ? "গর্ভকালীন মাইলস্টোন ট্র্যাকার" : "Gestation Milestone Tracker"}
                     </p>
                  </div>
               </div>
               <button onClick={onClose} className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                  <X className="h-6 w-6" />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6" data-lenis-prevent>
              {/* LMP Planner Banner inside Modal */}
              <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      {language === 'bn' ? "শেষ মাসিকের তারিখ (LMP)" : "Last Menstrual Period (LMP)"}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {language === 'bn' ? "আপনার চেকআপের সময়সূচী স্বয়ংক্রিয়ভাবে হিসাব করুন" : "Auto-calculate checkup timelines"}
                    </p>
                  </div>
                  <input 
                    type="date" 
                    value={lmpDate}
                    onChange={handleLmpChange}
                    className="px-3 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {lmpDate && (
                  <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-white animate-pulse" />
                      <span className="text-sm font-black">
                        {language === 'bn' ? `${currentGestationWeek} সপ্তাহ গর্ভবতী` : `${currentGestationWeek} Weeks Pregnant`}
                      </span>
                    </div>
                    <div className="text-sm font-black text-pink-50 bg-white/10 px-3 py-1 rounded-lg">
                      {language === 'bn' ? `প্রসবের তারিখ: ${edd}` : `EDD: ${edd}`}
                    </div>
                  </div>
                )}
              </div>

              {/* Checklist Timeline */}
              <div className="space-y-6 relative before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-1 before:bg-slate-50">
                 {schedule.map((item, i) => {
                    const isExpanded = expandedWeek === item.week;
                    return (
                      <div key={i} className={cn(
                        "relative flex gap-6 group transition-all duration-300",
                        item.status === 'pending' ? "opacity-75" : "opacity-100"
                      )}>
                         <button 
                           onClick={() => toggleStatus(item.week)}
                           className={cn(
                             "relative z-10 h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform hover:scale-110 shrink-0",
                             item.status === 'completed' ? "bg-green-500 text-white shadow-green-100" : 
                             item.status === 'active' ? "bg-blue-600 text-white shadow-blue-100" : "bg-white border border-slate-100 text-slate-300"
                           )}
                         >
                            {item.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : 
                             item.status === 'active' ? <Clock className="h-5 w-5 animate-pulse" /> : <Circle className="h-5 w-5" />}
                         </button>

                         <div className="flex-1 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                            <div 
                              onClick={() => setExpandedWeek(isExpanded ? null : item.week)}
                              className="flex items-center justify-between cursor-pointer"
                            >
                               <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">{item.label}</h4>
                                    <span className={cn(
                                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0",
                                      item.status === 'completed' ? "bg-green-50 text-green-600" : 
                                      item.status === 'active' ? "bg-blue-50 text-blue-600 animate-pulse" : "bg-slate-50 text-slate-400"
                                    )}>
                                       {language === 'bn' ? "সপ্তাহ " + item.week : "Week " + item.week}
                                    </span>
                                  </div>
                                  
                                  {item.targetDate ? (
                                    <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mt-0.5 block">
                                      {language === 'bn' ? `প্রত্যাশিত তারিখ: ${item.targetDate}` : `Target Date: ${item.targetDate}`}
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">
                                      {language === 'bn' ? "তারিখ গণনা করতে LMP সেট করুন" : "Set LMP to calculate dates"}
                                    </span>
                                  )}
                               </div>
                               
                               <div className="text-slate-400 hover:text-slate-600">
                                 {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                               </div>
                            </div>

                            {/* Expanded Checklist */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="mt-4 border-t border-slate-100 pt-4 space-y-3 overflow-hidden"
                                >
                                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                                     {language === 'bn' ? "পরীক্ষা ও করণীয় চেকলিস্ট:" : "Clinical Checklist:"}
                                   </span>
                                   <ul className="space-y-2">
                                     {item.checklist.map((task: string, idx: number) => (
                                       <li key={idx} className="flex items-start gap-2 text-slate-600 text-xs font-medium">
                                         <Activity className="h-3.5 w-3.5 text-pink-500 mt-0.5 shrink-0" />
                                         <span>{task}</span>
                                       </li>
                                     ))}
                                   </ul>

                                   <div className="mt-3 pt-3 border-t border-slate-100">
                                     <button
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         toggleStatus(item.week);
                                       }}
                                       className={cn(
                                         "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                                         item.status === 'completed' 
                                           ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                           : "bg-green-500 text-white hover:bg-green-600 shadow-sm"
                                       )}
                                     >
                                       {item.status === 'completed' 
                                         ? (language === 'bn' ? "অসম্পূর্ণ চিহ্নিত করুন" : "Mark as Incomplete")
                                         : (language === 'bn' ? "সম্পূর্ণ চিহ্নিত করুন" : "Mark as Completed")}
                                     </button>
                                   </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                         </div>
                      </div>
                    );
                 })}
              </div>
            </div>

            {/* Footer Alert */}
            <div className="p-6 bg-slate-50 border-t border-slate-100">
               <div className="bg-white p-4 border border-slate-100 rounded-xl flex items-center gap-4">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    {language === 'bn' 
                      ? "গর্ভকালীন তীব্র মাথাব্যথা, রক্তক্ষরণ, জ্বর বা হাত-পা ফুলে যাওয়ার মতো উপসর্গে অবিলম্বে হাসপাতালে যান।" 
                      : "Go to a clinical center immediately in case of bleeding, high fever, severe head pain, or swelling."}
                  </p>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
