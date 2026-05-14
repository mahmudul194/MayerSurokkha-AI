'use client';

import { useSession } from "next-auth/react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { 
  Sun, Droplets, Zap, Baby, Activity, Heart, 
  Shield, Volume2, Mic, Clock, Plus, Phone, Thermometer
} from "lucide-react";
import { VitalBox } from "./VitalBox";
import { CheckupItem } from "./CheckupItem";

export function MotherView({ prediction, onSOS, onLog, t, language, isAudioPlaying, setIsAudioPlaying }: any) {
  const { data: session } = useSession();
  const records = useLiveQuery(() => 
    db.healthRecords.where('mother_id').equals("MS-0842").toArray()
  );
  
  const latestRecord = records?.[records.length - 1];
  const currentWeek = latestRecord?.week || 28;
  const risk = prediction?.risk_level || latestRecord?.risk_level || "Low";

  const growthStages: any = {
    16: { name: language === 'bn' ? "আভাকাডো" : "Avocado", icon: <Droplets className="h-6 w-6" /> },
    20: { name: language === 'bn' ? "কলা" : "Banana", icon: <Sun className="h-6 w-6" /> },
    24: { name: language === 'bn' ? "ভুট্টা" : "Corn", icon: <Zap className="h-6 w-6" /> },
    28: { name: language === 'bn' ? "বেগুন" : "Eggplant", icon: <Baby className="h-6 w-6" /> },
    32: { name: language === 'bn' ? "কুমড়া" : "Squash", icon: <Activity className="h-6 w-6" /> },
    36: { name: language === 'bn' ? "পেঁপে" : "Papaya", icon: <Heart className="h-6 w-6" /> },
  };

  const currentGrowth = growthStages[currentWeek] || growthStages[28];
  
  const toBN = (num: number | string) => {
    if (language !== 'bn') return num;
    const digits: any = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
    return num.toString().split('').map(d => digits[d] || d).join('');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="asymmetric-panel lg:col-span-8 bg-linear-to-br from-blue-600 to-indigo-700 p-16 relative overflow-hidden group">
           <div className="relative z-10 flex flex-col justify-between h-full text-white">
              <div>
                 <div className={cn("inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-white font-black uppercase tracking-widest mb-8",
                   language === 'bn' ? "text-[15px]" : "text-[13px]"
                 )}>
                    <Sun className="h-4 w-4" /> {language === 'bn' ? `শুভেচ্ছা • সপ্তাহ ${toBN(currentWeek)}` : `Nexus Greeting • Week ${currentWeek}`}
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
                 {language === 'bn' 
                   ? (prediction?.advice_bn || latestRecord?.advice_bn || "কোনো সাম্প্রতিক ডায়াগনস্টিক তথ্য পাওয়া যায়নি। কৃপয়া আপনার ভাইটালস লগ করুন।")
                   : (prediction?.explanation || latestRecord?.explanation || "No recent logs detected. Please use the 'Log Vitals' tool to update your AI diagnostic score.")
                 }
              </p>
           </div>
           <div className="mt-10 pt-8 border-t border-slate-100">
              <button 
                onClick={() => {
                   setIsAudioPlaying(!isAudioPlaying);
                   if (!isAudioPlaying) setTimeout(() => setIsAudioPlaying(false), 5000);
                }}
                className={cn("flex items-center gap-4 font-black uppercase tracking-[0.2em] hover:bg-blue-50 px-5 py-3 rounded-2xl transition-all w-full justify-between",
                  language === 'bn' ? "text-[15px]" : "text-[13px]",
                  isAudioPlaying ? "text-green-600 bg-green-50 animate-pulse" : "text-blue-600"
                )}
              >
                  {isAudioPlaying ? (language === 'bn' ? "পরামর্শ শুনুন..." : "Playing...") : t.audio_advice} 
                  {isAudioPlaying ? <Volume2 className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
           </div>
        </div>
      </div>

      {/* Pregnancy Journey Timeline */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-6">
               <VitalBox 
                 icon={<Activity className="text-blue-500" />} 
                 label={t.bp_sys + " / " + t.bp_dia} 
                 value={latestRecord ? `${toBN(latestRecord.bp_sys)}/${toBN(latestRecord.bp_dia)}` : "--/--"} 
                 status={latestRecord ? (latestRecord.risk_level === 'Low' ? 'Optimal' : 'Caution') : "No Data"} 
                 color="blue" 
                 language={language} 
               />
               <VitalBox 
                 icon={<Thermometer className="text-pink-500" />} 
                 label={t.temperature} 
                 value={latestRecord ? toBN("98.4") + " F" : "-- F"} 
                 status="Normal" 
                 color="pink" 
                 language={language} 
               />
            </div>
            <div className="asymmetric-panel bg-white p-10 shadow-xl shadow-slate-200/20 border-white">
               <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Sun className="h-5 w-5 text-amber-500" /> {t.daily_tip}
               </h4>
               <p className="text-slate-500 text-base leading-relaxed font-medium italic">
                  {currentWeek >= 28 
                    ? (language === 'bn' ? '"আপনার শরীর এখন অতিরিক্ত আয়রনের প্রয়োজন বোধ করবে। প্রতিদিনের খাদ্যতালিকায় সবুজ শাকসবজি রাখুন।"' : '"Ensure you\'re consuming extra calcium and iron. At this stage, your baby\'s lungs are beginning to produce surfactant."')
                    : (language === 'bn' ? '"হাইড্রেটেড থাকুন এবং প্রতিদিন অন্তত ৮ গ্লাস জল পান করুন।"' : '"Stay hydrated and ensure you are drinking at least 8 glasses of water daily."')}
               </p>
            </div>

            {/* Health History */}
            <div className="asymmetric-panel bg-white p-10 border-white shadow-xl shadow-slate-200/20">
               <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-500" /> {t.health_records}
               </h4>
               <div className="space-y-6">
                  {records?.slice().reverse().map((record: any) => (
                     <div key={record.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                        <div>
                           <div className="text-sm font-black text-slate-900">{language === 'bn' ? "রক্তচাপ:" : "Blood Pressure:"} {toBN(record.bp_sys)}/{toBN(record.bp_dia)}</div>
                           <div className="text-[13px] font-bold text-slate-400 mt-1">
                              {language === 'bn' 
                                ? new Date(record.timestamp).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
                                : new Date(record.timestamp).toLocaleDateString()} • {language === 'bn' ? `সপ্তাহ ${toBN(record.week)}` : `Week ${record.week}`}
                           </div>
                        </div>
                        <div className={cn(
                           "px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest",
                           record.risk_level === 'High' ? "bg-red-100 text-red-600" : record.risk_level === 'Medium' ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
                        )}>
                           {language === 'bn' ? (record.risk_level === 'High' ? 'উচ্চ ঝুঁকি' : record.risk_level === 'Medium' ? 'মাঝারি ঝুঁকি' : 'স্বল্প ঝুঁকি') : record.risk_level}
                        </div>
                     </div>
                  ))}
                  {(!records || records.length === 0) && (
                     <div className="text-center py-8 text-slate-300 font-bold uppercase tracking-widest text-[13px]">
                        No logs recorded yet.
                     </div>
                  )}
               </div>
            </div>
         </div>
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
      </div>
    </div>
  );
}
