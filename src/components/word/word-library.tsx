"use client";

import { BookOpen, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { words } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useLearningStore } from "@/store/use-learning-store";
import type { WordItem } from "@/types/learning";

const categories: { id: "all" | WordItem["category"]; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "basic", label: "基础" },
  { id: "workplace", label: "职场" },
  { id: "testing", label: "测试" },
  { id: "finance", label: "金融" },
  { id: "commerce", label: "跨境" },
];

export function WordLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]["id"]>("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const { favoriteWords, toggleFavoriteWord, completeTask, wordReviews } = useLearningStore();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return words.filter((item) => {
      const categoryMatch = category === "all" || item.category === category;
      const queryMatch = !q || item.word.includes(q) || item.meaning.includes(q) || item.example.toLowerCase().includes(q);
      const favoriteMatch = !favoritesOnly || favoriteWords.includes(item.id);
      return categoryMatch && queryMatch && favoriteMatch;
    });
  }, [category, favoriteWords, favoritesOnly, query]);

  const categoryCounts = categories.map((item) => ({
    ...item,
    count: item.id === "all" ? words.length : words.filter((word) => word.category === item.id).length,
  }));

  return (
    <div className="grid gap-5">
      <section className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">单词本</p>
            <h1 className="mt-2 text-3xl font-semibold">先会用，再慢慢记牢。</h1>
            <p className="mt-2 max-w-2xl text-muted">支持分类筛选、关键词搜索和收藏视图。收藏或学过的词会进入复习队列。</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="词库" value={words.length} />
            <Metric label="收藏" value={favoriteWords.length} />
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 lg:flex-row">
          <label className="focus-within:ring-[var(--ring)] flex h-11 flex-1 items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 focus-within:ring-2">
            <Search size={18} className="text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索英文、中文或例句" className="h-full flex-1 bg-transparent text-sm outline-none" />
          </label>
          <Button variant={favoritesOnly ? "primary" : "secondary"} onClick={() => setFavoritesOnly((value) => !value)}>
            <Star size={16} fill={favoritesOnly ? "currentColor" : "none"} /> 只看收藏
          </Button>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {categoryCounts.map((item) => (
            <button
              key={item.id}
              onClick={() => setCategory(item.id)}
              className={cn(
                "focus-ring shrink-0 rounded-xl border px-4 py-2 text-sm transition",
                category === item.id ? "border-[var(--accent)] bg-[var(--soft)]" : "border-[var(--line)] bg-[var(--card)] text-muted hover:text-[var(--foreground)]",
              )}
            >
              {item.label} <span className="text-xs text-muted">{item.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => {
          const favored = favoriteWords.includes(item.id);
          const review = wordReviews[item.id];
          return (
            <article key={item.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--soft)] text-[var(--accent)]">
                  <BookOpen size={22} />
                </div>
                <button onClick={() => toggleFavoriteWord(item.id)} className={cn("rounded-xl p-2 transition hover:bg-[var(--soft)]", favored ? "text-[var(--accent-3)]" : "text-muted")}>
                  <Star size={19} fill={favored ? "currentColor" : "none"} />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-baseline gap-2">
                <h2 className="text-xl font-semibold">{item.word}</h2>
                <span className="text-sm text-muted">{item.phonetic}</span>
              </div>
              <p className="mt-1 font-medium">{item.meaning}</p>
              <p className="mt-4 rounded-2xl bg-[var(--soft)] p-4 text-sm leading-6">
                {item.example}
                <br />
                <span className="text-muted">{item.exampleCn}</span>
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-[var(--soft)] px-3 py-1 text-xs text-muted">{item.category}</span>
                {review && <span className="text-xs text-muted">下次复习：{review.dueDate}</span>}
              </div>
              <Button className="mt-4 w-full" variant="primary" onClick={() => completeTask("word", item.id)}>
                学过这个词
              </Button>
            </article>
          );
        })}
      </section>
      {filtered.length === 0 && <section className="card p-8 text-center text-muted">没有匹配的单词。换个关键词或关闭收藏筛选试试。</section>}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-[var(--soft)] px-4 py-3 text-center">
      <div className="text-xs text-muted">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}
