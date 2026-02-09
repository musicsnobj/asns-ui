"use client";

import { useState } from "react";
import { ChatMessage } from "@/lib/types";
import { useChat } from "@/lib/hooks";
import PlayButton from "@/app/components/PlayButton";

export default function Chatbot() {
  // const [messages, setMessages] = useState<ChatMessage[]>([]);
  // const [requestId, setRequestId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  const { start, status, messages, error, isLoading } = useChat();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    };
    const nextMessages = [...messages, userMessage];
    await start(nextMessages);
    setInput("");
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-6 h-[calc(100vh-4rem)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="whitespace-pre-line">{msg.content}</div>

              {/* Sources */}
              {msg.role === "assistant" && msg.sources?.length ? (
                <div className="mt-4 border-t border-gray-300 pt-3 space-y-3">
                  <div className="text-xs font-semibold text-gray-600">
                    Sources
                  </div>

                  {msg.sources.map((src, sidx) => (
                    <div
                      key={sidx}
                      className="rounded-md bg-white p-3 text-xs text-gray-800"
                    >
                      <div className="mb-1 text-gray-500">{src.date}</div>

                      <div>{src.text}</div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-[10px] text-gray-400 break-all">
                          {src.episode_name}
                        </div>
                        <PlayButton hit={src} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="text-sm text-gray-500 italic">
            Assistant is thinking…
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about the podcast…"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
