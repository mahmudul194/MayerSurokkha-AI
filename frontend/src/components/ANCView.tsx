'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, CheckCircle2, Circle, 
  Clock, AlertCircle, Heart, ChevronDown, ChevronUp, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAncSchedule } from "@/hooks/anc/useAncSchedule";

export function ANCView({ t, language, showToast }: any) {
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* LMP Planner Panel */}
      <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h4 className="text-xl font-black text-slate-900 tracking-tight">
              {language === 'bn' ? "গর্ভকালীন সময় ক্যালকুলেটর" : "Gestational Planner"}
            </h4>
            <p className="text-slate-400 font-medium text-sm">
              {language === 'bn' ? "শেষ মাসিকের তারিখ (LMP) দিন এবং স্বয়ংক্রিয়ভাবে তারিখ নির্ধারণ করুন।" : "Enter your Last Menstrual Period date to calculate clinical visits and EDD."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400">
              {language === 'bn' ? "LMP তারিখ নির্বাচন করুন:" : "Select LMP Date:"}
            </label>
            <input 
              type="date" 
              value={lmpDate}
              onChange={handleLmpChange}
              className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Dynamic EDD & Status Bar */}
        {lmpDate && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-pink-200"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
                <Heart className="h-6 w-6 text-white fill-current" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-100">
                  {language === 'bn' ? "গর্ভকালীন বর্তমান অবস্থা" : "Current Gestational Age"}
                </span>
                <h5 className="text-xl font-black">
                  {language === 'bn' ? `${currentGestationWeek} সপ্তাহ গর্ভবতী` : `${currentGestationWeek} Weeks Pregnant`}
                </h5>
              </div>
            </div>

            <div className="h-px w-full md:h-12 md:w-px bg-white/20" />

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-100">
                {language === 'bn' ? "সম্ভাব্য প্রসবের তারিখ (EDD)" : "Expected Delivery Date (EDD)"}
              </span>
              <h5 className="text-xl font-black">
                {edd}
              </h5>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main ANC Milestones list */}
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="h-14 w-14 bg-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
                 <Calendar className="h-7 w-7 text-white" />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t.anc_schedule}</h3>
                 <p className="text-slate-400 font-black uppercase tracking-widest text-[13px] mt-1">
                   {language === 'bn' ? "ক্লিনিক্যাল চেকআপ মাইলস্টোন" : "Clinical Checkup & Vaccine Milestones"}
                 </p>
              </div>
           </div>
        </div>

        <div className="p-12">
           <div className="space-y-10 relative before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-1 before:bg-slate-50">
              {schedule.map((item, i) => {
                 const isExpanded = expandedWeek === item.week;
                 return (
                   <div key={i} className={cn(
                     "relative flex gap-8 group transition-all duration-300",
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
                         {item.status === 'completed' ? <CheckCircle2 className="h-6 w-6" /> : 
                          item.status === 'active' ? <Clock className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                      </button>

                      <div className="flex-1 p-6 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                         <div 
                           onClick={() => setExpandedWeek(isExpanded ? null : item.week)}
                           className="flex items-center justify-between cursor-pointer"
                         >
                            <div>
                               <div className="flex items-center gap-3">
                                 <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{item.label}</h4>
                                 <span className={cn(
                                   "px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest shrink-0",
                                   item.status === 'completed' ? "bg-green-50 text-green-600" : 
                                   item.status === 'active' ? "bg-blue-50 text-blue-600 animate-pulse" : "bg-slate-50 text-slate-400"
                                 )}>
                                    {language === 'bn' ? "সপ্তাহ " + item.week : "Week " + item.week}
                                 </span>
                               </div>
                               
                               {/* Target Date */}
                               {item.targetDate ? (
                                 <span className="text-[12px] font-bold text-pink-500 uppercase tracking-widest mt-1 block">
                                   {language === 'bn' ? `প্রত্যাশিত তারিখ: ${item.targetDate}` : `Target Date: ${item.targetDate}`}
                                 </span>
                               ) : (
                                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                                   {language === 'bn' ? "তারিখ দেখতে ল্যাপটপে তারিখ লিখুন" : "Define LMP to calculate target date"}
                                 </span>
                               )}
                            </div>
                            
                            <div className="text-slate-400 hover:text-slate-600">
                              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </div>
                         </div>

                         {/* Expandable Checklist Details */}
                         <AnimatePresence>
                           {isExpanded && (
                             <motion.div 
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: "auto", opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               className="mt-6 border-t border-slate-100 pt-6 space-y-4 overflow-hidden"
                             >
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">
                                  {language === 'bn' ? "পরীক্ষা ও প্রেসক্রিপশন চেকলিস্ট:" : "Clinical Checklist & Directives:"}
                                </span>
                                <ul className="space-y-3">
                                  {item.checklist.map((task: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                                      <Activity className="h-4 w-4 text-pink-500 mt-0.5 shrink-0" />
                                      <span>{task}</span>
                                    </li>
                                  ))}
                                </ul>

                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleStatus(item.week);
                                    }}
                                    className={cn(
                                      "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                      item.status === 'completed' 
                                        ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                        : "bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-100"
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
        
        {/* Clinician Advice */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100">
           <div className="asymmetric-panel bg-white p-6 border border-slate-100 rounded-2xl flex items-center gap-6">
              <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                 <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                 <h5 className="text-base font-black text-slate-900 uppercase tracking-tight">{language === 'bn' ? "জরুরী ক্লিনিক্যাল বার্তা" : "Emergency Clinical Message"}</h5>
                 <p className="text-[13px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{language === 'bn' ? "যেকোনো ধরণের রক্তপাত, ঝাপসা দৃষ্টি বা তীব্র মাথাব্যথায় কালক্ষেপণ না করে দ্রুত হাসপাতালে যান।" : "Any vaginal bleeding, blurred vision, or intense headaches require immediate hospital care."}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
