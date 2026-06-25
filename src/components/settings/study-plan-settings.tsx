"use client";

import { Clock3 } from "lucide-react";
import { buildDailyPlan, minuteOptions, studySlots } from "@/lib/daily-plan";
import { cn, todayKey } from "@/lib/utils";
import { useLearningStore } from "@/store/use-learning-store";

export function StudyPlanSettings() {
  const { preference, setDailyMinutes, setStudySlot, wordReviews } = useLearningStore();
  const dueReviews = Object.values(wordReviews).filter((item) => item.dueDate <= todayKey()).length;
  const plan = buildDailyPlan(preference.dailyMinutes, dueReviews, preference.studySlot);

  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">默认学习计划</p>
          <h2 className="mt-2 text-2xl font-semibold">设置每天适合自己的节奏</h2>
          <p className="mt-2 max-w-2xl text-muted">这里的设置会同步影响首页的今日计划。低压力比硬撑更容易长期坚持。</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)]">
          <Clock3 size={24} />
        </div>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
          <div className="text-sm font-medium">每日可用时间</div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {minuteOptions.map((minutes) => (
              <button
                key={minutes}
                onClick={() => setDailyMinutes(minutes)}
                className={cn(
                  "focus-ring rounded-xl border px-3 py-2 text-sm transition",
                  preference.dailyMinutes === minutes ? "border-[var(--accent)] bg-[var(--soft)] font-medium" : "border-[var(--line)] bg-[var(--card-solid)] text-muted",
                )}
              >
                {minutes} 分钟
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
          <div className="text-sm font-medium">常用学习时段</div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {studySlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setStudySlot(slot.id)}
                className={cn(
                  "focus-ring rounded-xl border px-3 py-2 text-sm transition",
                  preference.studySlot === slot.id ? "border-[var(--accent)] bg-[var(--soft)] font-medium" : "border-[var(--line)] bg-[var(--card-solid)] text-muted",
                )}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        {plan.map((item) => (
          <div key={item.key} className="rounded-2xl bg-[var(--soft)] p-3 text-sm">
            <div className="text-xs text-muted">{item.label}</div>
            <div className="mt-1 font-semibold">{item.target}</div>
            <div className="mt-1 text-xs text-muted">{item.minutes} 分钟</div>
          </div>
        ))}
      </div>
    </section>
  );
}
