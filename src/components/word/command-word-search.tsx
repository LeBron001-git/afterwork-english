"use client";

import { ArrowRight, BookOpen, CheckCircle2, Search, Star, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { words } from "@/lib/mock-data";
import { cn, todayKey } from "@/lib/utils";
import { useLearningStore } from "@/store/use-learning-store";

export function CommandWordSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { favoriteWords, toggleFavoriteWord, completeTask, completedTasks } = useLearningStore();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("afterwork-english:open-word-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("afterwork-english:open-word-search", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return words
      .filter((item) => {
        if (!q) return true;
        return (
          item.word.toLowerCase().includes(q) ||
          item.meaning.includes(q) ||
          item.example.toLowerCase().includes(q) ||
          item.exampleCn.includes(q) ||
          item.category.includes(q)
        );
      })
      .slice(0, 12);
  }, [query]);

  const active = results[activeIndex] ?? results[0];
  const activeFavored = active ? favoriteWords.includes(active.id) : false;
  const activeDone = active ? completedTasks[`${todayKey()}:word`]?.includes(active.id) : false;

  function close() {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter" && active) {
      event.preventDefault();
      completeTask("word", active.id);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/35 px-3 py-4 backdrop-blur-sm md:px-6 md:pt-20" onClick={close}>
      <div className="card mx-auto flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden p-3 md:max-h-[78vh]" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-[var(--line)] px-3 py-2">
          <Search size={18} className="text-muted" />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="查单词、中文释义或场景词"
            className="h-10 flex-1 bg-transparent text-sm outline-none"
            aria-label="查词输入框"
          />
          <button type="button" onClick={close} className="rounded-lg p-2 text-muted hover:bg-[var(--soft)]" aria-label="关闭查词">
            <X size={18} />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 p-2 md:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-h-0 overflow-auto pr-1">
            <div className="mb-2 flex items-center justify-between px-2 text-xs text-muted">
              <span>{query.trim() ? `找到 ${results.length} 个结果` : "推荐从基础词开始"}</span>
              <span className="hidden md:inline">上下键选择，Enter 加入今日学习</span>
            </div>
            {results.length === 0 ? (
              <div className="rounded-2xl bg-[var(--soft)] p-6 text-center text-sm text-muted">
                没有找到相关词。可以试试中文释义、英文片段或分类词。
              </div>
            ) : (
              <div className="grid gap-2">
                {results.map((item, index) => {
                  const favored = favoriteWords.includes(item.id);
                  const selected = item.id === active?.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "focus-ring grid grid-cols-[36px_minmax(0,1fr)] gap-3 rounded-xl border p-3 text-left transition",
                        selected ? "border-[var(--accent)] bg-[var(--soft)]" : "border-transparent hover:border-[var(--line)] hover:bg-[var(--soft)]",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-1 grid h-8 w-8 place-items-center rounded-lg",
                          favored ? "bg-[color-mix(in_srgb,var(--accent-3)_18%,transparent)] text-[var(--accent-3)]" : "bg-[var(--card)] text-muted",
                        )}
                      >
                        <Star size={17} fill={favored ? "currentColor" : "none"} />
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-baseline gap-2">
                          <strong className="text-base">{item.word}</strong>
                          <span className="text-xs text-muted">{item.phonetic}</span>
                          <span className="rounded-full bg-[var(--card)] px-2 py-0.5 text-xs text-muted">{item.category}</span>
                        </span>
                        <span className="mt-1 block text-sm">{item.meaning}</span>
                        <span className="mt-1 block truncate text-xs text-muted">{item.exampleCn}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="min-h-0 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
            {active ? (
              <div className="flex h-full min-h-[320px] flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-3xl font-semibold leading-tight">{active.word}</h2>
                      <span className="rounded-full bg-[var(--soft)] px-3 py-1 text-xs text-muted">{active.category}</span>
                    </div>
                    <p className="mt-2 text-muted">{active.phonetic}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavoriteWord(active.id)}
                    className={cn("rounded-xl p-2 transition hover:bg-[var(--soft)]", activeFavored ? "text-[var(--accent-3)]" : "text-muted")}
                    aria-label={activeFavored ? "取消收藏" : "收藏单词"}
                  >
                    <Star size={22} fill={activeFavored ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="mt-5 rounded-2xl bg-[var(--soft)] p-4">
                  <div className="text-xs text-muted">中文释义</div>
                  <p className="mt-1 text-xl font-semibold">{active.meaning}</p>
                </div>

                <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--card-solid)] p-4 text-sm leading-6">
                  <div className="text-xs text-muted">例句</div>
                  <p className="mt-2">{active.example}</p>
                  <p className="mt-1 text-muted">{active.exampleCn}</p>
                </div>

                <div className="mt-auto grid gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => completeTask("word", active.id)}
                    className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] transition hover:-translate-y-0.5"
                  >
                    {activeDone ? <CheckCircle2 size={17} /> : <BookOpen size={17} />}
                    {activeDone ? "已加入今日学习" : "加入今日学习"}
                  </button>
                  <a href="/word" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl text-sm text-muted hover:bg-[var(--soft)]">
                    打开完整单词本 <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid h-full min-h-[320px] place-items-center text-center text-sm text-muted">输入关键词开始查词</div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
