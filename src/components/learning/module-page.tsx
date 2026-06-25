"use client";

import { BookOpen, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLearningStore } from "@/store/use-learning-store";
import { todayKey } from "@/lib/utils";

type ModuleItem = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  meta?: string;
};

export function ModulePage({
  title,
  subtitle,
  type,
  items,
}: {
  title: string;
  subtitle: string;
  type: "word" | "grammar" | "sentence" | "phonetic" | "scenario" | "exercise" | "review";
  items: ModuleItem[];
}) {
  const { completeTask, completedTasks } = useLearningStore();
  const doneIds = completedTasks[`${todayKey()}:${type}`] ?? [];
  return (
    <div className="grid gap-5">
      <section className="card p-6">
        <p className="text-sm text-muted">学习模块</p>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        <p className="mt-2 max-w-2xl text-muted">{subtitle}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const done = doneIds.includes(item.id);
          return (
            <article key={item.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--soft)] text-[var(--accent)]">
                  {done ? <CheckCircle2 size={22} /> : <BookOpen size={22} />}
                </div>
                {item.meta && <span className="rounded-full bg-[var(--soft)] px-3 py-1 text-xs text-muted">{item.meta}</span>}
              </div>
              <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-muted">{item.subtitle}</p>
              <p className="mt-4 rounded-2xl bg-[var(--soft)] p-4 text-sm leading-6">{item.body}</p>
              <Button className="mt-4 w-full" variant={done ? "secondary" : "primary"} onClick={() => completeTask(type, item.id)}>
                <Star size={16} fill={done ? "currentColor" : "none"} /> {done ? "已加入今日记录" : "完成这一项"}
              </Button>
            </article>
          );
        })}
      </section>
    </div>
  );
}
