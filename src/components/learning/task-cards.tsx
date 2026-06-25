"use client";

import { ArrowRight, BookOpen, CheckCircle2, Clock3, Compass, MessageSquareText, RotateCcw, Sparkles, SpellCheck } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
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
    <section className="card overflow-hidden p-5 md:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-1 text-xs text-muted">
              <Sparkles size={14} /> 今日学习计划
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-normal md:text-4xl">
              每天 20 分钟，把英语重新捡起来。
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted md:text-base">
              今天只需要完成一条学习轨道：单词、语法、短句、场景或复习任意一项都能形成打卡。
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MiniStep label="单词" text="5 个基础词" />
            <MiniStep label="语法" text="1 个高频点" />
            <MiniStep label="表达" text="1 段真实场景" />
          </div>
        </div>
        <div className="grid rounded-2xl border border-[var(--line)] bg-[var(--soft)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-muted">推荐时长</div>
            <Clock3 size={18} className="text-[var(--accent)]" />
          </div>
          <strong className="mt-3 text-4xl leading-none">20</strong>
          <span className="mt-1 text-sm text-muted">分钟，可拆成 3 次完成</span>
          <div className="mt-5 rounded-xl bg-[var(--card)] p-3 text-sm">
            <span className="text-muted">当前阶段</span>
            <div className="mt-1 font-semibold">Lv.{level.currentLevel} {level.currentTitle}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StudyTaskBoard() {
  const tasks: TaskCardProps[] = [
    { type: "word", title: "今日单词", subtitle: todays.word.map((item) => item.word).join(" / "), href: "/word", xp: "+2 XP/词", icon: BookOpen, accent: "基础输入" },
    { type: "grammar", title: "今日语法", subtitle: todays.grammar.title, href: "/grammar", xp: "+8 XP", icon: SpellCheck, accent: "结构理解" },
    { type: "sentence", title: "今日短句", subtitle: todays.sentence.en, href: "/sentences", xp: "+3 XP", icon: MessageSquareText, accent: "直接可用" },
    { type: "scenario", title: "场景练习", subtitle: todays.scenario.title, href: "/scenarios", xp: "+12 XP", icon: Compass, accent: "真实表达" },
    { type: "review", title: "今日复习", subtitle: "复习收藏词和错题", href: "/review", xp: "+1 XP/词", icon: RotateCcw, accent: "长期记忆" },
  ];

  return (
    <section className="card p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">任务轨道</p>
          <h2 className="mt-1 text-2xl font-semibold">今天从一条开始就够了</h2>
        </div>
        <span className="rounded-full bg-[var(--soft)] px-3 py-1 text-xs text-muted">完成任意任务即可打卡</span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task.type} {...task} />
        ))}
      </div>
    </section>
  );
}

type TaskCardProps = {
  type: "word" | "grammar" | "sentence" | "scenario" | "review";
  title: string;
  subtitle: string;
  href: string;
  xp: string;
  icon: LucideIcon;
  accent: string;
};

function TaskCard({ type, title, subtitle, href, xp, icon: Icon, accent }: TaskCardProps) {
  const { completeTask, completedTasks } = useLearningStore();
  const done = completedTasks[`${todayKey()}:${type}`]?.includes(title);
  return (
    <article className="card-solid flex min-h-[190px] flex-col p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--soft)] text-[var(--accent)]">
          {done ? <CheckCircle2 size={21} /> : <Icon size={21} />}
        </div>
        <span className="rounded-full bg-[var(--soft)] px-2.5 py-1 text-xs text-muted">{xp}</span>
      </div>
      <div className="mt-4 flex-1">
        <div className="text-xs text-muted">{accent}</div>
        <h3 className="mt-1 text-lg font-semibold">{title}</h3>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted">{subtitle}</p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Button variant={done ? "secondary" : "primary"} size="sm" onClick={() => completeTask(type, title)}>{done ? "已完成" : "完成任务"}</Button>
        <Link href={href} className="inline-flex h-9 items-center gap-1 rounded-xl px-2 text-sm text-muted hover:bg-[var(--soft)]">
          进入 <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

function MiniStep({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 font-medium">{text}</div>
    </div>
  );
}
