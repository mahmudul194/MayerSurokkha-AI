import { useState, useEffect } from "react";
import { db } from "@/lib/db";

export function useChatDb() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const history = await db.chatHistory.orderBy('timestamp').toArray();
    setMessages(history);
  };

  const clearHistory = async () => {
    await db.chatHistory.clear();
    setMessages([]);
  };

  return {
    messages,
    setMessages,
    clearHistory
  };
}
