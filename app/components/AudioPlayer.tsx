"use client";

import { useEffect } from "react";
import { useAudioPlayer } from "@/lib/AudioPlayerContext";

export default function AudioPlayer() {
  const {
    currentHit,
    audioUrl,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    error,
    audioRef,
    togglePlayPause,
    seek,
    close,
  } = useAudioPlayer();

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  // Don't show the player if there's no audio loaded
  if (!audioUrl && !currentHit) {
    return null;
  }

  return (
    <div className="fixed left-0 bottom-10 top-10 w-80 bg-white border-l shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 flex justify-between">
        <p className="text-lg font-semibold">Now Playing</p>
        <button
          className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
          onClick={close}
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

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {currentHit ? (
          <div className="space-y-4">
            {/* Episode Info */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700">Episode</h3>
              <p className="text-base font-medium">{currentHit.episode_name}</p>
            </div>

            {/* Date */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700">Date</h3>
              <p className="text-sm">{currentHit.date}</p>
            </div>

            {/* Timestamp */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700">
                Started at
              </h3>
              <p className="text-sm">{currentHit.timestamp}</p>
            </div>

            {/* Transcript excerpt */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700">Context</h3>
              <p className="text-sm text-gray-600 italic">{currentHit.text}</p>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No episode loaded</div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Player Controls */}
      <div className="p-4 border-t bg-gray-50">
        {isLoading ? (
          <div className="text-center text-sm text-gray-500">
            Loading audio...
          </div>
        ) : (
          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={!audioUrl}
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              disabled={!audioUrl}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
          </div>
        )}
      </div>

      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          className="hidden"
          preload="metadata"
        />
      )}
    </div>
  );
}
