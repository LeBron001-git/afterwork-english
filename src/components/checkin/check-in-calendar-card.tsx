"use client";

import { addMonths, endOfMonth, format, getDay, isSameDay, startOfMonth, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLearningStore, useStudyStats } from "@/store/use-learning-store";
import { todayKey } from "@/lib/utils";

export function CheckInCalendarCard() {
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState(todayKey());
  const { checkIns, manualCheckIn, cancelCheckIn, lastEncouragement } = useLearningStore();
  const stats = useStudyStats();

  const days = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const blanks = Array.from({ length: getDay(start) }, () => null);
    const real = Array.from({ length: end.getDate() }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1));
    return [...blanks, ...real];
  }, [month]);

  const selectedRecord = checkIns[selected];
  const monthDays = Object.values(checkIns).filter((item) => item.checkedIn && item.date.startsWith(format(month, "yyyy-MM"))).length;
  const weekRate = Math.min(100, Math.round((stats.currentStreak / 7) * 100));

  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">学习足迹</p>
          <h2 className="mt-1 text-xl font-semibold">{format(month, "yyyy年 M月")}</h2>
        </div>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={() => setMonth(subMonths(month, 1))}><ChevronLeft size={17} /></Button>
          <Button size="icon" variant="ghost" onClick={() => setMonth(new Date())}><RotateCcw size={16} /></Button>
          <Button size="icon" variant="ghost" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight size={17} /></Button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-xs text-muted">
        {["日", "一", "二", "三", "四", "五", "六"].map((day) => <span key={day}>{day}</span>)}
        {days.map((day, index) => {
          if (!day) return <span key={`blank-${index}`} />;
          const key = todayKey(day);
          const record = checkIns[key];
          const checked = record?.checkedIn;
          const today = isSameDay(day, new Date());
          return (
            <button
              key={key}
              onClick={() => setSelected(key)}
              title={checked ? `学习 ${record.minutes} 分钟，获得 ${record.xpEarned} XP` : "暂无记录"}
              className={`relative aspect-square min-h-9 rounded-lg border text-sm transition hover:-translate-y-0.5 ${
                checked ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_22%,transparent)] text-[var(--foreground)]" : "border-[var(--line)] bg-[var(--card)]"
              } ${today ? "ring-2 ring-[var(--accent-3)]" : ""} ${selected === key ? "scale-105" : ""}`}
            >
              {format(day, "d")}
              {checked && <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--accent)] soft-pulse" />}
            </button>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <Metric label="连续" value={`${stats.currentStreak}天`} />
        <Metric label="本月" value={`${monthDays}天`} />
        <Metric label="本周" value={`${weekRate}%`} />
      </div>
      <div className="mt-4 rounded-xl bg-[var(--soft)] p-4">
        <p className="text-sm font-medium">{selectedRecord?.checkedIn ? "这一天学过了" : "这一天还空着"}</p>
        <p className="mt-1 text-sm text-muted">{selectedRecord?.note ?? lastEncouragement}</p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="primary" onClick={() => manualCheckIn(selected)}>今日打卡</Button>
          {selectedRecord?.checkedIn && <Button size="sm" variant="secondary" onClick={() => cancelCheckIn(selected)}>取消误打</Button>}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-3 text-center">
      <div className="text-xs text-muted">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
