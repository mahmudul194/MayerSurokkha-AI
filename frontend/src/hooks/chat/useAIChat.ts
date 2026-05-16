import { useState } from "react";

export function useAIChat(language: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages, language })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', content: "Neural link error. Ensure API Key is configured and backend is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, input, setInput, isLoading, handleSend };
}
