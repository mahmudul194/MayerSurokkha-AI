import { cn } from "@/lib/utils";

export function TimelineSection({ currentWeek, toBN, language, t }: any) {
  return (
    <div className="asymmetric-panel bg-white p-12 border-white shadow-2xl shadow-slate-200/30 overflow-hidden">
       <div className="flex items-center justify-between mb-12">
          <div>
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.pregnancy_journey}</h3>
             <p className={cn("font-black text-slate-400 uppercase tracking-widest mt-1",
               language === 'bn' ? "text-[12px]" : "text-[10px]"
             )}>{language === 'bn' ? "ইন্টারেক্টিভ জেস্টেশন ম্যাপ" : "Interactive Gestation Map"}</p>
          </div>
          <div className={cn("px-6 py-2 bg-blue-50 rounded-full text-blue-600 font-black uppercase tracking-widest border border-blue-100",
            language === 'bn' ? "text-[15px]" : "text-[13px]"
          )}>
             {language === 'bn' ? `বর্তমান অবস্থা: সপ্তাহ ${toBN(currentWeek)}` : `Current: Week ${currentWeek}`}
          </div>
       </div>
       <div className="relative pt-10 pb-4 overflow-x-auto">
          <div className="flex gap-12 min-w-[1000px] items-center px-4">
             {[16, 20, 24, 28, 32, 36, 40].map((w) => (
                <div key={w} className={cn(
                  "flex flex-col items-center gap-4 relative transition-all",
                  w === currentWeek ? "scale-125 z-10" : "opacity-40"
                )}>
                   <div className={cn(
                     "h-20 w-20 rounded-[1.5rem] flex flex-col items-center justify-center font-black transition-all text-center p-2",
                     w === currentWeek ? "bg-blue-600 text-white shadow-xl shadow-blue-200" : "bg-slate-100 text-slate-400"
                   )}>
                      <span className={cn("leading-tight", language === 'bn' ? "text-[12px]" : "text-[10px]")}>
                         {language === 'bn' ? "সপ্তাহ" : "WEEK"}
                      </span>
                      <span className={cn("leading-none", language === 'bn' ? "text-[20px]" : "text-[18px]")}>
                         {language === 'bn' ? toBN(w) : w}
                      </span>
                   </div>
                   <span className={cn("font-black uppercase tracking-widest", 
                      w === currentWeek ? "text-blue-600" : "text-slate-400",
                      language === 'bn' ? "text-[15px]" : "text-[11px]"
                    )}>
                       {w === currentWeek ? (language === 'bn' ? "সক্রিয়" : "Active") : (language === 'bn' ? "মাইলস্টোন" : "Milestone")}
                    </span>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}
