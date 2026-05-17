import { cn } from "@/lib/utils";

export function VitalBox({ icon, label, value, status, color, language }: any) {
  return (
    <div className="asymmetric-panel bg-white p-5 md:p-8 border-white shadow-xl shadow-slate-200/20 group hover:scale-[1.02] transition-all">
       <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6", 
         color === 'blue' ? "bg-blue-50" : color === 'pink' ? "bg-pink-50" : "bg-emerald-50"
       )}>
          {icon}
       </div>
       <span className={cn("text-slate-400 font-black uppercase tracking-widest",
         language === 'bn' ? "text-[15px]" : "text-[13px]"
       )}>{label}</span>
       <div className="mt-2 text-3xl font-black text-slate-900 tracking-tight">{value}</div>
       <div className={cn(
         "mt-3 text-[12px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block",
         status === 'Optimal' || status === 'Normal' ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
       )}>
          {language === 'bn' ? (
             status === 'Optimal' || status === 'Normal' ? 'স্বাভাবিক' : 
             status === 'Caution' ? 'সতর্কতা' : 
             status === 'No Data' ? 'তথ্য নেই' : status
           ) : status}
       </div>
    </div>
  );
}
