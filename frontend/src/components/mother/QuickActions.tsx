import { Plus, Phone } from "lucide-react";
import { CheckupItem } from "../CheckupItem";

export function QuickActions({ language, t, onLog, onSOS }: any) {
  return (
    <div className="space-y-8">
       <div className="asymmetric-panel bg-white p-10 border-white shadow-2xl shadow-slate-200/40">
          <h4 className="text-lg font-black text-slate-900 mb-6">{t.upcoming_checkups}</h4>
          <div className="space-y-4">
             <CheckupItem date={language === 'bn' ? "২৪ অক্টোবর" : "Oct 24"} label={language === 'bn' ? "নিয়মিত চেকআপ" : "Routine ANC"} doc={language === 'bn' ? "ডাঃ সাবিনা" : "Dr. Sabina"} active language={language} />
             <CheckupItem date={language === 'bn' ? "১২ নভেম্বর" : "Nov 12"} label={language === 'bn' ? "বৃদ্ধি পরীক্ষা" : "Growth Scan"} doc={language === 'bn' ? "রেডিওলজি সেন্টার" : "Radiology Center"} language={language} />
          </div>
       </div>
       <button onClick={onLog} className="asymmetric-panel w-full p-10 bg-blue-600 text-white border-none group hover:scale-[1.02] transition-all flex flex-col items-center text-center shadow-2xl shadow-blue-200">
          <Plus className="h-16 w-16 mb-6 group-hover:rotate-90 transition-transform" />
          <h3 className="text-2xl font-black uppercase tracking-tight">{t.log_vitals}</h3>
       </button>
       <button onClick={onSOS} className="asymmetric-panel w-full p-8 bg-red-50 border-red-100 group flex items-center justify-between transition-all hover:bg-red-500 hover:text-white">
          <div>
             <h4 className="text-lg font-black text-slate-900 group-hover:text-white uppercase tracking-tight">{t.sos}</h4>
          </div>
          <Phone className="h-8 w-8 text-red-600 group-hover:text-white" />
       </button>
    </div>
  );
}
