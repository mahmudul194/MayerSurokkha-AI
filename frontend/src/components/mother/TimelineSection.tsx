import { cn } from "@/lib/utils";

export function TimelineSection({ currentWeek, toBN, language, t, onUpdateWeek }: any) {
  const getOrdinalWeek = (week: number) => {
    if (language === 'bn') {
      const banglaDigits: any = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
      const toBNNum = (n: number) => n.toString().split('').map(d => banglaDigits[d] || d).join('');
      if (week === 1) return "১ম সপ্তাহ";
      if (week === 2) return "২য় সপ্তাহ";
      if (week === 3) return "৩য় সপ্তাহ";
      if (week === 4) return "৪র্থ সপ্তাহ";
      return `${toBNNum(week)}তম সপ্তাহ`;
    } else {
      if (week === 1) return "1st Week";
      if (week === 2) return "2nd Week";
      if (week === 3) return "3rd Week";
      const suffix = (week % 10 === 1 && week !== 11) ? "st" :
                     (week % 10 === 2 && week !== 12) ? "nd" :
                     (week % 10 === 3 && week !== 13) ? "rd" : "th";
      return `${week}${suffix} Week`;
    }
  };

  return (
    <div className="asymmetric-panel bg-white p-6 md:p-12 border-white shadow-2xl shadow-slate-200/30 overflow-hidden">
       <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-8 md:mb-12">
          <div>
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.pregnancy_journey}</h3>
             <p className={cn("font-black text-slate-400 uppercase tracking-widest mt-1",
               language === 'bn' ? "text-[12px]" : "text-[10px]"
             )}>{language === 'bn' ? "ইন্টারেক্টিভ জেস্টেশন ম্যাপ" : "Interactive Gestation Map"}</p>
          </div>
          <div className={cn("px-6 py-2 bg-blue-50 rounded-full text-blue-600 font-black uppercase tracking-widest border border-blue-100",
            language === 'bn' ? "text-[15px]" : "text-[13px]"
          )}>
             {language === 'bn' ? `বর্তমান অবস্থা: ${getOrdinalWeek(currentWeek)}` : `Current: ${getOrdinalWeek(currentWeek)}`}
          </div>
       </div>
       <div className="relative pt-10 pb-4 overflow-x-auto">
          <div className="flex gap-12 min-w-[1000px] items-center px-4">
             {[16, 20, 24, 28, 32, 36, 40].map((w) => (
                <button 
                  key={w} 
                  onClick={() => onUpdateWeek && onUpdateWeek(w)}
                  className={cn(
                    "flex flex-col items-center gap-4 relative transition-all cursor-pointer select-none group focus:outline-none",
                    w === currentWeek ? "scale-125 z-10 opacity-100" : "opacity-50 hover:opacity-85 hover:scale-105"
                  )}
                >
                   <div className={cn(
                     "h-20 w-20 rounded-[1.5rem] flex flex-col items-center justify-center font-black transition-all text-center p-2",
                     w === currentWeek ? "bg-blue-600 text-white shadow-xl shadow-blue-200" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                   )}>
                      <span className={cn("leading-tight", language === 'bn' ? "text-[12px]" : "text-[10px]")}>
                         {language === 'bn' ? "সপ্তাহ" : "WEEK"}
                      </span>
                      <span className={cn("leading-none", language === 'bn' ? "text-[20px]" : "text-[18px]")}>
                         {language === 'bn' ? toBN(w) : w}
                      </span>
                   </div>
                   <span className={cn("font-black uppercase tracking-widest transition-colors", 
                      w === currentWeek ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500",
                      language === 'bn' ? "text-[15px]" : "text-[11px]"
                    )}>
                       {w === currentWeek ? (language === 'bn' ? "সক্রিয়" : "Active") : (language === 'bn' ? "মাইলস্টোন" : "Milestone")}
                    </span>
                </button>
             ))}
          </div>
       </div>
    </div>
  );
}
