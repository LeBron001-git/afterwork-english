"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarCheck,
  ChevronRight,
  Compass,
  GraduationCap,
  Home,
  Menu,
  MessageSquareText,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Settings,
  Sparkles,
  SpellCheck,
  Target,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandWordSearch } from "@/components/word/command-word-search";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { ProfileSwitcher } from "@/components/profile/profile-switcher";
import { useLearningStore, useStudyStats } from "@/store/use-learning-store";
import { todayKey } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "首页", icon: Home },
  { href: "/word", label: "单词", icon: BookOpen },
  { href: "/phonetic", label: "音标", icon: Volume2 },
  { href: "/grammar", label: "语法", icon: SpellCheck },
  { href: "/sentences", label: "短句", icon: MessageSquareText },
  { href: "/practice", label: "练习", icon: Brain },
  { href: "/scenarios", label: "场景", icon: Compass },
  { href: "/review", label: "复习", icon: CalendarCheck },
  { href: "/progress", label: "进度", icon: BarChart3 },
  { href: "/settings", label: "设置", icon: Settings },
  { href: "/style-lab", label: "风格", icon: Sparkles },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="app-bg min-h-screen">
        <div className="mx-auto flex min-h-screen w-full max-w-[1680px]">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopNav />
            <main className="min-w-0 flex-1 px-4 pb-24 pt-4 md:px-6 lg:pb-8">{children}</main>
          </div>
          <RightLearningPanel />
        </div>
        <MobileTabBar />
        <CommandWordSearch />
      </div>
    </ThemeProvider>
  );
}

function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-[var(--line)] p-4 lg:block">
      <Link href="/dashboard" className="mb-6 flex items-center gap-3 rounded-2xl px-2 py-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)]">
          <GraduationCap size={22} />
        </div>
        <div>
          <div className="font-semibold">Afterwork English</div>
          <div className="text-xs text-muted">下班后的英语复利</div>
        </div>
      </Link>
      <nav className="grid gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-muted hover:bg-[var(--soft)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function TopNav() {
  const { preference, toggleRightPanel } = useLearningStore();
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--background)_82%,transparent)] px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <Button className="lg:hidden" size="icon" variant="secondary">
          <Menu size={18} />
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <GraduationCap size={22} />
          <span className="font-semibold">Afterwork</span>
        </Link>
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="focus-ring ml-auto hidden h-11 min-w-72 items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 text-left text-sm text-muted md:flex lg:ml-0"
        >
          <Search size={17} />
          <span className="flex-1">查词、短语、例句</span>
          <kbd className="rounded-md border border-[var(--line)] px-1.5 py-0.5 text-xs">⌘K</kbd>
        </button>
        <div className="hidden md:block">
          <ProfileSwitcher compact />
        </div>
        <div className="ml-auto hidden xl:block">
          <ThemeSwitcher compact />
        </div>
        <Button variant="secondary" size="icon" onClick={toggleRightPanel} title="折叠学习状态栏">
          {preference.rightPanelOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </Button>
      </div>
    </header>
  );
}

function RightLearningPanel() {
  const { preference, level, checkIns } = useLearningStore();
  const stats = useStudyStats();
  const today = checkIns[todayKey()];
  if (!preference.rightPanelOpen) return null;
  return (
    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 border-l border-[var(--line)] p-4 xl:block">
      <div className="grid gap-4">
        <section className="card p-4">
          <p className="text-sm text-muted">今日状态</p>
          <h2 className="mt-1 text-2xl font-semibold">{today?.checkedIn ? "已打卡" : "待开始"}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-[var(--soft)] p-3">
              <div className="text-muted">今日 XP</div>
              <strong>{level.todayXp}</strong>
            </div>
            <div className="rounded-xl bg-[var(--soft)] p-3">
              <div className="text-muted">连续</div>
              <strong>{stats.currentStreak} 天</strong>
            </div>
          </div>
        </section>
        <section className="card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">成长等级</p>
            <Target size={18} className="text-[var(--accent)]" />
          </div>
          <h3 className="mt-2 text-xl font-semibold">Lv.{level.currentLevel} {level.currentTitle}</h3>
          <div className="mt-3 h-2 rounded-full bg-[var(--soft)]">
            <div className="h-2 rounded-full bg-[var(--accent)]" style={{ width: `${Math.min(100, ((level.totalXp - level.currentLevelMinXp) / Math.max(1, level.nextLevelXp - level.currentLevelMinXp)) * 100)}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted">距离下一等级 {level.xpToNextLevel} XP</p>
        </section>
      </div>
    </aside>
  );
}

function MobileTabBar() {
  const pathname = usePathname();
  const mobile = navItems.slice(0, 5);
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--card-solid)_88%,transparent)] p-2 shadow-2xl backdrop-blur-xl lg:hidden">
      {mobile.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className={`grid place-items-center gap-1 rounded-xl py-2 text-[11px] ${active ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-muted"}`}>
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
