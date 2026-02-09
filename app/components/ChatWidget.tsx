"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useRef } from "react";
import { ChatMessage } from "@/lib/types";
import { useChat } from "@/lib/hooks";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState("");
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

  const UserMessage = (message: ChatMessage, key: number) => {
    return (
      <div className="mb-2 text-right" key={key}>
        <p className="bg-blue-500 text-white rounded-lg py-2 px-4 inline-block">
          {message.content}
        </p>
      </div>
    );
  };
  const AssistantMessage = (message: ChatMessage, key: number) => {
    return (
      <div className="mb-2" key={key}>
        <div className="text-sm prose prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
        {message.sources?.length ? (
          <div className="mt-4 border-t border-gray-300 pt-3 space-y-3">
            <div className="text-xs font-semibold text-gray-600">Sources</div>
            {message.sources.map((source, sidx) => (
              <div
                className="rounded-md bg-white p-3 text-xs text-gray-800"
                key={sidx}
              >
                <div className="mb-1 text-gray-500">{source.date}</div>
                <div>{source.text}</div>
                <div className="mt-1 text-[10px] text-gray-400 break-all">
                  {source.episode_name}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  };
  return (
    <>
      <div className="fixed bottom-0 right-0 mb-4 mr-4">
        <button
          className={`${isOpen ? "hidden " : ""}bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center`}
          onClick={() => setIsOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Chat with Assistant
        </button>
        <div
          className={`${isOpen ? "" : "hidden "}fixed bottom-4 right-4 w-96`}
        >
          <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
            <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
              <p className="text-lg font-semibold">Assistant</p>
              <button
                className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="p-4 h-80 overflow-y-auto">
              {messages.map((message, idx) =>
                message.role === "user"
                  ? UserMessage(message, idx)
                  : AssistantMessage(message, idx),
              )}
              {isLoading && (
                <div className="text-sm text-gray-500 italic">
                  Assistant is thinking…
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t flex">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something about the podcast…"
                className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
