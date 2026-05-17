'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Search, ChevronRight, PlayCircle, FileText,
  Volume2, StopCircle, Sparkles, Send, User, Bot,
  Apple, Baby, Activity, Shield, Info, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTextToSpeech } from "@/hooks/chat/useTextToSpeech";

export function KnowledgeView({ t, language, showToast }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  
  // AI Q&A Panel States
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Text-To-Speech Integration
  const { speak, speakingId, stopAll } = useTextToSpeech(language, showToast);

  const categories = [
    { id: 'all', icon: BookOpen, label: language === 'bn' ? "সব বিষয়" : "All Topics", color: "bg-slate-100 text-slate-700" },
    { id: 'nutrition', icon: Apple, label: language === 'bn' ? "পুষ্টি" : "Nutrition", color: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
    { id: 'lifestyle', icon: Baby, label: language === 'bn' ? "ব্যায়াম ও বিশ্রাম" : "Exercise & Rest", color: "bg-blue-50 text-blue-600 border border-blue-100" },
    { id: 'vitals', icon: Activity, label: language === 'bn' ? "রক্তচাপ" : "Vitals", color: "bg-pink-50 text-pink-600 border border-pink-100" },
    { id: 'safety', icon: Shield, label: language === 'bn' ? "সুরক্ষা" : "Safety", color: "bg-indigo-50 text-indigo-600 border border-indigo-100" },
  ];

  const articles = [
    {
      id: 1,
      category: 'nutrition',
      readTime: '5 min',
      title: language === 'bn' ? "গর্ভকালীন পুষ্টিকর খাদ্যাভ্যাস গাইড" : "Essential Pregnancy Nutrition Guide",
      summary: language === 'bn' ? "গর্ভস্থ শিশুর সঠিক বৃদ্ধি এবং মায়ের সুস্বাস্থ্যের জন্য প্রয়োজনীয় পুষ্টিকর খাবারের তালিকা।" : "A complete roadmap of what to eat and avoid during your pregnancy to ensure your baby gets the best nutrients.",
      content: language === 'bn' ? 
`গর্ভকালীন সময়ে সুষম খাবার শিশুর সুস্থ বিকাশ এবং মায়ের সুস্বাস্থ্য নিশ্চিত করে।

### প্রয়োজনীয় পুষ্টির চেকলিস্ট
* **আয়রন (দৈনিক ৩০-৬০ মি.গ্রা.)**: রক্তস্বল্পতা রোধ করতে কচুশাক, কলিজা, ডাল ও লাল মাংস বেশি খান।
* **ফলিক অ্যাসিড (দৈনিক ৪০০ মাইক্রোগ্রাম)**: জন্মগত ত্রুটি রোধে প্রথম ৩ মাস অত্যন্ত গুরুত্বপূর্ণ। ডাল, লেবু, সবুজ শাকসবজি খান।
* **ক্যালসিয়াম (দৈনিক ১০০০ মি.গ্রা.)**: বাচ্চার হাড় গঠনে সাহায্য করে। দুধ, দই ও পনির খান।

### 🚫 যেসব খাবার এড়িয়ে চলবেন
* কাঁচা বা আধা-সেদ্ধ ডিম ও মাংস।
* অপাস্তুরিত দুধ বা পনির।
* অতিরিক্ত চা বা কফি (দিনে ১ কাপের বেশি নয়)।` :
`A balanced diet during pregnancy is vital for your baby's optimal development and your own health.

### Essential Nutrient Checklist
* **Iron (30-60mg daily)**: Prevents anemia. Eat lean meat, spinach, beans, and lentils.
* **Folic Acid (400mcg daily)**: Critical in the first trimester to prevent birth defects. Eat lentils and leafy greens.
* **Calcium (1000mg daily)**: Builds baby's bones. Drink milk and eat yogurt or cheese.

### 🚫 Foods to Avoid
* Raw or undercooked eggs and meat.
* Unpasteurized milk or soft cheeses.
* Excess caffeine (limit to 1 cup a day).`
    },
    {
      id: 2,
      category: 'lifestyle',
      readTime: '6 min',
      title: language === 'bn' ? "নিরাপদ ব্যায়াম, বিশ্রাম ও ঘুমানোর অবস্থান" : "Exercise, Rest & Sleep Positions",
      summary: language === 'bn' ? "গর্ভাবস্থায় নিরাপদ উপায়ে সক্রিয় থাকা, ক্লান্তি দূর করা এবং রক্ত সঞ্চালন সচল রাখার জন্য সঠিক ঘুমানোর নিয়ম।" : "How to stay active safely, handle pregnancy fatigue, and the best sleeping positions for optimal blood flow.",
      content: language === 'bn' ?
`গর্ভাবস্থায় শরীর সক্রিয় রাখা এবং সঠিক উপায়ে বিশ্রাম নেওয়া দুটিই সমান গুরুত্বপূর্ণ।

### নিরাপদ ব্যায়ামের নিয়ম
* **হাঁটা (প্রতিদিন ৩০ মিনিট)**: শরীরের সহনশীলতা বাড়ায় এবং প্রসব সহজ করতে সাহায্য করে।
* **হালকা স্ট্রেচিং**: পিঠের ব্যথা কমাতে সাহায্য করে। ভারী ব্যায়াম বা লাফালাফি পরিহার করুন।
* **পর্যাপ্ত পানি পান**: ব্যায়ামের আগে ও পরে প্রচুর পানি পান করুন।

### 😴 ঘুমানোর সঠিক অবস্থান: বাম কাত হয়ে ঘুমানো
গর্ভাবস্থায় **বাম কাত হয়ে ঘুমানো** সবচেয়ে নিরাপদ। এটি গর্ভফুল বা প্লাসেন্টায় রক্ত ও পুষ্টির প্রবাহ বাড়ায়। ২০ সপ্তাহের পর সোজা চিৎ হয়ে ঘুমানো এড়িয়ে চলুন।` :
`Staying active safely and getting quality rest are key pillars of a healthy pregnancy.

### Safe Exercise Rules
* **Walking (30 mins daily)**: Excellent for building stamina and preparing for labor.
* **Safe Stretching**: Relieves back tension. Avoid high-impact or contact sports.
* **Hydration**: Drink plenty of water before, during, and after exercise.

### 😴 Best Sleep Position: SOS (Sleep On Side)
Sleeping on your **left side** is highly recommended. It increases the amount of blood and nutrients that reach the placenta and your baby. Avoid sleeping flat on your back after 20 weeks.`
    },
    {
      id: 3,
      category: 'vitals',
      readTime: '4 min',
      title: language === 'bn' ? "বাড়িতে যেভাবে রক্তচাপ পরিমাপ ও পর্যবেক্ষণ করবেন" : "Monitoring Blood Pressure at Home",
      summary: language === 'bn' ? "রক্তচাপের রিডিং বোঝা এবং গর্ভকালীন উচ্চ রক্তচাপ (Gestational Hypertension) প্রাথমিকভাবে সনাক্ত করার উপায়।" : "Learn how to read your systolic and diastolic blood pressure, and how to spot Gestational Hypertension early.",
      content: language === 'bn' ?
`গর্ভকালীন সময়ে রক্তচাপ স্বাভাবিক রাখা অত্যন্ত জরুরী। রক্তচাপের হঠাৎ বৃদ্ধি প্রি-এক্লাম্পসিয়ার কারণ হতে পারে।

### রক্তচাপের রিডিং বুঝুন
* **স্বাভাবিক রক্তচাপ**: ১২০/৮০ mmHg বা এর নিচে।
* **ঝুঁকিপূর্ণ রক্তচাপ**: ১৩০/৮০ mmHg বা এর উপরে। নিয়মিত নজরে রাখুন।
* **বিপজ্জনক রক্তচাপ**: ১৪০/৯০ mmHg বা এর বেশি। অবিলম্বে ডাক্তারের পরামর্শ নিন।

### সঠিকভাবে মাপার নিয়ম
১. মাপার আগে ৫ মিনিট শান্ত হয়ে বসে বিশ্রাম নিন।
২. সোজা হয়ে বসুন এবং পা মাটিতে সমান্তরাল রাখুন।
৩. কাফটি হার্ট বা বুকের সমান উচ্চতায় রাখুন।` :
`Keeping your blood pressure stable during pregnancy is critical. A sudden rise can indicate gestational hypertension or pre-eclampsia.

### Understanding Your Numbers
* **Normal BP**: 120/80 mmHg or below.
* **Elevated BP**: 130/80 mmHg or above. Requires monitoring.
* **High BP (Danger)**: 140/90 mmHg or above. Consult your clinical provider immediately.

### How to Measure Accurately
1. Rest quietly for 5 minutes before measuring.
2. Sit with your back supported and feet flat on the floor.
3. Keep the arm cuff at heart level.`
    },
    {
      id: 4,
      category: 'safety',
      readTime: '7 min',
      title: language === 'bn' ? "গর্ভাবস্থার ৫টি মারাত্মক বিপদ চিহ্ন" : "5 Danger Signs of Pregnancy",
      summary: language === 'bn' ? "গর্ভকালীন জটিলতার জরুরি উপসর্গসমূহ। নিচের যেকোনো একটি দেখা দিলে অবিলম্বে চিকিৎসকের শরণাপন্ন হন।" : "Crucial clinical symptoms that indicate an emergency. If you experience any of these, contact your clinical node immediately.",
      content: language === 'bn' ?
`গর্ভাবস্থায় কিছু উপসর্গ দেখা দিলে একটুও দেরি না করে হাসপাতালে যাওয়া উচিত। এগুলোকে বিপদ চিহ্ন বলা হয়।

### ⚠️ অতি জরুরী বিপদ চিহ্নসমূহ
১. **যোনিপথে রক্তপাত**: যেকোনো ধরণের রক্তপাত বা স্পটিং অত্যন্ত বিপজ্জনক হতে পারে।
২. **তীব্র মাথাব্যথা ও ঝাপসা দৃষ্টি**: এটি রক্তচাপ বৃদ্ধি বা প্রি-এক্লাম্পসিয়ার অন্যতম প্রধান লক্ষণ।
৩. **শরীর অতিরিক্ত ফুলে যাওয়া**: মুখমন্ডল, হাত ও পা অতিরিক্ত ফুলে যাওয়া।
৪. **তীব্র জ্বর**: গর্ভস্থ শিশুর ইনফেকশন বা বড় ক্ষতির ঝুঁকি বাড়িয়ে দেয়।
৫. **বাচ্চার নড়াচড়া কমে যাওয়া**: ২৮ সপ্তাহের পর ২ ঘণ্টায় বাচ্চার ১০ বারের কম নড়াচড়া টের পেলে।

**দ্রুত পদক্ষেপ নিন**: অবহেলা করবেন না। অবিলম্বে আমাদের এসওএস (SOS) বাটনে চাপ দিন বা নিকটস্থ হাসপাতালে যোগাযোগ করুন।` :
`During pregnancy, certain symptoms require immediate emergency evaluation. Recognizing them early saves lives.

### ⚠️ Immediate Emergency Warning Signs
1. **Vaginal Bleeding**: Any spotting or bleeding can indicate a serious risk.
2. **Severe Headache & Blurry Vision**: High risk indicator for Pre-eclampsia.
3. **Severe Swelling**: Rapid, significant swelling of the face, hands, and feet.
4. **High Fever**: Infection risk for you and the baby.
5. **Reduced Fetal Movement**: If you feel less than 10 kicks in 2 hours after 28 weeks of pregnancy.

**Act Fast**: Do not wait. Trigger the SOS alert or head to the nearest healthcare facility immediately.`
    }
  ];

  // Stop reading if user closes modal
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAskAI = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    setAiResponse("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const systemContext = "You are a clinical obstetrician assistant. Answer the following user question strictly based on safe, standard medical practices for pregnant mothers.";
      
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: `${systemContext}\n\nQuestion: ${aiQuery}`,
          history: [],
          language 
        })
      });
      const data = await response.json();
      setAiResponse(data.response);
      showToast(language === 'bn' ? "এআই পরামর্শ প্রস্তুত" : "AI advice generated successfully", "success");
    } catch (e) {
      console.error(e);
      showToast(language === 'bn' ? "এআই যুক্ত হতে পারেনি" : "Failed to reach AI assistant", "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
         <div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{t.knowledge_base}</h3>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[13px] mt-2">
              {language === 'bn' ? "বিশেষজ্ঞদের পরামর্শ ও গাইড" : "Expert Clinical Guidance & Resources"}
            </p>
         </div>
         <div className="relative group w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-all" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? "সম্পদ বা তথ্য খুঁজুন..." : "Search resources..."}
              className="pl-16 pr-8 h-16 w-full bg-white border-none rounded-[2rem] shadow-xl shadow-slate-200/20 text-base font-bold focus:ring-2 focus:ring-blue-100 transition-all"
            />
         </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none whitespace-nowrap">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-6 py-3 rounded-full flex items-center gap-3 text-sm font-black uppercase tracking-widest transition-all",
                selectedCategory === cat.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                  : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {filteredArticles.map((item) => (
            <motion.div 
               key={item.id}
               whileHover={{ y: -8 }}
               onClick={() => setSelectedArticle(item)}
               className="group p-6 sm:p-8 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/20 flex flex-col justify-between cursor-pointer transition-all duration-300"
            >
               <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full",
                      item.category === 'nutrition' ? "bg-emerald-50 text-emerald-600" :
                      item.category === 'lifestyle' ? "bg-blue-50 text-blue-600" :
                      item.category === 'vitals' ? "bg-pink-50 text-pink-600" :
                      "bg-indigo-50 text-indigo-600"
                    )}>
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.readTime} read</span>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">
                    {item.summary}
                  </p>
               </div>
               <div className="flex items-center justify-between border-t border-slate-50 pt-6 mt-auto">
                  <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest group-hover:text-blue-600 transition-all">
                     <FileText className="h-4 w-4" />
                     <span>{language === 'bn' ? "বিস্তারিত পড়ুন" : "Read Full Article"}</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                     <ChevronRight className="h-5 w-5" />
                  </div>
               </div>
            </motion.div>
         ))}

         {filteredArticles.length === 0 && (
           <div className="col-span-full py-16 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/10">
             <Info className="h-12 w-12 text-slate-300 mx-auto mb-4" />
             <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
               {language === 'bn' ? "কোনো তথ্য পাওয়া যায়নি" : "No clinical resources found"}
             </p>
           </div>
         )}
      </div>

      {/* AI Expert Consulting Assistant Portal */}
      <div className="p-6 sm:p-10 bg-slate-900 rounded-[2rem] sm:rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 h-96 w-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
         <div className="absolute bottom-0 left-0 h-96 w-96 bg-emerald-600/15 rounded-full blur-[100px] pointer-events-none" />

         <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
           <div className="max-w-xl space-y-4">
             <div className="h-12 w-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
               <Sparkles className="h-6 w-6 text-white" />
             </div>
             <h3 className="text-3xl font-black tracking-tight leading-tight">
               {language === 'bn' ? "এআই মেডিকেল বিশেষজ্ঞ কনসাল্টিং" : "Ask Our AI Clinical Assistant"}
             </h3>
             <p className="text-slate-400 font-medium text-sm leading-relaxed">
               {language === 'bn' ? 
                 "আমাদের কৃত্রিম বুদ্ধিমত্তা সম্পন্ন মেডিকেল গাইডকে গর্ভকালীন স্বাস্থ্য বা আপনার শিশুর যেকোনো অবস্থা নিয়ে তাৎক্ষণিক ক্লিনিক্যাল প্রশ্ন করুন।" : 
                 "Need personalized clinical insights? Ask any pregnancy or newborn related health query, verified by our neural library."}
             </p>

             <div className="relative flex items-center gap-3 pt-4 w-full">
                <input 
                  type="text" 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                  placeholder={language === 'bn' ? "গর্ভকালীন যেকোনো প্রশ্ন এখানে লিখুন..." : "Ask your clinical pregnancy question..."}
                  className="w-full h-16 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-6 text-base font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                <button 
                  onClick={handleAskAI}
                  disabled={isAiLoading || !aiQuery.trim()}
                  className="h-16 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all disabled:opacity-50"
                >
                   {isAiLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-4 w-4" />}
                   <span>{language === 'bn' ? "জানুন" : "Ask"}</span>
                </button>
             </div>
           </div>

           {/* Live Response Bubble */}
           <AnimatePresence mode="wait">
             {(aiResponse || isAiLoading) && (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="w-full md:w-[450px] bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col gap-4 text-left"
               >
                 <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                     <Bot className="h-4 w-4" />
                   </div>
                   <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                     Clinical Expert Insights
                   </span>
                 </div>
                 
                 {isAiLoading ? (
                   <div className="flex gap-2 items-center py-4">
                     <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" />
                     <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                     <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                 ) : (
                   <p className="text-slate-200 text-[15px] font-medium leading-[1.8] whitespace-pre-line">
                     {aiResponse}
                   </p>
                 )}
               </motion.div>
             )}
           </AnimatePresence>
         </div>
      </div>

      {/* Interactive Full-Screen Reading Drawer Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                stopAll();
                setSelectedArticle(null);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl h-[85vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
                 <div className="flex items-center gap-6">
                    <div className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg",
                      selectedArticle.category === 'nutrition' ? "bg-emerald-500 text-white shadow-emerald-200" :
                      selectedArticle.category === 'lifestyle' ? "bg-blue-600 text-white shadow-blue-200" :
                      selectedArticle.category === 'vitals' ? "bg-pink-500 text-white shadow-pink-200" :
                      "bg-indigo-600 text-white shadow-indigo-200"
                    )}>
                       <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                       <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">
                         {selectedArticle.category} • Verified Guideline
                       </span>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1 leading-tight">
                         {selectedArticle.title}
                       </h3>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                   {/* Audio Player Button (Integrated TTS) */}
                   <button 
                     onClick={() => speak(selectedArticle.content, selectedArticle.id)}
                     className={cn(
                       "h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-3 transition-all",
                       speakingId === selectedArticle.id 
                         ? "bg-red-500 text-white animate-pulse" 
                         : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                     )}
                   >
                     {speakingId === selectedArticle.id ? (
                       <>
                         <StopCircle className="h-5 w-5 animate-spin" />
                         <span>{language === 'bn' ? "বন্ধ করুন" : "Stop Reading"}</span>
                       </>
                     ) : (
                       <>
                         <Volume2 className="h-5 w-5" />
                         <span>{language === 'bn' ? "শুনুন" : "Listen Advice"}</span>
                       </>
                     )}
                   </button>

                   <button 
                     onClick={() => {
                       stopAll();
                       setSelectedArticle(null);
                     }}
                     className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"
                   >
                      <span className="text-xl font-bold">✕</span>
                   </button>
                 </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-12 space-y-6" data-lenis-prevent>
                 <div className="prose max-w-none text-slate-700 text-lg font-medium leading-[1.9] whitespace-pre-line">
                   {selectedArticle.content}
                 </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Mayer Surokkha Clinical Vault
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {selectedArticle.readTime} reading duration
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
