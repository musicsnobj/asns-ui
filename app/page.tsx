"use client";

import { useState } from "react";
import { search } from "@/lib/api";
import { SearchHit, SearchFilters } from "@/lib/types";
import { dateToNumber } from "@/lib/utils";
import DateRangePicker from "@/app/components/DateRangePicker";
import PlayButton from "@/app/components/PlayButton";

const ALL_SPEAKERS = ["Jess", "Jack Brett"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [numResults, setNumResults] = useState<number>(10);
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  async function runSearch() {
    const filters: SearchFilters = {
      speakers: selectedSpeakers.length ? selectedSpeakers : undefined,
      start_date: startDate ? dateToNumber(startDate) : undefined,
      end_date: endDate ? dateToNumber(endDate) : undefined,
    };
    const data = await search(query, numResults, filters);
    setResults(data.hits);
  }

  function toggleSpeaker(s: string) {
    setSelectedSpeakers((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  return (
    <main className="p-10">
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="flex w-full max-w-lg">
          <input
            className="border p-2 w-96 rounded-l"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search episodes..."
          />
          <button
            onClick={runSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-r"
          >
            Search
          </button>
        </div>

        {/* Advanced search toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="mt-3 text-sm text-blue-600 underline"
        >
          {showAdvanced ? "Hide advanced search" : "Show advanced search"}
        </button>

        {/* Advanced search panel */}
        {showAdvanced && (
          <div className="mt-4 w-full max-w-lg border rounded p-4 bg-gray-50 space-y-4">
            {/* Limit */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Results limit
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={numResults}
                onChange={(e) => setNumResults(Number(e.target.value) || 1)}
                className="border rounded px-2 py-1 w-24"
              />
            </div>

            {/* Speakers */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium">Speakers</label>
                <button
                  type="button"
                  className="text-xs text-blue-600"
                  onClick={() => setSelectedSpeakers([])}
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_SPEAKERS.map((s) => {
                  const active = selectedSpeakers.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSpeaker(s)}
                      className={`px-2 py-1 rounded text-xs border ${
                        active
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <DateRangePicker
                value={{
                  startDate,
                  endDate,
                }}
                onChange={(newValue) => {
                  setStartDate(newValue?.startDate || null);
                  setEndDate(newValue?.endDate || null);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center mt-8 space-y-4">
        {results.map((r, i) => (
          <div key={i} className="border p-4 w-full max-w-2xl rounded shadow">
            <div className="font-bold flex justify-between">
              <span>{r.episode_name}</span>
              <span className="text-gray-500 text-sm">
                Score: {r.score.toFixed(3)}
              </span>
            </div>
            <div className="text-sm text-gray-500">{r.timestamp}</div>
            <div className="mt-2">{r.text}</div>
            <div className="mt-2 flex gap-3">
              <PlayButton hit={r} showTimestamp={false} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
