"use client";

import { addMonths, differenceInCalendarDays, endOfMonth, format, getDay, isAfter, isSameDay, parseISO, startOfMonth, subMonths } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Flame, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLearningStore, useStudyStats } from "@/store/use-learning-store";
import { todayKey } from "@/lib/utils";

export function CheckInCalendarCard() {
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState(todayKey());
  const [detailOpen, setDetailOpen] = useState(false);
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
  const selectedDate = parseISO(selected);
  const daysFromToday = differenceInCalendarDays(new Date(), selectedDate);
  const isFutureDate = isAfter(selectedDate, new Date());
  const canManualCheckIn = !isFutureDate && daysFromToday <= 7;
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
              onClick={() => {
                setSelected(key);
                setDetailOpen(true);
              }}
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
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--card)] text-[var(--accent)]">
            {selectedRecord?.checkedIn ? <Flame size={19} /> : <CalendarDays size={19} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{selectedRecord?.checkedIn ? "这一天学过了" : "这一天还空着"}</p>
            <p className="mt-1 text-sm text-muted">{selectedRecord?.note ?? lastEncouragement}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="primary" disabled={!canManualCheckIn} onClick={() => manualCheckIn(selected)}>
            {selected === todayKey() ? "今日打卡" : "补卡"}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setDetailOpen(true)}>查看详情</Button>
          {selectedRecord?.checkedIn && <Button size="sm" variant="secondary" onClick={() => cancelCheckIn(selected)}>取消误打</Button>}
        </div>
        {!canManualCheckIn && <p className="mt-2 text-xs text-muted">{isFutureDate ? "未来日期还不能打卡。" : "初版只允许最近 7 天内补卡。"}</p>}
      </div>
      {detailOpen && (
        <CheckInDetailDialog
          date={selected}
          canManualCheckIn={canManualCheckIn}
          isFutureDate={isFutureDate}
          record={selectedRecord}
          onClose={() => setDetailOpen(false)}
          onCheckIn={() => manualCheckIn(selected)}
          onCancel={() => cancelCheckIn(selected)}
        />
      )}
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

function CheckInDetailDialog({
  date,
  record,
  canManualCheckIn,
  isFutureDate,
  onClose,
  onCheckIn,
  onCancel,
}: {
  date: string;
  record: ReturnType<typeof useLearningStore.getState>["checkIns"][string] | undefined;
  canManualCheckIn: boolean;
  isFutureDate: boolean;
  onClose: () => void;
  onCheckIn: () => void;
  onCancel: () => void;
}) {
  const checked = record?.checkedIn;
  const detailItems = [
    ["学习分钟", `${record?.minutes ?? 0}`],
    ["单词学习", `${record?.wordsLearned ?? 0}`],
    ["单词复习", `${record?.wordsReviewed ?? 0}`],
    ["语法完成", `${record?.grammarCompleted ?? 0}`],
    ["短句学习", `${record?.sentencesLearned ?? 0}`],
    ["音标学习", `${record?.phoneticsCompleted ?? 0}`],
    ["场景练习", `${record?.scenariosCompleted ?? 0}`],
    ["练习题", `${record?.exercisesCompleted ?? 0}`],
    ["获得 XP", `${record?.xpEarned ?? 0}`],
  ];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-lg p-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">学习足迹详情</p>
            <h3 className="mt-1 text-2xl font-semibold">{date}</h3>
          </div>
          <button type="button" className="rounded-xl p-2 text-muted hover:bg-[var(--soft)]" onClick={onClose} aria-label="关闭详情">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-[var(--soft)] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--card)] text-[var(--accent)]">
              {checked ? <Flame size={21} /> : <CalendarDays size={21} />}
            </div>
            <div>
              <div className="font-semibold">{checked ? "已打卡" : "未打卡"}</div>
              <div className="text-sm text-muted">
                {record?.note ?? (checked ? "这一天已经留下学习记录。" : isFutureDate ? "未来日期还不能打卡。" : "可以补最近 7 天内的学习足迹。")}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          {detailItems.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-3 text-center">
              <div className="text-xs text-muted">{label}</div>
              <div className="mt-1 font-semibold">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="primary" disabled={!canManualCheckIn} onClick={onCheckIn}>
            {date === todayKey() ? "今日打卡" : "补卡"}
          </Button>
          {checked && <Button variant="secondary" onClick={onCancel}>取消误打卡</Button>}
          <Button variant="ghost" onClick={onClose}>关闭</Button>
        </div>
        {!canManualCheckIn && <p className="mt-3 text-sm text-muted">{isFutureDate ? "未来日期还不能提前打卡。" : "初版只允许最近 7 天内补卡，更早的记录暂时只展示不修改。"}</p>}
      </div>
    </div>
  );
}
