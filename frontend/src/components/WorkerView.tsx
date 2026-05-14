'use client';

import { cn } from "@/lib/utils";
import { 
  Users, MapPin, Database, RefreshCw, Plus, 
  Search, Shield, CheckCircle2, Navigation
} from "lucide-react";

export function WorkerView({ onSync, onRegister, isSyncing, t, language }: any) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="asymmetric-panel bg-white p-8 border-white shadow-xl shadow-slate-200/20">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Navigation className="h-5 w-5 text-emerald-500" />
               </div>
               <span className="text-slate-400 font-black uppercase tracking-widest text-[13px]">{t.today_visits || "Today's Visits"}</span>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tighter">12 / 20</div>
         </div>
         <div className="asymmetric-panel bg-white p-8 border-white shadow-xl shadow-slate-200/20">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-500" />
               </div>
               <span className="text-slate-400 font-black uppercase tracking-widest text-[13px]">{t.offline_vault || "Local Vault"}</span>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tighter">85 Records</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <button 
           onClick={onRegister}
           className="asymmetric-panel bg-linear-to-br from-emerald-600 to-teal-700 p-12 group hover:scale-[1.02] transition-all text-left relative overflow-hidden"
         >
            <div className="relative z-10 text-white">
               <Plus className="h-16 w-16 mb-6 group-hover:rotate-90 transition-transform" />
               <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">{t.register_mother || "New Mother Registration"}</h3>
               <p className="mt-4 text-emerald-50 font-medium opacity-80 uppercase tracking-widest text-[13px]">Start AI Diagnostic Journey</p>
            </div>
            <Users className="absolute right-[-20px] bottom-[-20px] h-64 w-64 text-white/10" />
         </button>

         <button 
           onClick={onSync}
           disabled={isSyncing}
           className="asymmetric-panel bg-white p-12 border-white shadow-2xl shadow-slate-200/40 group hover:scale-[1.02] transition-all text-left relative overflow-hidden"
         >
            <div className="relative z-10">
               <RefreshCw className={cn("h-16 w-16 mb-6 text-blue-600 transition-transform", isSyncing && "animate-spin")} />
               <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{t.sync_vault || "Sync Local Vault"}</h3>
               <p className="mt-4 text-slate-400 font-black uppercase tracking-widest text-[13px]">{isSyncing ? "Neural Link Active..." : "Push 85 Local Records to Cloud"}</p>
            </div>
            <Database className="absolute right-[-20px] bottom-[-20px] h-64 w-64 text-slate-50" />
         </button>
      </div>

      <div className="asymmetric-panel bg-white p-12 border-white shadow-2xl shadow-slate-200/30">
         <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">{t.recent_field_activity || "Recent Field Activity"}</h3>
         <div className="space-y-4">
            {[
               { mother: "Fatema Begum", action: "Vitals Recorded", time: "10 mins ago", status: "Synced" },
               { mother: "Rahima Khatun", action: "New Registration", time: "1 hour ago", status: "Local" },
               { mother: "Sultana Razia", action: "SOS Response", time: "3 hours ago", status: "Synced" }
            ].map((activity, idx) => (
               <div key={idx} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                  <div className="flex items-center gap-6">
                     <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-blue-600">
                        {activity.mother[0]}
                     </div>
                     <div>
                        <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{activity.mother}</div>
                        <div className="text-[13px] font-bold text-slate-400 mt-1">{activity.action} • {activity.time}</div>
                     </div>
                  </div>
                  <div className={cn(
                     "px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border",
                     activity.status === 'Synced' ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"
                  )}>
                     {language === 'bn' ? (activity.status === 'Synced' ? "সিঙ্কড" : "লোকাল") : activity.status}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
