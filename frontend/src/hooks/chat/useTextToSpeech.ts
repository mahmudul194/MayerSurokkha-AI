import { useState, useEffect, useRef } from "react";

export function useTextToSpeech(language: string, showToast: any) {
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAll = () => {
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setSpeakingId(null);
  };

  useEffect(() => {
    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      stopAll(); // Cleanup on unmount
    };
  }, []);

  const stripMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1')     // Italic
      .replace(/#+\s?(.*?)/g, '$1')    // Headers
      .replace(/`(.*?)`/g, '$1')      // Code
      .replace(/[-*•]/g, ' ')          // List bullet indicators
      .replace(/[:]/g, ' ')            // Colons
      .replace(/[^\u0000-\u007F\u0980-\u09FF\s.,!?;]/g, '') // Remove emojis and high unicode symbols (keep ASCII + Bangla)
      .replace(/\s+/g, ' ')            // Normalize spacing
      .trim();
  };

  const speak = (text: string, id: number) => {
    try {
      const cleanText = stripMarkdown(text);
      if (speakingId === id) {
        stopAll();
        return;
      }

      stopAll(); // Stop anything currently playing before starting new speech
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      
      const playFallbackAudio = async (fallbackText: string, currentId: number) => {
        try {
          // Route the TTS request through our FastAPI backend to bypass strict browser CORS & Referer policies
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          
          const response = await fetch(`${apiUrl}/tts`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ text: fallbackText, language })
          });
          if (!response.ok) throw new Error("TTS fetch failed");
          
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          
          audio.onplay = () => setSpeakingId(currentId);
          audio.onended = () => {
             setSpeakingId(null);
             audioRef.current = null;
             URL.revokeObjectURL(audioUrl);
          };
          audio.onerror = () => {
              console.error("Fallback TTS playback failed");
              setSpeakingId(null);
              audioRef.current = null;
              showToast("Audio playback failed. Check network.", "error");
              URL.revokeObjectURL(audioUrl);
          };
          
          audio.play().catch(e => {
              console.error("Audio auto-play blocked", e);
              setSpeakingId(null);
              audioRef.current = null;
              URL.revokeObjectURL(audioUrl);
          });
        } catch (error) {
          console.error("Fallback TTS fetch error:", error);
          setSpeakingId(null);
          showToast("Network error: Audio engine requires internet", "error");
        }
      };

      const attemptSpeak = (retries = 3) => {
        const currentVoices = window.speechSynthesis.getVoices();
        
        if (currentVoices.length === 0 && retries > 0) {
          setTimeout(() => attemptSpeak(retries - 1), 250);
          return;
        }

        let voice;
        if (language === 'bn') {
          // Priority matching for Bangla/Bengali
          voice = currentVoices.find(v => v.lang === 'bn-BD') ||
                  currentVoices.find(v => v.lang === 'bn-IN') ||
                  currentVoices.find(v => v.lang.startsWith('bn')) ||
                  currentVoices.find(v => v.name.toLowerCase().includes('bengali')) ||
                  currentVoices.find(v => v.name.toLowerCase().includes('bangla'));
        } else {
          // Priority matching for English
          voice = currentVoices.find(v => v.lang === 'en-US') ||
                  currentVoices.find(v => v.lang.startsWith('en'));
        }

        if (voice) {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.voice = voice;
          utterance.lang = voice.lang;
          utterance.rate = 0.8; 
          utterance.volume = 1;
          utterance.pitch = 1;

          utterance.onstart = () => setSpeakingId(id);
          utterance.onend = () => setSpeakingId(null);
          utterance.onerror = (e: any) => {
            if (e.error !== 'interrupted') {
              console.error("TTS Error:", e.error);
              if (language === 'bn') {
                 // Native failed, try fallback
                 playFallbackAudio(cleanText, id);
              } else {
                 setSpeakingId(null);
              }
            } else {
              setSpeakingId(null);
            }
          };
          window.speechSynthesis.speak(utterance);
        } else {
          // No voice found for the selected language! Use fallback immediately.
          playFallbackAudio(cleanText, id);
        }
      };

      setTimeout(() => attemptSpeak(), 100);

    } catch (err) {
      console.error("TTS Initialization Failed:", err);
      setSpeakingId(null);
    }
  };

  return { speak, speakingId, stopAll };
}
