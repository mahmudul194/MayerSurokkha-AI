import { useState, useRef, useEffect } from "react";

export function useAudioRecorder(handleSend: any, setIsLoading: any, language: string, showToast: any) {
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setIsLoading(true); // Show loading while processing audio
    }
  };

  const startListening = async () => {
    if (isListening) {
      stopListening();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          const res = await fetch(`${apiUrl}/voice/process`, {
            method: "POST",
            body: formData
          });
          
          if (!res.ok) throw new Error("Audio processing failed");
          
          const data = await res.json();
          setIsLoading(false);
          
          if (data.is_safe) {
            handleSend(data.text, true);
            showToast(language === 'bn' ? "ভয়েস প্রসেস সফল হয়েছে" : "Audio processed successfully", "success");
          } else {
            showToast(`Moderation Flag: ${data.moderation_reason}`, "error");
          }
          
        } catch (error) {
          setIsLoading(false);
          console.error("Voice processing error:", error);
          showToast("Failed to process voice. Ensure backend is running.", "error");
        }
      };

      mediaRecorder.start();
      setIsListening(true);

    } catch (err) {
      console.error("Microphone access error:", err);
      showToast("Microphone access denied or unavailable. Please check permissions.", "error");
    }
  };

  return { isListening, startListening };
}
