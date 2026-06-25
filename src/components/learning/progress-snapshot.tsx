"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useStudyStats } from "@/store/use-learning-store";

export function ProgressSnapshot() {
  const stats = useStudyStats();
  const data = Array.from({ length: 7 }, (_, index) => ({ day: `D${index + 1}`, xp: Math.max(6, stats.currentStreak * 4 + index * 5) }));
  return (
    <section className="card p-5 md:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div>
          <p className="text-sm text-muted">学习进度</p>
          <h2 className="mt-1 text-xl font-semibold">稳一点，比猛一点更适合重启英语。</h2>
          <p className="mt-2 text-sm leading-6 text-muted">这里展示的是近 7 天的学习势能，后续接入云端后可以升级成真实趋势分析。</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm lg:grid-cols-1">
          <Metric label="累计天数" value={`${stats.totalStudyDays}`} />
          <Metric label="累计分钟" value={`${stats.totalMinutes}`} />
          <Metric label="最长连续" value={`${stats.longestStreak}`} />
        </div>
      </div>
      <div className="mt-5 h-40 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.36} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "var(--card-solid)", border: "1px solid var(--line)", borderRadius: 12 }} />
            <Area type="monotone" dataKey="xp" stroke="var(--accent)" fill="url(#xpFill)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--soft)] px-3 py-2 text-center lg:text-left">
      <div className="text-xs text-muted">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}
