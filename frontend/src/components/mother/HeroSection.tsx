import { cn } from "@/lib/utils";
import { Sun, Baby, Volume2, Mic, Shield, Heart } from "lucide-react";

export function HeroSection({ 
  currentWeek, toBN, language, t, risk, prediction, latestRecord, 
  currentGrowth, isActuallyPlaying, setIsAudioPlaying, speak 
}: any) {
  const adviceText = language === 'bn' 
    ? (prediction?.advice_bn || latestRecord?.advice_bn || "কোনো সাম্প্রতিক ডায়াগনস্টিক তথ্য পাওয়া যায়নি। কৃপয়া আপনার ভাইটালস লগ করুন।")
    : (prediction?.explanation || latestRecord?.explanation || "No recent logs detected. Please use the 'Log Vitals' tool to update your AI diagnostic score.");

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <div className="asymmetric-panel lg:col-span-8 bg-linear-to-br from-blue-600 to-indigo-700 p-16 relative overflow-hidden group">
         <div className="relative z-10 flex flex-col justify-between h-full text-white">
            <div>
               <div className={cn("inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-white font-black uppercase tracking-widest mb-8",
                 language === 'bn' ? "text-[15px]" : "text-[13px]"
               )}>
                  <Sun className="h-4 w-4" /> {language === 'bn' ? `শুভেচ্ছা • ${getOrdinalWeek(currentWeek)}` : `Nexus Greeting • ${getOrdinalWeek(currentWeek)}`}
               </div>
               <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tighter">
                  {language === 'bn' ? "আপনার যাত্রা," : "Your Journey,"} <br/> 
                  {language === 'bn' ? "সম্পূর্ণ সুরক্ষিত।" : "Fully Protected."}
               </h2>
               <p className="mt-8 text-blue-50 text-xl font-medium opacity-80 max-w-sm leading-relaxed italic border-l-2 border-white/20 pl-8">
                  {risk === 'High' 
                    ? (language === 'bn' ? "সতর্কতা: আপনার রক্তচাপ বেশি। অনুগ্রহ করে দ্রুত ডাক্তারের পরামর্শ নিন।" : "Warning: Elevated vitals detected. Please consult your physician immediately.")
                    : (language === 'bn' ? "এআই ডায়াগনস্টিকস নিশ্চিত করে যে আপনার গর্ভধারণ চিকিৎসাগতভাবে নিখুঁত।" : "AI diagnostics confirm your gestation is clinically on track.")
                  }
               </p>
            </div>
            <div className="mt-12 flex gap-6">
               <div className="bg-white/10 rounded-[2rem] p-8 backdrop-blur-xl border border-white/10 flex-1">
                  <span className={cn("text-blue-100 font-black uppercase tracking-widest opacity-60",
                      language === 'bn' ? "text-[15px]" : "text-[13px]"
                    )}>{language === 'bn' ? "শিশুর বৃদ্ধি" : "Baby Growth"}</span>
                  <div className="mt-2 text-3xl font-bold text-white flex items-center justify-between">{currentGrowth.name} {currentGrowth.icon}</div>
               </div>
               <div className="bg-white/10 rounded-[2rem] p-8 backdrop-blur-xl border border-white/10 flex-1">
                  <span className={cn("text-blue-100 font-black uppercase tracking-widest opacity-60",
                      language === 'bn' ? "text-[15px]" : "text-[13px]"
                    )}>{language === 'bn' ? "সম্ভাব্য প্রসবের তারিখ" : "Estimated Delivery"}</span>
                  <div className="mt-2 text-3xl font-bold text-white flex items-center justify-between">{language === 'bn' ? "ফেব্রুয়ারি ১৪" : "Feb 14"} <Heart className="h-6 w-6 text-white/40" /></div>
               </div>
            </div>
         </div>
         <div className="absolute right-[-40px] bottom-[-40px] opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
            <Baby className="h-96 w-96 text-white fill-white" />
         </div>
      </div>

      <div className={cn(
        "asymmetric-panel lg:col-span-4 p-12 flex flex-col justify-between relative overflow-hidden",
        risk === 'High' ? "bg-red-50 border-red-100 shadow-xl shadow-red-200" : "bg-white shadow-2xl shadow-slate-200/40 border-white"
      )}>
         <div>
            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-10 shadow-sm", risk === 'High' ? "bg-red-100" : "bg-blue-50")}>
               <Shield className={cn("h-7 w-7", risk === 'High' ? "text-red-500" : "text-blue-500")} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 leading-tight">{t.diagnostic_summary}</h3>
            <p className="mt-6 text-slate-500 text-base leading-relaxed font-medium">
               {adviceText}
            </p>
         </div>
         <div className="mt-10 pt-8 border-t border-slate-100">
            <button 
              onClick={() => {
                 setIsAudioPlaying(!isActuallyPlaying);
                 speak(adviceText, 999);
              }}
              className={cn("flex items-center gap-4 font-black uppercase tracking-[0.2em] hover:bg-blue-50 px-5 py-3 rounded-2xl transition-all w-full justify-between",
                language === 'bn' ? "text-[15px]" : "text-[13px]",
                isActuallyPlaying ? "text-green-600 bg-green-50 animate-pulse" : "text-blue-600"
              )}
            >
                {isActuallyPlaying ? (language === 'bn' ? "পরামর্শ শুনুন..." : "Playing...") : t.audio_advice} 
                {isActuallyPlaying ? <Volume2 className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
         </div>
      </div>
    </div>
  );
}
