"use client";

import { Search, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { words } from "@/lib/mock-data";
import { useLearningStore } from "@/store/use-learning-store";

export function CommandWordSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { favoriteWords, toggleFavoriteWord } = useLearningStore();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return words.filter((item) => !q || item.word.includes(q) || item.meaning.includes(q)).slice(0, 9);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-black/30 px-4 pt-24 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="card mx-auto w-full max-w-2xl overflow-hidden p-3" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-[var(--line)] px-3 py-2">
          <Search size={18} className="text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="查单词、中文释义或场景词"
            className="h-10 flex-1 bg-transparent text-sm outline-none"
          />
          <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-muted hover:bg-[var(--soft)]">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-auto p-2">
          {results.map((item) => {
            const favored = favoriteWords.includes(item.id);
            return (
              <div key={item.id} className="flex gap-3 rounded-xl p-3 hover:bg-[var(--soft)]">
                <button onClick={() => toggleFavoriteWord(item.id)} className={favored ? "text-[var(--accent-3)]" : "text-muted"}>
                  <Star size={18} fill={favored ? "currentColor" : "none"} />
                </button>
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <strong>{item.word}</strong>
                    <span className="text-xs text-muted">{item.phonetic}</span>
                    <span className="rounded-full bg-[var(--soft)] px-2 py-0.5 text-xs text-muted">{item.category}</span>
                  </div>
                  <p className="mt-1 text-sm">{item.meaning}</p>
                  <p className="mt-1 text-xs text-muted">{item.exampleCn}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
