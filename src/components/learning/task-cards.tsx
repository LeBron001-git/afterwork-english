"use client";

import { ArrowRight, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { grammarPoints, scenarios, sentences, words } from "@/lib/mock-data";
import { todayKey } from "@/lib/utils";
import { useLearningStore } from "@/store/use-learning-store";

const todays = {
  word: words.slice(0, 5),
  grammar: grammarPoints[0],
  sentence: sentences[0],
  scenario: scenarios[0],
};

export function DailyPlanCard() {
  const level = useLearningStore((state) => state.level);
  return (
    <section className="card overflow-hidden p-5 md:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">今日学习计划</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-normal md:text-4xl">每天 20 分钟，把英语重新捡起来。</h1>
          <p className="mt-3 max-w-xl text-muted">低压力、短任务、本地保存。今天先完成任意一项，就算打卡成功。</p>
        </div>
        <div className="rounded-2xl bg-[var(--soft)] p-4 text-sm">
          <div className="flex items-center gap-2 text-muted"><Clock3 size={16} /> 推荐时长</div>
          <strong className="mt-1 block text-2xl">20 分钟</strong>
          <span className="text-muted">当前 {level.currentTitle}</span>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <MiniStep text="5 个基础单词" />
        <MiniStep text="1 个语法点" />
        <MiniStep text="1 段真实场景" />
      </div>
    </section>
  );
}

export function StudyTaskGrid() {
  return (
    <>
      <TaskCard type="word" title="今日单词" subtitle={todays.word.map((item) => item.word).join(" / ")} href="/word" xp="+2 XP/词" />
      <TaskCard type="grammar" title="今日语法" subtitle={todays.grammar.title} href="/grammar" xp="+8 XP" />
      <TaskCard type="sentence" title="今日短句" subtitle={todays.sentence.en} href="/sentences" xp="+3 XP" />
      <TaskCard type="scenario" title="场景练习" subtitle={todays.scenario.title} href="/scenarios" xp="+12 XP" />
      <TaskCard type="review" title="今日复习" subtitle="复习收藏词和错题" href="/review" xp="+1 XP/词" />
    </>
  );
}

function TaskCard({ type, title, subtitle, href, xp }: { type: "word" | "grammar" | "sentence" | "scenario" | "review"; title: string; subtitle: string; href: string; xp: string }) {
  const { completeTask, completedTasks } = useLearningStore();
  const done = completedTasks[`${todayKey()}:${type}`]?.includes(title);
  return (
    <section className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--soft)] text-[var(--accent)]">
          {done ? <CheckCircle2 size={22} /> : <Sparkles size={22} />}
        </div>
        <span className="rounded-full bg-[var(--soft)] px-3 py-1 text-xs text-muted">{xp}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 min-h-11 text-sm text-muted">{subtitle}</p>
      <div className="mt-4 flex gap-2">
        <Button variant={done ? "secondary" : "primary"} size="sm" onClick={() => completeTask(type, title)}>{done ? "已完成" : "完成任务"}</Button>
        <Link href={href} className="inline-flex h-9 items-center gap-1 rounded-xl px-2 text-sm text-muted hover:bg-[var(--soft)]">
          进入 <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

function MiniStep({ text }: { text: string }) {
  return <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm">{text}</div>;
}
