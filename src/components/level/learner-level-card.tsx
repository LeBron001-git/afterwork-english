"use client";

import { Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { levels } from "@/lib/utils";
import { useLearningStore } from "@/store/use-learning-store";

export function LearnerLevelCard() {
  const { level, levelUpMessage, dismissLevelUp } = useLearningStore();
  const current = levels.find((item) => item.level === level.currentLevel) ?? levels[0];
  const denominator = Math.max(1, level.nextLevelXp - level.currentLevelMinXp);
  const percent = level.currentLevel === 12 ? 100 : Math.min(100, ((level.totalXp - level.currentLevelMinXp) / denominator) * 100);

  return (
    <>
      <section className="card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">成长等级</p>
            <h2 className="mt-1 text-2xl font-semibold">Lv.{level.currentLevel} {level.currentTitle}</h2>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)]">
            <Award size={25} />
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-[var(--soft)] p-4">
          <div className="flex items-center justify-between text-sm">
            <span>{current.icon} 徽章</span>
            <span>{level.totalXp} XP</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-[var(--card-solid)]">
            <div className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted">距离下一等级还差 {level.xpToNextLevel} XP</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Metric label="今日获得" value={`${level.todayXp} XP`} />
          <Metric label="本周获得" value={`${level.weekXp} XP`} />
        </div>
      </section>
      {levelUpMessage && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="card max-w-md p-6">
            <button className="ml-auto block rounded-lg p-2 text-muted hover:bg-[var(--soft)]" onClick={dismissLevelUp}><X size={18} /></button>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)]">
              <Award size={30} />
            </div>
            <h3 className="mt-4 text-center text-2xl font-semibold">升级了</h3>
            <p className="mt-2 text-center text-muted">{levelUpMessage}</p>
            <Button className="mt-5 w-full" variant="primary" onClick={dismissLevelUp}>继续学习</Button>
          </div>
        </div>
      )}
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
