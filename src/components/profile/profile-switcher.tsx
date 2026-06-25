"use client";

import { UserRound, UsersRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLearningStore } from "@/store/use-learning-store";

export function ProfileSwitcher({ compact = false }: { compact?: boolean }) {
  const { profiles, activeProfileId, switchProfile, renameProfile, level } = useLearningStore();
  const [editing, setEditing] = useState<string | null>(null);
  const ordered = ["owner", "friend-a", "friend-b"].map((id) => profiles[id]).filter(Boolean);
  const active = profiles[activeProfileId];

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm">
        <UserRound size={16} className="text-[var(--accent)]" />
        <span className="max-w-20 truncate">{active?.name ?? "我"}</span>
        <span className="text-xs text-muted">Lv.{level.currentLevel}</span>
      </div>
    );
  }

  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">朋友使用</p>
          <h2 className="mt-2 text-2xl font-semibold">三套独立学习档案</h2>
          <p className="mt-2 max-w-2xl text-muted">
            适合同一台设备上给两位朋友体验。每个人的打卡、XP、收藏词、错题和复习计划都互不影响。
          </p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)]">
          <UsersRound size={24} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {ordered.map((profile) => {
          const isActive = profile.id === activeProfileId;
          return (
            <div
              key={profile.id}
              className={cn(
                "rounded-2xl border p-4 transition",
                isActive ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]" : "border-[var(--line)] bg-[var(--card)]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--soft)] text-[var(--accent)]">
                  <UserRound size={20} />
                </div>
                <span className="rounded-full bg-[var(--soft)] px-2 py-1 text-xs text-muted">{profile.role === "owner" ? "主档案" : "朋友"}</span>
              </div>
              {editing === profile.id ? (
                <input
                  autoFocus
                  defaultValue={profile.name}
                  onBlur={(event) => {
                    renameProfile(profile.id, event.target.value);
                    setEditing(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      renameProfile(profile.id, event.currentTarget.value);
                      setEditing(null);
                    }
                  }}
                  className="mt-4 h-10 w-full rounded-xl border border-[var(--line)] bg-[var(--card-solid)] px-3 text-sm outline-none"
                />
              ) : (
                <button className="mt-4 text-left text-xl font-semibold" onClick={() => setEditing(profile.id)}>
                  {profile.name}
                </button>
              )}
              <div className="mt-2 text-sm text-muted">Lv.{profile.level?.currentLevel ?? 1} · {profile.level?.totalXp ?? 0} XP</div>
              <Button className="mt-4 w-full" variant={isActive ? "primary" : "secondary"} onClick={() => switchProfile(profile.id)}>
                {isActive ? "正在使用" : "切换到此档案"}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl bg-[var(--soft)] p-4 text-sm text-muted">
        说明：这个功能让朋友在同一网址、同一浏览器里分别学习。如果要让朋友在自己的手机或电脑上远程使用，需要把网站部署到线上；当前数据仍会保存在各自浏览器本地。
      </div>
    </section>
  );
}
