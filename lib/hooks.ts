"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SearchHit, ChatMessage, ChatStatusResponse } from "@/lib/types";
import { startChat, getChatStatus } from "@/lib/api";

const POLL_INTERVAL_MS = 1500;

export function useChat() {
  const [status, setStatus] = useState<ChatStatusResponse["status"] | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // const [sources, setSources] = useState<SearchHit[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  // Keep interval ID in a ref so it survives re-renders
  const pollerRef = useRef<NodeJS.Timeout | null>(null);

  const clearPoller = () => {
    if (pollerRef.current) {
      clearInterval(pollerRef.current);
      pollerRef.current = null;
    }
  };

  const pollStatus = useCallback(async (id: string) => {
    try {
      const res = await getChatStatus(id);

      setStatus(res.status);

      if (res.status === "complete") {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: res.answer!,
          sources: res.sources,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        clearPoller();
      }

      if (res.status === "error") {
        setError(res.error_message ?? "Unknown error");
        clearPoller();
      }
    } catch (err) {
      setError("Failed to fetch chat status");
      clearPoller();
    }
  }, []);

  const start = useCallback(
    async (messages: ChatMessage[]) => {
      // Reset state for a new request
      clearPoller();
      setStatus(null);
      setMessages(messages);
      setError(null);
      setRequestId(null);

      const res = await startChat(messages);
      console.log("start chat response: ", res);
      setRequestId(res.request_id);
      setStatus(res.status);

      // Start polling
      pollerRef.current = setInterval(() => {
        pollStatus(res.request_id);
      }, POLL_INTERVAL_MS);
    },
    [pollStatus],
  );

  // Cleanup on unmount (important for route changes)
  useEffect(() => {
    return () => clearPoller();
  }, []);

  return {
    start,
    status,
    messages,
    error,
    requestId,
    isLoading: status === "pending" || status === "processing",
  };
}
