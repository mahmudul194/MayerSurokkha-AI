import { useState } from "react";
import { db } from "@/lib/db";

export function useChatApi(messages: any[], setMessages: any, speak: any, language: string) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (overrideText?: string, autoSpeak: boolean = false) => {
    const messageToSend = overrideText || input;
    if (!messageToSend.trim()) return;
    
    const userMsg: { role: 'user' | 'bot', content: string, timestamp: number, synced: boolean } = { 
      role: 'user', 
      content: messageToSend, 
      timestamp: Date.now(), 
      synced: false 
    };
    
    await db.chatHistory.add(userMsg);
    setMessages((prev: any[]) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend, history: messages, language })
      });
      const data = await res.json();
      
      const botMsg: { role: 'user' | 'bot', content: string, timestamp: number, synced: boolean } = { 
        role: 'bot', 
        content: data.response, 
        timestamp: Date.now(), 
        synced: false 
      };
      
      await db.chatHistory.add(botMsg);
      setMessages((prev: any[]) => {
        const updated = [...prev, botMsg];
        if (autoSpeak && speak) {
          // Play the response out loud
          speak(botMsg.content, updated.length - 1);
        }
        return updated;
      });
    } catch (e) {
      const errorMsg: { role: 'user' | 'bot', content: string, timestamp: number, synced: boolean } = { 
        role: 'bot', 
        content: "Neural link error. Ensure API Key is configured and backend is running.", 
        timestamp: Date.now(), 
        synced: false 
      };
      setMessages((prev: any[]) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return { input, setInput, isLoading, setIsLoading, handleSend };
}
