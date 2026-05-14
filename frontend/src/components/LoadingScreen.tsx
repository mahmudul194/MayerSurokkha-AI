'use client';

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingScreen({ language }: { language: string }) {
  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center">
      <div className="text-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="relative h-20 w-20 mx-auto mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-blue-50 animate-ping" />
          <div className="relative flex h-full w-full items-center justify-center bg-white rounded-full border border-blue-100 shadow-xl">
            <Heart className="h-8 w-8 text-blue-500 fill-blue-500" />
          </div>
        </motion.div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 italic uppercase">Mayer Surokkha</h1>
        <p className={cn(
          "mt-2 text-slate-400 font-black uppercase tracking-[0.3em]",
          language === 'bn' ? "text-[15px]" : "text-[13px]"
        )}>{language === 'bn' ? "সিস্টেম চালু হচ্ছে..." : "System Initializing..."}</p>
      </div>
    </div>
  );
}

export function SyncIndicator({ isOnline, language }: { isOnline: boolean, language: string }) {
  return (
    <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm">
      <div className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_10px]", isOnline ? "bg-green-500 shadow-green-200" : "bg-red-500 shadow-red-200")} />
      <span className={cn(
        "font-black uppercase tracking-widest text-slate-500",
        language === 'bn' ? "text-[13px]" : "text-[11px]"
      )}>
        {isOnline ? (language === 'bn' ? "সার্ভারের সাথে সংযুক্ত" : "Connected to Server") : (language === 'bn' ? "অফলাইন মোড" : "Offline Mode")}
      </span>
    </div>
  );
}
