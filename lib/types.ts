export interface SearchHit {
  episode_id: string;
  episode_name: string;
  text: string;
  date: string;
  timestamp: string;
  score: number;
}

export interface SearchFilters {
  speakers?: string[];
  start_date?: string;
  end_date?: string;
}

export interface AudioFile {
  key: string;
  size: number;
  last_modified: string;
  url: string;
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: SearchHit[];
};

export interface ChatStartResponse {
  request_id: string;
  status: "pending";
}

export interface ChatStatusResponse {
  status: "pending" | "processing" | "complete" | "error";
  answer?: string;
  sources?: SearchHit[];
  error_message?: string;
}
