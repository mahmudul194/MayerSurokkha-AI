'use client';

import { motion } from "framer-motion";
import { 
  BookOpen, Search, Filter, 
  ChevronRight, PlayCircle, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

export function KnowledgeView({ t, language }: any) {
  const articles = [
    { title: language === 'bn' ? "পুষ্টিকর খাদ্যাভ্যাস" : "Nutritional Diet", category: "Nutrition", type: "article" },
    { title: language === 'bn' ? "ব্যায়াম ও বিশ্রাম" : "Exercise & Rest", category: "Lifestyle", type: "video" },
    { title: language === 'bn' ? "মানসিক স্বাস্থ্য" : "Mental Wellness", category: "Psychology", type: "article" },
    { title: language === 'bn' ? "নবজাতকের যত্ন" : "Newborn Care", category: "Pediatrics", type: "article" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
         <div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{t.knowledge_base}</h3>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[13px] mt-2">{language === 'bn' ? "বিশেষজ্ঞদের পরামর্শ ও গাইড" : "Expert Clinical Guidance & Resources"}</p>
         </div>
         <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-all" />
            <input 
              type="text" 
              placeholder={language === 'bn' ? "সার্চ করুন..." : "Search resources..."}
              className="pl-16 pr-8 h-16 w-full md:w-96 bg-white border-none rounded-[2rem] shadow-xl shadow-slate-200/20 text-base font-bold focus:ring-2 focus:ring-blue-100 transition-all"
            />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {articles.map((item, i) => (
            <motion.div 
               key={i}
               whileHover={{ y: -8 }}
               className="group p-8 bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/20 flex items-center justify-between cursor-pointer"
            >
               <div className="flex items-center gap-8">
                  <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500">
                     {item.type === 'video' ? <PlayCircle className="h-8 w-8 text-blue-600 group-hover:text-white" /> : <FileText className="h-8 w-8 text-blue-600 group-hover:text-white" />}
                  </div>
                  <div>
                     <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1 block">{item.category}</span>
                     <h4 className="text-xl font-black text-slate-900 tracking-tight">{item.title}</h4>
                  </div>
               </div>
               <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ChevronRight className="h-5 w-5" />
               </div>
            </motion.div>
         ))}
      </div>
    </div>
  );
}
