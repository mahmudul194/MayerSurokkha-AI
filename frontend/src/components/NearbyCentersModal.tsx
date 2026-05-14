'use client';

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, MapPin, Phone, Globe, Navigation, 
  ChevronRight, Star, Clock, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

export function NearbyCentersModal({ isOpen, onClose, t, language }: any) {
  const centers = [
    { name: "Upazila Health Complex", distance: "2.4 km", rating: 4.8, type: "Government", status: "Open 24/7", phone: "+8801700000001" },
    { name: "Surokkha Satellite Clinic", distance: "0.8 km", rating: 4.9, type: "Partnership", status: "Closing in 2h", phone: "+8801700000002" },
    { name: "Mother & Child Center", distance: "4.2 km", rating: 4.7, type: "Private", status: "Open 24/7", phone: "+8801700000003" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-3xl h-[80vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="h-14 w-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                     <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <div>
                     <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t.nearby_centers}</h3>
                     <p className="text-slate-400 font-black uppercase tracking-widest text-[13px] mt-1">Live Geospatial Service Locator</p>
                  </div>
               </div>
               <button onClick={onClose} className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                  <X className="h-6 w-6" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 space-y-6" data-lenis-prevent>
               <div className="asymmetric-panel bg-slate-900 p-8 text-white relative overflow-hidden mb-12">
                  <div className="relative z-10">
                     <h4 className="text-lg font-black uppercase tracking-widest text-emerald-400 mb-2">Primary Node</h4>
                     <p className="text-2xl font-black tracking-tight mb-4">Dhaka Medical College & Hospital</p>
                     <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.2em]"><Shield className="h-3 w-3" /> Tier 1 Support</span>
                        <span className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.2em]"><Navigation className="h-3 w-3" /> 5.8 km away</span>
                     </div>
                  </div>
                  <Globe className="absolute right-[-20px] bottom-[-20px] h-48 w-48 text-white/10" />
               </div>

               <div className="space-y-4">
                  {centers.map((center, i) => (
                     <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/20 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-8">
                           <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-emerald-500" />
                           </div>
                           <div>
                              <div className="flex items-center gap-4">
                                 <h5 className="text-lg font-black text-slate-900 uppercase tracking-tight">{center.name}</h5>
                                 <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="h-3 w-3 fill-amber-500" />
                                    <span className="text-[13px] font-black">{center.rating}</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-6 mt-2">
                                 <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest">{center.distance}</span>
                                 <span className="text-[13px] font-black text-emerald-500 uppercase tracking-widest">{center.type}</span>
                                 <span className="flex items-center gap-1 text-[13px] font-bold text-slate-400"><Clock className="h-3 w-3" /> {center.status}</span>
                              </div>
                           </div>
                        </div>
                        <a 
                          href={`tel:${center.phone}`}
                          className="h-14 px-8 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center gap-3 text-slate-900 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all group-hover:shadow-lg"
                        >
                           <Phone className="h-4 w-4" />
                           <span className="text-[13px] font-black uppercase tracking-widest">{language === 'bn' ? "কল করুন" : "Call Now"}</span>
                        </a>
                     </div>
                  ))}
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
