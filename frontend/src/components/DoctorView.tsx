'use client';

import { cn } from "@/lib/utils";
import { 
  Users, Activity, Shield, AlertTriangle, Search, Filter, 
  ChevronRight, Calendar, User, Phone, MapPin
} from "lucide-react";
import { VitalBox } from "./VitalBox";

export function DoctorView({ t, language }: any) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="asymmetric-panel bg-white p-8 border-white shadow-xl shadow-slate-200/20">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
               </div>
               <span className="text-slate-400 font-black uppercase tracking-widest text-[13px]">{t.active_mothers || "Active Mothers"}</span>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tighter">1,284</div>
         </div>
         <div className="asymmetric-panel bg-white p-8 border-white shadow-xl shadow-slate-200/20">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
               </div>
               <span className="text-slate-400 font-black uppercase tracking-widest text-[13px]">{t.high_risk_cases || "High Risk"}</span>
            </div>
            <div className="text-3xl font-black text-red-600 tracking-tighter">42</div>
         </div>
      </div>

      <div className="asymmetric-panel bg-white p-12 border-white shadow-2xl shadow-slate-200/30">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.patient_queue || "Patient Queue"}</h3>
               <p className="text-slate-400 font-black uppercase tracking-widest text-[13px] mt-1">{language === 'bn' ? "লাইভ ডায়াগনস্টিক ফিড" : "Live Diagnostic Feed"}</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                     type="text" 
                     placeholder={language === 'bn' ? "রোগী খুঁজুন..." : "Search patients..."}
                     className="bg-transparent border-none focus:ring-0 text-sm font-bold pl-12 pr-4 w-64"
                  />
               </div>
               <button className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100">
                  <Filter className="h-4 w-4 text-slate-600" />
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-4">
            {[
               { name: "Fatema Begum", id: "MS-0842", risk: "High", week: 28, lastBP: "150/95", location: "Mirpur-10" },
               { name: "Rahima Khatun", id: "MS-0911", risk: "Medium", week: 32, lastBP: "135/85", location: "Kalyanpur" },
               { name: "Sultana Razia", id: "MS-1023", risk: "Low", week: 20, lastBP: "120/80", location: "Pallabi" }
            ].map((p, idx) => (
               <div key={idx} className="group asymmetric-panel bg-slate-50/50 hover:bg-white p-8 border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/30 transition-all cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-8">
                     <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center font-black text-blue-600 text-xl border border-slate-100">
                        {p.name[0]}
                     </div>
                     <div>
                        <div className="flex items-center gap-3">
                           <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{p.name}</h4>
                           <span className={cn(
                              "px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest",
                              p.risk === 'High' ? "bg-red-100 text-red-600" : p.risk === 'Medium' ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
                           )}>{language === 'bn' ? (p.risk === 'High' ? "উচ্চ" : p.risk === 'Medium' ? "মাঝারি" : "কম") : p.risk} {language === 'bn' ? "ঝুঁকি" : "Risk"}</span>
                        </div>
                        <div className="flex items-center gap-6 mt-2">
                            <span className="flex items-center gap-2 text-[13px] font-black text-slate-400 uppercase tracking-widest">
                              <Calendar className="h-3 w-3" /> Week {p.week}
                           </span>
                           <span className="flex items-center gap-2 text-[13px] font-black text-slate-400 uppercase tracking-widest">
                              <Activity className="h-3 w-3" /> BP: {p.lastBP}
                           </span>
                           <span className="flex items-center gap-2 text-[13px] font-black text-slate-400 uppercase tracking-widest">
                              <MapPin className="h-3 w-3" /> {p.location}
                           </span>
                        </div>
                     </div>
                  </div>
                  <button className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                     <ChevronRight className="h-6 w-6" />
                  </button>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
