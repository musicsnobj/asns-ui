"use client";

import { useAudioPlayer } from "@/lib/AudioPlayerContext";
import { SearchHit } from "@/lib/types";

interface PlayButtonProps {
  hit: SearchHit;
  className?: string;
  showTimestamp?: boolean;
}

export default function PlayButton({
  hit,
  className = "",
  showTimestamp = true,
}: PlayButtonProps) {
  const { playFromHit, isLoading, currentHit } = useAudioPlayer();

  const isCurrentlyPlaying =
    currentHit?.episode_id === hit.episode_id &&
    currentHit?.timestamp === hit.timestamp;

  const handleClick = () => {
    playFromHit(hit);
  };

  const defaultClassName = "text-blue-600 hover:text-blue-800 underline";
  const finalClassName = className || defaultClassName;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading && isCurrentlyPlaying}
      className={finalClassName}
    >
      {isLoading && isCurrentlyPlaying ? (
        "Loading..."
      ) : (
        <>
          ▶ Play {showTimestamp && `from ${hit.timestamp}`}
        </>
      )}
    </button>
  );
}
