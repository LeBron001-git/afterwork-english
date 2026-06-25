import { clsx, type ClassValue } from "clsx";
import { differenceInCalendarDays, format, parseISO, startOfDay } from "date-fns";
import { twMerge } from "tailwind-merge";
import type { CheckInRecord } from "@/types/learning";

export const STORAGE_KEYS = {
  USER_PREFERENCE: "afterwork-english:user-preference",
  CHECK_IN_RECORDS: "afterwork-english:check-in-records",
  USER_LEVEL: "afterwork-english:user-level",
  STUDY_STATS: "afterwork-english:study-stats",
  USER_WORDS: "afterwork-english:user-words",
  WRONG_QUESTIONS: "afterwork-english:wrong-questions",
  THEME: "afterwork-english:theme",
} as const;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function todayKey(date = new Date()) {
  return format(date, "yyyy-MM-dd");
}

export const encouragements = [
  "今天已经比昨天多走一步。",
  "不用学很多，坚持出现就很厉害。",
  "你正在重新建立英语能力。",
  "今天的英语账户，已经存入一点本金。",
  "继续保持，慢慢会看到复利。",
];

export const xpRules = {
  firstCheckIn: 10,
  word: 2,
  reviewWord: 1,
  grammar: 8,
  sentence: 3,
  phonetic: 5,
  scenario: 12,
  exercise: 2,
  wrongReview: 3,
} as const;

export const levels = [
  { level: 1, title: "筑基者", min: 0, max: 99, icon: "基石" },
  { level: 2, title: "入门者", min: 100, max: 249, icon: "门扉" },
  { level: 3, title: "破冰者", min: 250, max: 499, icon: "冰裂" },
  { level: 4, title: "积累者", min: 500, max: 899, icon: "书页" },
  { level: 5, title: "进阶者", min: 900, max: 1499, icon: "阶梯" },
  { level: 6, title: "表达者", min: 1500, max: 2399, icon: "对话" },
  { level: 7, title: "实战者", min: 2400, max: 3599, icon: "指南" },
  { level: 8, title: "稳定者", min: 3600, max: 5199, icon: "山峰" },
  { level: 9, title: "探索者", min: 5200, max: 7499, icon: "星图" },
  { level: 10, title: "精进者", min: 7500, max: 9999, icon: "光束" },
  { level: 11, title: "自驱者", min: 10000, max: 14999, icon: "引擎" },
  { level: 12, title: "跨越者", min: 15000, max: Number.POSITIVE_INFINITY, icon: "桥梁" },
];

export function calculateLevel(totalXp: number, todayXp = 0, weekXp = 0) {
  const current = levels.find((item) => totalXp >= item.min && totalXp <= item.max) ?? levels[0];
  const next = levels.find((item) => item.level === current.level + 1);
  const nextLevelXp = next?.min ?? current.min;
  return {
    totalXp,
    currentLevel: current.level,
    currentTitle: current.title,
    currentLevelMinXp: current.min,
    nextLevelXp,
    xpToNextLevel: next ? Math.max(next.min - totalXp, 0) : 0,
    todayXp,
    weekXp,
  };
}

export function streakStats(records: Record<string, CheckInRecord>) {
  const dates = Object.values(records)
    .filter((record) => record.checkedIn)
    .map((record) => record.date)
    .sort();

  let longest = 0;
  let run = 0;
  let previous: string | undefined;
  for (const date of dates) {
    if (!previous || differenceInCalendarDays(parseISO(date), parseISO(previous)) === 1) run += 1;
    else run = 1;
    longest = Math.max(longest, run);
    previous = date;
  }

  let current = 0;
  let cursor = startOfDay(new Date());
  while (records[todayKey(cursor)]?.checkedIn) {
    current += 1;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
  }

  return { currentStreak: current, longestStreak: longest, totalStudyDays: dates.length };
}
