"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  ReactNode,
  RefObject,
} from "react";
import { SearchHit } from "./types";
import { getAudioUrl } from "./api";
import { timestampToSeconds } from "./time";

interface AudioPlayerState {
  currentHit: SearchHit | null;
  audioUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
}

interface AudioPlayerContextValue extends AudioPlayerState {
  audioRef: RefObject<HTMLAudioElement | null>;
  playFromHit: (hit: SearchHit) => Promise<void>;
  pause: () => void;
  play: () => void;
  close: () => void;
  seek: (time: number) => void;
  togglePlayPause: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentHit, setCurrentHit] = useState<SearchHit | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const playFromHit = useCallback(
    async (hit: SearchHit) => {
      try {
        setIsLoading(true);
        setError(null);

        const url = await getAudioUrl(hit.episode_id);
        setAudioUrl(url);
        setCurrentHit(hit);
        setTimeout(() => {
          if (audioRef.current) {
            const audio = audioRef.current;
            const handleLoadedMetadata = () => {
              setIsLoading(false);
              if (audio.duration) {
                setDuration(audio.duration);
              }
              audio.currentTime = timestampToSeconds(hit.timestamp);
              audio.addEventListener("timeupdate", () =>
                setCurrentTime(audio.currentTime),
              );
              audio.addEventListener("durationchange", () =>
                setDuration(audio.duration),
              );
              audio.addEventListener("play", () => setIsPlaying(true));
              audio.addEventListener("pause", () => setIsPlaying(false));
              audio.addEventListener("ended", () => setIsPlaying(false));
              audio.play();
              audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            };

            audio.addEventListener("loadedmetadata", handleLoadedMetadata);
            console.log("loadedmetadata listener added");
            audio.src = url;
          }
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load audio");
        setIsLoading(false);
      }
    },
    [audioRef.current],
  );

  const close = useCallback(() => {
    setCurrentHit(null);
    setAudioUrl(null);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play();
  }, []);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [isPlaying]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const value: AudioPlayerContextValue = {
    currentHit,
    audioUrl,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    error,
    audioRef,
    playFromHit,
    pause,
    play,
    seek,
    close,
    togglePlayPause,
    setCurrentTime,
    setDuration,
    setIsPlaying,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return context;
}
