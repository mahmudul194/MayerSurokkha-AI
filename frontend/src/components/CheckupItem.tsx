import { cn } from "@/lib/utils";

export function CheckupItem({ date, label, doc, active, language }: any) {
   return (
      <div className={cn(
        "p-5 rounded-[1.5rem] border flex items-center justify-between transition-all",
        active ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-100"
      )}>
         <div>
            <div className={cn(
              "font-black uppercase tracking-widest", 
              active ? "text-blue-500" : "text-slate-400",
              language === 'bn' ? "text-[15px]" : "text-[11px]"
            )}>{date}</div>
            <div className="text-sm font-black text-slate-900 uppercase tracking-tight mt-1">{label}</div>
            <div className="text-[13px] font-bold text-slate-400 mt-1">{doc}</div>
         </div>
      </div>
   );
}
