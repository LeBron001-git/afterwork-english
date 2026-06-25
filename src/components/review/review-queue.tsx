"use client";

import { addDays, compareAsc, format, isBefore, parseISO } from "date-fns";
import { CalendarClock, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { words } from "@/lib/mock-data";
import { todayKey } from "@/lib/utils";
import { useLearningStore } from "@/store/use-learning-store";
import type { WordItem, WordReviewState } from "@/types/learning";

const ratingCopy: Record<NonNullable<WordReviewState["lastRating"]>, { label: string; hint: string }> = {
  again: { label: "再来一次", hint: "明天复习" },
  hard: { label: "有点难", hint: "短间隔" },
  good: { label: "记住了", hint: "正常间隔" },
  easy: { label: "很轻松", hint: "拉长间隔" },
};

export function ReviewQueue() {
  const { favoriteWords, wordReviews, completedTasks, reviewWord, toggleFavoriteWord } = useLearningStore();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [sessionDone, setSessionDone] = useState<string[]>([]);

  const learnedWordIds = useMemo(() => {
    const ids = new Set<string>([...favoriteWords, ...Object.keys(wordReviews)]);
    Object.entries(completedTasks).forEach(([key, values]) => {
      if (key.endsWith(":word")) values.forEach((id) => ids.add(id));
    });
    return ids;
  }, [completedTasks, favoriteWords, wordReviews]);

  const queue = useMemo(() => {
    const today = new Date();
    const items = words
      .filter((word) => learnedWordIds.has(word.id))
      .map((word) => {
        const review = wordReviews[word.id] ?? initialReview(word.id);
        const due = parseISO(review.dueDate);
        return { word, review, due, dueNow: isBefore(due, addDays(today, 1)) };
      })
      .sort((a, b) => compareAsc(a.due, b.due) || b.review.wrongCount - a.review.wrongCount);
    return items;
  }, [learnedWordIds, wordReviews]);

  const dueItems = queue.filter((item) => item.dueNow && !sessionDone.includes(item.word.id));
  const upcoming = queue.filter((item) => !item.dueNow).slice(0, 8);
  const seedWords = words.slice(0, 8).filter((word) => !learnedWordIds.has(word.id));

  function rate(word: WordItem, rating: NonNullable<WordReviewState["lastRating"]>) {
    reviewWord(word.id, rating);
    setSessionDone((current) => [...current, word.id]);
    setRevealed((current) => ({ ...current, [word.id]: false }));
  }

  return (
    <div className="grid gap-5">
      <section className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">今日复习</p>
            <h1 className="mt-2 text-3xl font-semibold">该复习的词，今天出现。</h1>
            <p className="mt-2 max-w-2xl text-muted">根据你的反馈自动安排下一次复习。难的词更快回来，轻松的词间隔更长。</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <Metric label="今日待复习" value={dueItems.length} />
            <Metric label="已复习" value={sessionDone.length} />
            <Metric label="队列总数" value={queue.length} />
          </div>
        </div>
      </section>

      {dueItems.length === 0 && (
        <section className="card p-6">
          <div className="grid place-items-center rounded-2xl bg-[var(--soft)] p-8 text-center">
            <CheckCircle2 size={34} className="text-[var(--accent-2)]" />
            <h2 className="mt-3 text-xl font-semibold">今天的复习清空了</h2>
            <p className="mt-2 max-w-md text-sm text-muted">收藏或学习更多单词后，它们会按间隔重复规则进入这里。</p>
          </div>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        {dueItems.map(({ word, review }) => {
          const show = revealed[word.id];
          return (
            <article key={word.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--soft)] text-[var(--accent)]">
                  <RotateCcw size={22} />
                </div>
                <span className="rounded-full bg-[var(--soft)] px-3 py-1 text-xs text-muted">
                  已复习 {review.reviewedCount} 次
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-semibold">{word.word}</h2>
              <p className="mt-1 text-muted">{word.phonetic}</p>
              {!show ? (
                <div className="mt-5 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card)] p-5 text-sm text-muted">
                  先在心里想一下意思和例句，再翻开答案。
                </div>
              ) : (
                <div className="mt-5 rounded-2xl bg-[var(--soft)] p-5 text-sm leading-6">
                  <strong>{word.meaning}</strong>
                  <br />
                  {word.example}
                  <br />
                  <span className="text-muted">{word.exampleCn}</span>
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => setRevealed((current) => ({ ...current, [word.id]: !show }))}>
                  {show ? "收起答案" : "显示答案"}
                </Button>
                {show &&
                  (Object.keys(ratingCopy) as NonNullable<WordReviewState["lastRating"]>[]).map((rating) => (
                    <Button key={rating} variant={rating === "again" ? "secondary" : "primary"} onClick={() => rate(word, rating)}>
                      {ratingCopy[rating].label}
                    </Button>
                  ))}
              </div>
              {show && (
                <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-muted">
                  {(Object.keys(ratingCopy) as NonNullable<WordReviewState["lastRating"]>[]).map((rating) => (
                    <span key={rating} className="rounded-xl bg-[var(--card)] px-2 py-2 text-center">{ratingCopy[rating].hint}</span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </section>

      {queue.length === 0 && (
        <section className="card p-6">
          <div className="flex items-center gap-3">
            <Sparkles size={22} className="text-[var(--accent)]" />
            <div>
              <h2 className="text-xl font-semibold">先放几个词进复习队列</h2>
              <p className="text-sm text-muted">收藏这些基础词，马上就能开始第一轮复习。</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {seedWords.map((word) => (
              <button key={word.id} onClick={() => toggleFavoriteWord(word.id)} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 text-left transition hover:-translate-y-0.5 hover:bg-[var(--soft)]">
                <strong>{word.word}</strong>
                <p className="mt-1 text-sm text-muted">{word.meaning}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="card p-5">
          <div className="flex items-center gap-2">
            <CalendarClock size={20} className="text-[var(--accent)]" />
            <h2 className="text-xl font-semibold">接下来会出现</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {upcoming.map(({ word, review }) => (
              <div key={word.id} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
                <strong>{word.word}</strong>
                <p className="mt-1 text-sm text-muted">{word.meaning}</p>
                <p className="mt-3 text-xs text-muted">下次复习：{format(parseISO(review.dueDate), "yyyy-MM-dd")}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function initialReview(wordId: string): WordReviewState {
  return {
    wordId,
    dueDate: todayKey(),
    intervalDays: 0,
    ease: 2.3,
    reviewedCount: 0,
    correctStreak: 0,
    wrongCount: 0,
  };
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-[var(--soft)] px-4 py-3">
      <div className="text-xs text-muted">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}
