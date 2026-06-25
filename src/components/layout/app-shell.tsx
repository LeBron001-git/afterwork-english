"use client";

import { addMonths, endOfMonth, format, getDay, isSameDay, startOfMonth, subMonths } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarCheck,
  ChevronLeft,
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
  X,
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
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("afterwork-english:open-word-search"))}
          className="focus-ring fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-2xl lg:hidden"
          aria-label="打开查词"
        >
          <Search size={20} />
        </button>
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
          type="button"
          onClick={() => window.dispatchEvent(new Event("afterwork-english:open-word-search"))}
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
          <HeaderCheckInCalendar />
        </div>
        <div className="flex items-center gap-2 xl:flex-col xl:gap-1.5">
          <HeaderStyleMenu />
          <Button className="h-10 w-10" variant="secondary" size="icon" onClick={toggleRightPanel} title="折叠学习状态栏">
            {preference.rightPanelOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
          </Button>
        </div>
      </div>
    </header>
  );
}

function HeaderStyleMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button className="h-10 w-10" variant="secondary" size="icon" onClick={() => setOpen((value) => !value)} title="样式设置">
        {open ? <X size={18} /> : <Settings size={18} />}
      </Button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(92vw,560px)] rounded-2xl border border-[var(--line)] bg-[var(--card-solid)] p-4 shadow-2xl xl:right-12 xl:top-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">样式设置</div>
              <div className="text-xs text-muted">主题、明暗、动效和字号</div>
            </div>
            <button type="button" className="rounded-lg p-2 text-muted hover:bg-[var(--soft)]" onClick={() => setOpen(false)} aria-label="关闭样式设置">
              <X size={16} />
            </button>
          </div>
          <ThemeSwitcher compact />
        </div>
      )}
    </div>
  );
}

function HeaderCheckInCalendar() {
  const [month, setMonth] = useState(new Date());
  const { checkIns, manualCheckIn } = useLearningStore();
  const stats = useStudyStats();
  const today = todayKey();
  const todayRecord = checkIns[today];

  const days = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const blanks = Array.from({ length: getDay(start) }, () => null);
    const real = Array.from({ length: end.getDate() }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1));
    return [...blanks, ...real];
  }, [month]);

  return (
    <section className="flex h-[146px] w-[660px] items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-3 shadow-sm">
      <div className="w-[260px] shrink-0">
        <div className="flex items-center justify-between gap-2">
          <button type="button" className="rounded-lg p-1.5 text-muted hover:bg-[var(--soft)]" onClick={() => setMonth(subMonths(month, 1))} aria-label="上个月">
            <ChevronLeft size={15} />
          </button>
          <div className="text-sm font-semibold">{format(month, "M月")}</div>
          <button type="button" className="rounded-lg p-1.5 text-muted hover:bg-[var(--soft)]" onClick={() => setMonth(addMonths(month, 1))} aria-label="下个月">
            <ChevronRight size={15} />
          </button>
        </div>
        <div className="mt-1.5 grid grid-cols-7 gap-1 text-center text-[9px] font-medium text-muted">
          {["日", "一", "二", "三", "四", "五", "六"].map((weekday) => (
            <span key={weekday} className="leading-none">
              {weekday}
            </span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.slice(0, 42).map((day, index) => {
            if (!day) return <span key={`blank-${index}`} className="h-5" />;
            const key = todayKey(day);
            const checked = checkIns[key]?.checkedIn;
            const isToday = isSameDay(day, new Date());
            return (
              <span
                key={key}
                title={`${key}${checked ? " 已打卡" : ""}`}
                className={`grid h-5 place-items-center rounded-md border text-[10px] font-semibold leading-none transition ${
                  checked
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--primary-foreground)]"
                    : isToday
                      ? "border-[var(--accent-3)] bg-[color-mix(in_srgb,var(--accent-3)_18%,transparent)] text-[var(--foreground)]"
                      : "border-[var(--line)] bg-[var(--card-solid)] text-muted"
                }`}
              >
                {format(day, "d")}
              </span>
            );
          })}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-muted">学习足迹</div>
            <div className="mt-1 text-sm font-semibold">{todayRecord?.checkedIn ? "今日已打卡" : "今日待打卡"}</div>
          </div>
          <CalendarCheck size={18} className="text-[var(--accent)]" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-xl bg-[var(--soft)] px-2 py-1.5">
            <div className="text-muted">连续</div>
            <strong>{stats.currentStreak}</strong>
          </div>
          <div className="rounded-xl bg-[var(--soft)] px-2 py-1.5">
            <div className="text-muted">本月</div>
            <strong>{Object.values(checkIns).filter((item) => item.checkedIn && item.date.startsWith(format(month, "yyyy-MM"))).length}</strong>
          </div>
          <button type="button" className="rounded-xl bg-[var(--primary)] px-2 py-1.5 text-[var(--primary-foreground)] disabled:opacity-60" disabled={todayRecord?.checkedIn} onClick={() => manualCheckIn(today)}>
            {todayRecord?.checkedIn ? "完成" : "打卡"}
          </button>
        </div>
      </div>
    </section>
  );
}

function RightLearningPanel() {
  const pathname = usePathname();
  const { preference, level, checkIns } = useLearningStore();
  const stats = useStudyStats();
  const today = checkIns[todayKey()];
  if (!preference.rightPanelOpen || pathname === "/dashboard") return null;
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
