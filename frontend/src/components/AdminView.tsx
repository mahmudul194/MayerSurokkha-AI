'use client';

import { cn } from "@/lib/utils";
import { 
  BarChart3, Globe, Shield, Users, Server, 
  Activity, Zap, Database, TrendingUp, AlertCircle
} from "lucide-react";

export function AdminView({ t, language }: any) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="asymmetric-panel bg-white p-6 md:p-8 border-white shadow-xl shadow-slate-200/20">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Globe className="h-5 w-5 text-indigo-500" />
               </div>
               <span className="text-slate-400 font-black uppercase tracking-widest text-[13px]">{t.global_coverage || "Global Coverage"}</span>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tighter">14 Districts</div>
         </div>
         <div className="asymmetric-panel bg-white p-6 md:p-8 border-white shadow-xl shadow-slate-200/20">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Server className="h-5 w-5 text-blue-500" />
               </div>
               <span className="text-slate-400 font-black uppercase tracking-widest text-[13px]">{t.node_status || "Neural Nodes"}</span>
            </div>
            <div className="text-3xl font-black text-green-600 tracking-tighter">{language === 'bn' ? "সুস্থ" : "Healthy"} (28/28)</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 asymmetric-panel bg-white p-6 md:p-12 border-white shadow-2xl shadow-slate-200/30">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.neural_load_analytics || "Neural Load Analytics"}</h3>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[13px] mt-1">{language === 'bn' ? "লাইভ এআই পারফরম্যান্স" : "Live AI Performance Monitoring"}</p>
               </div>
               <BarChart3 className="h-6 w-6 text-slate-300" />
            </div>
            <div className="h-64 flex items-end gap-3 px-4">
               {[40, 70, 45, 90, 65, 80, 50, 85, 60, 75, 45, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-slate-50 rounded-t-lg relative group transition-all hover:bg-indigo-500 cursor-help" style={{ height: `${h}%` }}>
                     <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}% {language === 'bn' ? "লোড" : "LOAD"}
                     </div>
                  </div>
               ))}
            </div>
            <div className="flex justify-between mt-8 text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] px-4">
               <span>00:00</span>
               <span>06:00</span>
               <span>12:00</span>
               <span>18:00</span>
               <span>23:59</span>
            </div>
         </div>

         <div className="asymmetric-panel bg-linear-to-br from-slate-900 to-indigo-950 p-6 md:p-12 relative overflow-hidden">
            <div className="relative z-10 text-white">
               <Shield className="h-12 w-12 text-indigo-400 mb-8" />
               <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{t.security_audit || "Security Audit"}</h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                     <span className="text-[13px] font-black uppercase tracking-widest text-white/50">Data Encryption</span>
                     <span className="text-[13px] font-black text-green-400">AES-256 ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                     <span className="text-[13px] font-black uppercase tracking-widest text-white/50">Access Logs</span>
                     <span className="text-[13px] font-black text-blue-400">VERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                     <span className="text-[13px] font-black uppercase tracking-widest text-white/50">Anomaly Detection</span>
                     <span className="text-[13px] font-black text-indigo-400">0 DETECTED</span>
                  </div>
               </div>
               <button className="mt-10 w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 text-[13px] font-black uppercase tracking-[0.3em] transition-all">
                  Run Full Protocol
               </button>
            </div>
            <Activity className="absolute right-[-20px] bottom-[-20px] h-64 w-64 text-white/5" />
         </div>
      </div>
    </div>
  );
}
