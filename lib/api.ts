import {
  SearchHit,
  AudioFile,
  ChatMessage,
  ChatStartResponse,
  ChatStatusResponse,
} from "./types";

export interface SearchResponse {
  hits: SearchHit[];
}
export interface ChatResponse {
  answer: string;
  sources: SearchHit[];
}

const API_BASE = process.env.NEXT_PUBLIC_ASNS_API;

export async function getEpisodeList(): Promise<AudioFile[]> {
  const res = await fetch(`${API_BASE}/list-episodes`);
  if (!res.ok) {
    throw new Error("Failed to get episode list");
  }
  return res.json();
}

export async function search(
  query: string,
  k: number,
  filters: object,
): Promise<SearchResponse> {
  const res = await fetch(`${API_BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, k, filters }),
  });

  if (!res.ok) {
    throw new Error("Search failed");
  }

  return res.json();
}

export async function startChat(
  messages: ChatMessage[],
): Promise<ChatStartResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    throw new Error("Failed to start chat");
  }

  return res.json();
}

export async function getChatStatus(
  requestId: string,
): Promise<ChatStatusResponse> {
  const res = await fetch(`${API_BASE}/chat/${requestId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch chat status");
  }

  return res.json();
}

export async function chat(messages: ChatMessage[]): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    throw new Error("Chat failed");
  }

  return res.json();
}

export async function getAudioUrl(episodeId: string) {
  const res = await fetch(
    `${API_BASE}/presign?episode_id=${encodeURIComponent(episodeId)}`,
  );

  if (!res.ok) {
    throw new Error("Failed to get audio URL");
  }

  const data = await res.json();
  return data.audio_url as string;
}
