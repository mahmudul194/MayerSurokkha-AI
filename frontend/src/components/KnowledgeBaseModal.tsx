'use client';

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, BookOpen, ChevronRight, Apple, 
  Baby, Activity, Shield, Search
} from "lucide-react";
import { cn } from "@/lib/utils";

export function KnowledgeBaseModal({ isOpen, onClose, t, language }: any) {
  const categories = [
    { id: 'nutrition', icon: Apple, label: language === 'bn' ? "পুষ্টি" : "Nutrition", color: "bg-emerald-50 text-emerald-600" },
    { id: 'growth', icon: Baby, label: language === 'bn' ? "বিকাশ" : "Growth", color: "bg-blue-50 text-blue-600" },
    { id: 'vitals', icon: Activity, label: language === 'bn' ? "ভাইটালস" : "Vitals", color: "bg-pink-50 text-pink-600" },
    { id: 'safety', icon: Shield, label: language === 'bn' ? "সুরক্ষা" : "Safety", color: "bg-indigo-50 text-indigo-600" },
  ];

  const articles = [
    { title: language === 'bn' ? "গর্ভাবস্থায় প্রয়োজনীয় খাবার" : "Essential Nutrition for Moms", category: "nutrition", readTime: "5 min" },
    { title: language === 'bn' ? "শিশুর হার্টরেট ট্র্যাকিং" : "Tracking Baby's Heart Rate", category: "growth", readTime: "8 min" },
    { title: language === 'bn' ? "রক্তচাপ নিয়ন্ত্রণের উপায়" : "Managing Blood Pressure", category: "vitals", readTime: "6 min" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-5xl h-[85vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                     <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <div>
                     <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t.knowledge_base}</h3>
                     <p className="text-slate-400 font-black uppercase tracking-widest text-[13px] mt-1">Verified Clinical Resources</p>
                  </div>
               </div>
               <button onClick={onClose} className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                  <X className="h-6 w-6" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-12" data-lenis-prevent>
               <div className="relative mb-12">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder={language === 'bn' ? "সম্পদ খুঁজুন..." : "Search resources..."}
                    className="w-full h-16 bg-slate-50 border-none rounded-[2rem] px-16 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                  />
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                  {categories.map((cat) => (
                     <button key={cat.id} className="group p-8 rounded-[2.5rem] bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/30 transition-all text-center flex flex-col items-center">
                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", cat.color)}>
                           <cat.icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{cat.label}</span>
                     </button>
                  ))}
               </div>

               <div className="space-y-6">
                  <h4 className="text-xl font-black text-slate-900 tracking-tight mb-8">Trending Articles</h4>
                  {articles.map((article, i) => (
                     <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/20 transition-all flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-8">
                           <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-indigo-500" />
                           </div>
                           <div>
                              <h5 className="text-lg font-black text-slate-900 uppercase tracking-tight">{article.title}</h5>
                              <div className="flex items-center gap-4 mt-2">
                                 <span className="text-[13px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">{article.category}</span>
                                 <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">{article.readTime} read</span>
                              </div>
                           </div>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                           <ChevronRight className="h-5 w-5" />
                        </div>
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
