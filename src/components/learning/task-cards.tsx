"use client";

import { ArrowRight, BookOpen, CheckCircle2, Clock3, Compass, MessageSquareText, RotateCcw, Sparkles, SpellCheck } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildDailyPlan, minuteOptions, planTargetFor, studySlots } from "@/lib/daily-plan";
import { grammarPoints, scenarios, sentences, words } from "@/lib/mock-data";
import { cn, todayKey } from "@/lib/utils";
import { useLearningStore } from "@/store/use-learning-store";

const todays = {
  word: words.slice(0, 5),
  grammar: grammarPoints[0],
  sentence: sentences[0],
  scenario: scenarios[0],
};

export function DailyPlanCard() {
  const { level, preference, setDailyMinutes, setStudySlot, wordReviews } = useLearningStore();
  const dueReviews = Object.values(wordReviews).filter((item) => item.dueDate <= todayKey()).length;
  const plan = buildDailyPlan(preference.dailyMinutes, dueReviews, preference.studySlot);
  const activeSlot = studySlots.find((slot) => slot.id === preference.studySlot) ?? studySlots[3];
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
              选择今天能拿出来的时间，我会自动把任务拆成低压力配方；完成任意一项都能形成打卡。
            </p>
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-[220px_1fr]">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3">
              <div className="text-xs text-muted">可用时间</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {minuteOptions.map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => setDailyMinutes(minutes)}
                    className={cn(
                      "focus-ring rounded-xl border px-3 py-2 text-sm font-medium transition",
                      preference.dailyMinutes === minutes ? "border-[var(--accent)] bg-[var(--soft)]" : "border-[var(--line)] bg-[var(--card-solid)] text-muted",
                    )}
                  >
                    {minutes} 分钟
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-muted">学习时段</div>
                <span className="text-xs text-muted">{activeSlot.hint}</span>
              </div>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {studySlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setStudySlot(slot.id)}
                    className={cn(
                      "focus-ring shrink-0 rounded-xl border px-3 py-2 text-sm transition",
                      preference.studySlot === slot.id ? "border-[var(--accent)] bg-[var(--soft)] font-medium" : "border-[var(--line)] bg-[var(--card-solid)] text-muted",
                    )}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="grid rounded-2xl border border-[var(--line)] bg-[var(--soft)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-muted">推荐时长</div>
            <Clock3 size={18} className="text-[var(--accent)]" />
          </div>
          <strong className="mt-3 text-4xl leading-none">{preference.dailyMinutes}</strong>
          <span className="mt-1 text-sm text-muted">分钟，可拆成 3 次完成</span>
          <div className="mt-5 rounded-xl bg-[var(--card)] p-3 text-sm">
            <span className="text-muted">当前阶段</span>
            <div className="mt-1 font-semibold">Lv.{level.currentLevel} {level.currentTitle}</div>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {plan.map((item) => (
          <MiniStep key={item.key} label={`${item.minutes} 分钟 · ${item.label}`} text={`${item.target} · ${item.reason}`} />
        ))}
      </div>
    </section>
  );
}

export function StudyTaskBoard() {
  const { preference, wordReviews } = useLearningStore();
  const dueReviews = Object.values(wordReviews).filter((item) => item.dueDate <= todayKey()).length;
  const plan = buildDailyPlan(preference.dailyMinutes, dueReviews, preference.studySlot);
  const tasks: TaskCardProps[] = [
    { type: "word", title: "今日单词", subtitle: todays.word.map((item) => item.word).join(" / "), href: "/word", xp: "+2 XP/词", icon: BookOpen, accent: planTargetFor(plan, "word") ?? "可选" },
    { type: "grammar", title: "今日语法", subtitle: todays.grammar.title, href: "/grammar", xp: "+8 XP", icon: SpellCheck, accent: planTargetFor(plan, "grammar") ?? "可选" },
    { type: "sentence", title: "今日短句", subtitle: todays.sentence.en, href: "/sentences", xp: "+3 XP", icon: MessageSquareText, accent: planTargetFor(plan, "sentence") ?? "可选" },
    { type: "scenario", title: "场景练习", subtitle: todays.scenario.title, href: "/scenarios", xp: "+12 XP", icon: Compass, accent: planTargetFor(plan, "scenario") ?? "可选" },
    { type: "review", title: "今日复习", subtitle: "复习收藏词和错题", href: "/review", xp: "+1 XP/词", icon: RotateCcw, accent: planTargetFor(plan, "review") ?? "可选" },
  ];

  return (
    <section className="card p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">任务轨道</p>
          <h2 className="mt-1 text-2xl font-semibold">今天从一条开始就够了</h2>
        </div>
        <span className="rounded-full bg-[var(--soft)] px-3 py-1 text-xs text-muted">按 {preference.dailyMinutes} 分钟自动生成</span>
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
