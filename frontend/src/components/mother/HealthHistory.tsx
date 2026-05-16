import { cn } from "@/lib/utils";
import { Activity, Sun, Clock, Thermometer } from "lucide-react";
import { VitalBox } from "../VitalBox";

export function HealthHistory({ currentWeek, toBN, language, t, latestRecord, records }: any) {
  return (
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
  );
}
