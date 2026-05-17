'use client';

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Send, Sparkles, User, Bot, 
  Mic, Trash2, Volume2, StopCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatDb } from "@/hooks/chat/useChatDb";
import { useTextToSpeech } from "@/hooks/chat/useTextToSpeech";
import { useChatApi } from "@/hooks/chat/useChatApi";
import { useAudioRecorder } from "@/hooks/chat/useAudioRecorder";

export function ChatView({ t, language, showToast }: any) {
  const { messages, setMessages, clearHistory } = useChatDb();
  const { speak, speakingId } = useTextToSpeech(language, showToast);
  const { input, setInput, isLoading, setIsLoading, handleSend } = useChatApi(messages, setMessages, speak, language);
  const { isListening, startListening } = useAudioRecorder(handleSend, setIsLoading, language, showToast);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClear = async () => {
    if (confirm(language === 'bn' ? "সমস্ত চ্যাট ইতিহাস মুছে ফেলবেন?" : "Clear all chat history?")) {
      await clearHistory();
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden relative">
      <div className="p-5 sm:p-8 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
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
         <button 
           onClick={handleClear}
           className="h-12 px-6 rounded-2xl bg-slate-50 flex items-center gap-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-black text-[11px] uppercase tracking-widest"
         >
            <Trash2 className="h-4 w-4" /> {language === 'bn' ? "মুছে ফেলুন" : "Clear History"}
         </button>
      </div>

      <div 
        ref={scrollRef} 
        className="h-[500px] lg:h-[calc(100vh-25rem)] overflow-y-auto p-5 sm:p-10 pb-32 space-y-6 sm:space-y-8 bg-slate-50/30 scroll-smooth relative pointer-events-auto"
        style={{ overscrollBehavior: 'contain' }}
      >
         {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-20">
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
                 "max-w-[85%] sm:max-w-[70%] p-4 sm:p-6 rounded-[1.8rem] sm:rounded-[2rem] text-sm sm:text-base font-medium leading-[1.8] shadow-sm relative group",
                 m.role === 'user' ? "bg-white text-slate-900 rounded-tr-none" : "bg-blue-600 text-white rounded-tl-none shadow-blue-200"
               )}>
                  {m.content}
                  {m.role === 'bot' && (
                    <button 
                      onClick={() => speak(m.content, i)}
                      className={cn(
                        "absolute -right-4 -bottom-4 h-10 w-10 rounded-full flex items-center justify-center transition-all z-10 border-2 border-white",
                        speakingId === i ? "bg-red-500 text-white animate-pulse" : "bg-blue-600 text-white shadow-lg hover:scale-110"
                      )}
                    >
                       {speakingId === i ? <StopCircle className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                  )}
               </div>
            </motion.div>
         ))}
         {isLoading && (
            <div className="flex gap-6 pb-10">
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

      <div className="p-4 sm:p-8 bg-white border-t border-slate-50">
         <div className="relative flex items-center gap-4">
            <button 
              onClick={startListening}
              className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center transition-all",
                isListening ? "bg-red-500 text-white animate-pulse" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
              )}
            >
               <Mic className="h-6 w-6" />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={language === 'bn' ? "আপনার প্রশ্ন এখানে লিখুন..." : "Type your clinical query..."}
                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-base font-bold focus:ring-2 focus:ring-blue-100"
              />
              {isListening && (
                <div className="absolute inset-0 bg-red-50/90 backdrop-blur-sm rounded-2xl flex items-center px-6 gap-3">
                   <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                   <span className="text-red-600 font-black uppercase tracking-widest text-xs">
                      {language === 'bn' ? "আমি শুনছি..." : "Listening..."}
                   </span>
                </div>
              )}
            </div>
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-200 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
            >
               <Send className="h-4 w-4" /> {language === 'bn' ? "পাঠান" : "Send"}
            </button>
         </div>
      </div>
    </div>
  );
}
