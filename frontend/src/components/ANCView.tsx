'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, CheckCircle2, Circle, 
  Clock, AlertCircle, Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";

export function ANCView({ currentWeek, t, language }: any) {
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    const saved = await db.ancVisits.toArray();
    const defaultSchedule = [
      { week: 12, label: language === 'bn' ? "প্রথম চেকআপ (৩ মাস)" : "1st Checkup", status: 'completed' },
      { week: 20, label: language === 'bn' ? "বাচ্চার গঠন পরীক্ষা (অ্যানোমালি স্ক্যান)" : "Anomaly Scan", status: 'completed' },
      { week: 28, label: language === 'bn' ? "তৃতীয় চেকআপ (৭ মাস)" : "3rd Checkup", status: 'active' },
      { week: 32, label: language === 'bn' ? "বাচ্চার বৃদ্ধি পরীক্ষা (গ্রোথ স্ক্যান)" : "Growth Scan", status: 'pending' },
      { week: 36, label: language === 'bn' ? "চতুর্থ চেকআপ (৯ মাস)" : "4th Checkup", status: 'pending' },
      { week: 40, label: language === 'bn' ? "প্রসবের প্রস্তুতি" : "Delivery Prep", status: 'pending' },
    ];

    if (saved.length > 0) {
      const merged = defaultSchedule.map(item => {
        const found = saved.find(s => s.week === item.week);
        return found ? { ...item, status: found.status } : item;
      });
      setSchedule(merged);
    } else {
      setSchedule(defaultSchedule);
    }
  };

  const toggleStatus = async (week: number) => {
    const updated = schedule.map(item => {
      if (item.week === week) {
        const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
        saveStatus(week, nextStatus);
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setSchedule(updated);
  };

  const saveStatus = async (week: number, status: string) => {
    const existing = await db.ancVisits.where('week').equals(week).first();
    if (existing) {
      await db.ancVisits.update(existing.id!, { status, synced: false });
    } else {
      await db.ancVisits.add({ week, status: status as any, synced: false });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100">
      <div className="p-10 border-b border-slate-50 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="h-14 w-14 bg-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
               <Calendar className="h-7 w-7 text-white" />
            </div>
            <div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t.anc_schedule}</h3>
               <p className="text-slate-400 font-black uppercase tracking-widest text-[13px] mt-1">{language === 'bn' ? "গর্ভকালীন মাইলস্টোন ট্র্যাকার" : "Gestation Milestone Tracker"}</p>
            </div>
         </div>
      </div>

      <div className="p-12">
         <div className="space-y-12 relative before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-1 before:bg-slate-50">
            {schedule.map((item, i) => (
               <div key={i} className={cn(
                 "relative flex gap-8 group transition-all",
                 item.status === 'pending' ? "opacity-60" : "opacity-100"
               )}>
                  <button 
                    onClick={() => toggleStatus(item.week)}
                    className={cn(
                      "relative z-10 h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform hover:scale-110",
                      item.status === 'completed' ? "bg-green-500 text-white shadow-green-100" : 
                      item.status === 'active' ? "bg-blue-600 text-white shadow-blue-100" : "bg-white border border-slate-100 text-slate-300"
                    )}
                  >
                     {item.status === 'completed' ? <CheckCircle2 className="h-6 w-6" /> : 
                      item.status === 'active' ? <Clock className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                  </button>
                  <div className="flex-1 pt-2">
                     <div className="flex items-center justify-between">
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{item.label}</h4>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest",
                          item.status === 'completed' ? "bg-green-50 text-green-600" : 
                          item.status === 'active' ? "bg-blue-50 text-blue-600 animate-pulse" : "bg-slate-50 text-slate-400"
                        )}>
                           {language === 'bn' ? "সপ্তাহ " + item.week : "Week " + item.week}
                        </span>
                     </div>
                     <p className="mt-2 text-slate-400 text-base font-medium">
                        {item.status === 'completed' ? (language === 'bn' ? "চেকআপ সফলভাবে সম্পন্ন হয়েছে।" : "Checkup successfully completed.") : 
                         item.status === 'active' ? (language === 'bn' ? "আপনার পরবর্তী চেকআপের সময় হয়েছে।" : "Time for your upcoming scheduled visit.") : (language === 'bn' ? "ভবিষ্যৎ মাইলস্টোন।" : "Future gestation milestone.")}
                     </p>
                  </div>
               </div>
            ))}
         </div>
      </div>
      
      <div className="p-8 bg-slate-50/50 border-t border-slate-100">
         <div className="asymmetric-panel bg-white p-6 border-slate-100 flex items-center gap-6">
            <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
               <AlertCircle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
               <h5 className="text-base font-black text-slate-900 uppercase tracking-tight">{language === 'bn' ? "জরুরী নির্দেশাবলী" : "Clinical Note"}</h5>
               <p className="text-[13px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{language === 'bn' ? "যেকোনো জটিলতায় দ্রুত আমাদের জানান।" : "Always report unexpected pain or bleeding immediately."}</p>
            </div>
         </div>
      </div>
    </div>
  );
}
