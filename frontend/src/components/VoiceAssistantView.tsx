'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, MicOff, Sparkles, Volume2, 
  Bot, RefreshCw, X, MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTextToSpeech } from "@/hooks/chat/useTextToSpeech";

export function VoiceAssistantView({ t, language, showToast }: any) {
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const { speak, speakingId, stopAll } = useTextToSpeech(language, showToast);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatHistoryRef = useRef<any[]>([]);

  // Stop everything when component unmounts
  useEffect(() => {
    return () => {
      stopAll();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Monitor speakingId to know when AI finishes talking
  useEffect(() => {
    if (status === 'speaking' && speakingId === null) {
      // AI finished speaking, auto-start listening again!
      startListening();
    }
  }, [speakingId, status]);

  const startListening = async () => {
    try {
      stopAll();
      setTranscript("");
      setStatus('listening');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        processAudio(audioBlob);
      };

      mediaRecorder.start();
      
      // Auto-stop after 5 seconds of silence or fixed duration for this demo
      // In a real app, you'd use a VAD (Voice Activity Detection)
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 5000);

    } catch (err) {
      console.error("Mic error:", err);
      showToast("Microphone access denied", "error");
      setStatus('idle');
    }
  };

  const processAudio = async (blob: Blob) => {
    setStatus('processing');
    try {
      const formData = new FormData();
      formData.append("audio", blob, "voice.webm");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // 1. Get Transcription (STT)
      const sttRes = await fetch(`${apiUrl}/voice/process`, {
        method: "POST",
        body: formData
      });
      const sttData = await sttRes.json();
      
      if (!sttData.is_safe) {
        showToast(sttData.moderation_reason, "error");
        setStatus('idle');
        return;
      }

      setTranscript(sttData.text);

      // 2. Get AI Response (LLM)
      const chatRes = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: sttData.text, 
          history: chatHistoryRef.current, 
          language 
        })
      });
      const chatData = await chatRes.json();
      
      setAiResponse(chatData.response);
      chatHistoryRef.current = [
        ...chatHistoryRef.current,
        { role: 'user', content: sttData.text },
        { role: 'bot', content: chatData.response }
      ];

      // 3. Speak Response (TTS)
      setStatus('speaking');
      speak(chatData.response, 1); // Using ID 1 for assistant

    } catch (err) {
      console.error("Processing error:", err);
      showToast("Voice link interrupted", "error");
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 rounded-[2rem] sm:rounded-[3rem] overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        
        {/* Animated Background Aura */}
        <AnimatePresence>
          {status !== 'idle' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }}
              className={cn(
                "absolute inset-0 rounded-full blur-[100px]",
                status === 'listening' ? "bg-red-400" : "bg-blue-400"
              )}
            />
          )}
        </AnimatePresence>

        <div className="z-10 flex flex-col items-center text-center max-w-2xl">
          <motion.div 
            animate={status === 'listening' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
            className={cn(
              "h-32 w-32 sm:h-48 sm:w-48 rounded-[2.5rem] sm:rounded-[3.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 mb-6 sm:mb-12",
              status === 'idle' ? "bg-white text-slate-300" :
              status === 'listening' ? "bg-red-500 text-white shadow-red-200" :
              status === 'processing' ? "bg-amber-500 text-white shadow-amber-200" :
              "bg-blue-600 text-white shadow-blue-200"
            )}
          >
            {status === 'idle' && <MicOff className="h-10 w-10 sm:h-20 sm:w-20" />}
            {status === 'listening' && <Mic className="h-10 w-10 sm:h-20 sm:w-20" />}
            {status === 'processing' && <RefreshCw className="h-10 w-10 sm:h-20 sm:w-20 animate-spin" />}
            {status === 'speaking' && <Volume2 className="h-10 w-10 sm:h-20 sm:w-20 animate-pulse" />}
          </motion.div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            {status === 'idle' ? (language === 'bn' ? "ভয়েস অ্যাসিস্ট্যান্ট" : "Voice Assistant") :
             status === 'listening' ? (language === 'bn' ? "আমি শুনছি..." : "I'm Listening...") :
             status === 'processing' ? (language === 'bn' ? "প্রসেস হচ্ছে..." : "Processing...") :
             (language === 'bn' ? "অ্যাসিস্ট্যান্ট কথা বলছে" : "Assistant is Speaking")}
          </h2>
          
          <p className="text-slate-400 text-sm sm:text-lg font-medium leading-relaxed mb-6 sm:mb-12 h-16">
            {status === 'idle' ? (language === 'bn' ? "শুরু করতে নিচের বাটনে চাপ দিন" : "Tap the button to start a conversation") :
             status === 'listening' ? (language === 'bn' ? "আপনার প্রশ্নটি বলুন" : "Speak your query clearly") :
             status === 'processing' ? (language === 'bn' ? "আপনার কথা বিশ্লেষণ করা হচ্ছে" : "Analyzing your voice patterns") :
             ""}
          </p>

          {/* Transcript / AI Response Bubble */}
          <AnimatePresence mode="wait">
            {(transcript || aiResponse) && (
              <motion.div 
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-5 sm:p-8 rounded-[1.8rem] sm:rounded-[2.5rem] shadow-xl border border-slate-100 w-full mb-6 sm:mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center", 
                    status === 'speaking' ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                  )}>
                    {status === 'speaking' ? <Bot className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {status === 'speaking' ? "Assistant" : "You Said"}
                  </span>
                </div>
                <p className="text-slate-700 text-xl font-bold leading-relaxed">
                  {status === 'speaking' ? aiResponse : transcript}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {status === 'idle' ? (
            <button 
              onClick={startListening}
              className="h-20 px-12 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:scale-105 transition-all flex items-center gap-4"
            >
              <Mic className="h-6 w-6" /> {language === 'bn' ? "কথোপকথন শুরু করুন" : "Start Conversation"}
            </button>
          ) : (
            <button 
              onClick={() => {
                stopAll();
                if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
                setStatus('idle');
              }}
              className="h-20 px-12 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 transition-all flex items-center gap-4"
            >
              <X className="h-6 w-6" /> {language === 'bn' ? "বন্ধ করুন" : "Stop Session"}
            </button>
          )}
        </div>
      </div>

      {/* Visual Waves Footer */}
      {status === 'listening' && (
        <div className="h-32 bg-slate-900 flex items-center justify-center gap-1">
          {[...Array(20)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ height: [20, 60, 20] }}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
              className="w-1.5 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
