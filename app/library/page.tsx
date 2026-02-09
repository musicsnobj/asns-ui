"use client";

import { useEffect, useState } from "react";
import { AudioFile, SearchHit } from "@/lib/types";
import { getEpisodeList } from "@/lib/api";
import { extractDateFromFilename } from "@/lib/utils";
import { useAudioPlayer } from "@/lib/AudioPlayerContext";

export default function LibraryPage() {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playFromHit } = useAudioPlayer();

  useEffect(() => {
    async function loadEpisodes() {
      try {
        const data = await getEpisodeList();
        setFiles(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load episodes");
      } finally {
        setLoading(false);
      }
    }

    loadEpisodes();
  }, []);

  const handlePlayInGlobalPlayer = (file: AudioFile) => {
    const episodeId = file.key;

    const searchHit: SearchHit = {
      episode_id: episodeId,
      episode_name: episodeId,
      text: "Playing full episode from library",
      date: extractDateFromFilename(episodeId),
      timestamp: "0:00",
      score: 1.0,
    };

    playFromHit(searchHit);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        Loading…
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Episodes</h1>

      <div className="space-y-6">
        {files.map((f) => (
          <div key={f.key} className="border rounded-lg p-4 shadow-sm bg-white">
            {/* Top row: filename + size */}
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold break-all">{f.key}</div>
              <div className="text-sm text-gray-500">
                {(f.size / 1024 / 1024).toFixed(1)} MB
              </div>
            </div>

            {/* Button to load in global player */}
            <div className="mt-2 mb-3">
              <button
                onClick={() => handlePlayInGlobalPlayer(f)}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                ▶ Load in Global Player
              </button>
            </div>

            {/* Audio player on its own row */}
            <div className="mt-3">
              <audio controls src={f.url} className="w-full" preload="none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
