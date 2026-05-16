'use client';

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Send, Sparkles, User, Bot, 
  Mic
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIChat } from "@/hooks/chat/useAIChat";

export function AIChatModal({ isOpen, onClose, t, language }: any) {
  const { messages, input, setInput, isLoading, handleSend } = useAIChat(language);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl h-[80vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                     <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-slate-900 tracking-tight">{t.ai_assistant}</h3>
                     <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest">Neural Link Active</span>
                     </div>
                  </div>
               </div>
               <button onClick={onClose} className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                  <X className="h-6 w-6" />
               </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/30" data-lenis-prevent>
               {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                     <div className="h-20 w-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-8">
                        <Bot className="h-10 w-10 text-blue-500" />
                     </div>
                     <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
                        {language === 'bn' ? "আমি কিভাবে সাহায্য করতে পারি?" : "How can I assist your journey?"}
                     </h4>
                     <p className="text-slate-400 font-medium leading-relaxed">
                        {language === 'bn' ? "আপনার স্বাস্থ্য বা শিশুর বিকাশ সম্পর্কে যেকোনো প্রশ্ন করুন।" : "Ask anything about your health, baby growth, or clinical precautions."}
                     </p>
                  </div>
               )}
               {messages.map((m, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={cn("flex gap-6", m.role === 'user' ? "flex-row-reverse" : "")}
                  >
                     <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm", 
                       m.role === 'user' ? "bg-slate-900 text-white" : "bg-blue-600 text-white"
                     )}>
                        {m.role === 'user' ? <User className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                     </div>
                     <div className={cn(
                       "max-w-[70%] p-6 rounded-[2rem] text-base font-medium leading-relaxed shadow-sm",
                       m.role === 'user' ? "bg-white text-slate-900 rounded-tr-none" : "bg-blue-600 text-white rounded-tl-none shadow-blue-200"
                     )}>
                        {m.content}
                     </div>
                  </motion.div>
               ))}
               {isLoading && (
                  <div className="flex gap-6">
                     <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center animate-pulse shadow-sm">
                        <Sparkles className="h-5 w-5" />
                     </div>
                     <div className="bg-white p-6 rounded-[2rem] rounded-tl-none shadow-sm flex gap-2 items-center">
                        <div className="h-1.5 w-1.5 bg-slate-200 rounded-full animate-bounce" />
                        <div className="h-1.5 w-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="h-1.5 w-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                     </div>
                  </div>
               )}
            </div>

            <div className="p-8 bg-white border-t border-slate-50">
               <div className="relative flex items-center gap-4">
                  <button className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                     <Mic className="h-6 w-6" />
                  </button>
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={language === 'bn' ? "আপনার প্রশ্ন এখানে লিখুন..." : "Type your clinical query..."}
                    className="flex-1 h-14 bg-slate-50 border-none rounded-2xl px-6 text-base font-bold focus:ring-2 focus:ring-blue-100"
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-200 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                  >
                     <Send className="h-4 w-4" /> {language === 'bn' ? "পাঠান" : "Send"}
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
