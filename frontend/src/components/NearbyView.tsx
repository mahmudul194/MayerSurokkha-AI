'use client';

import { MapPin, Phone, Clock, Navigation } from "lucide-react";

export function NearbyView({ t, language }: any) {
  const centers = [
    { name: language === 'bn' ? "উপজেলা স্বাস্থ্য কমপ্লেক্স" : "Upazila Health Complex", dist: "1.2 km", status: "Open", phone: "+880 1711-xxxxxx" },
    { name: language === 'bn' ? "মা ও শিশু কল্যাণ কেন্দ্র" : "Maternal & Child Center", dist: "3.5 km", status: "Open 24/7", phone: "+880 1822-xxxxxx" },
    { name: language === 'bn' ? "আর্মি ফিল্ড হাসপাতাল" : "Army Field Hospital", dist: "5.8 km", status: "Emergency Only", phone: "+880 1933-xxxxxx" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div>
         <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{t.nearby_centers}</h3>
         <p className="text-slate-400 font-black uppercase tracking-widest text-[13px] mt-2">{language === 'bn' ? "নিকটতম স্বাস্থ্যসেবা কেন্দ্রসমূহ" : "Nearest Clinical Facilities & Emergency Hubs"}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {centers.map((center, i) => (
            <div key={i} className="asymmetric-panel bg-white p-8 border-slate-100 shadow-xl shadow-slate-200/10 flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div className="flex items-start gap-8">
                  <div className="h-16 w-16 bg-red-50 rounded-[1.5rem] flex items-center justify-center flex-shrink-0">
                     <MapPin className="h-8 w-8 text-red-500" />
                  </div>
                  <div>
                     <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{center.name}</h4>
                     <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest">
                           <Navigation className="h-4 w-4" /> {center.dist}
                        </div>
                        <div className="flex items-center gap-2 text-green-500 font-black text-sm uppercase tracking-widest">
                           <Clock className="h-4 w-4" /> {center.status}
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest">
                           <Phone className="h-4 w-4" /> {center.phone}
                        </div>
                     </div>
                  </div>
               </div>
               <button className="h-16 px-10 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                  <Navigation className="h-5 w-5" /> {language === 'bn' ? "ম্যাপ দেখুন" : "Get Directions"}
               </button>
            </div>
         ))}
      </div>
    </div>
  );
}
