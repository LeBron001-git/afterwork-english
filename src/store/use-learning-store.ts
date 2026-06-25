"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDays, isBefore, parseISO } from "date-fns";
import { encouragements, xpRules, calculateLevel, streakStats, todayKey } from "@/lib/utils";
import type { CheckInRecord, LearnerProfile, ThemeId, UserLevel, UserPreference, WordReviewState, WrongQuestionState } from "@/types/learning";

type CompletionType = "word" | "grammar" | "sentence" | "phonetic" | "scenario" | "exercise" | "review";

type LearningState = {
  activeProfileId: string;
  profiles: Record<string, LearnerProfile>;
  preference: UserPreference;
  checkIns: Record<string, CheckInRecord>;
  favoriteWords: string[];
  wordReviews: Record<string, WordReviewState>;
  wrongQuestions: Record<string, WrongQuestionState>;
  completedTasks: Record<string, string[]>;
  level: UserLevel;
  lastEncouragement: string;
  levelUpMessage?: string;
  switchProfile: (profileId: string) => void;
  renameProfile: (profileId: string, name: string) => void;
  setTheme: (theme: ThemeId) => void;
  setColorMode: (mode: UserPreference["colorMode"]) => void;
  toggleReduceMotion: () => void;
  toggleLargeFont: () => void;
  toggleRightPanel: () => void;
  toggleFavoriteWord: (wordId: string) => void;
  completeTask: (type: CompletionType, id: string) => void;
  answerExercise: (questionId: string, isCorrect: boolean) => void;
  reviewWord: (wordId: string, rating: WordReviewState["lastRating"]) => void;
  isWordDue: (wordId: string, fallbackDue?: string) => boolean;
  manualCheckIn: (date?: string) => void;
  cancelCheckIn: (date: string) => void;
  dismissLevelUp: () => void;
};

const emptyLevel = calculateLevel(0);

function blankRecord(date: string): CheckInRecord {
  return {
    date,
    checkedIn: false,
    minutes: 0,
    wordsLearned: 0,
    wordsReviewed: 0,
    grammarCompleted: 0,
    sentencesLearned: 0,
    phoneticsCompleted: 0,
    scenariosCompleted: 0,
    exercisesCompleted: 0,
    xpEarned: 0,
    mood: "normal",
  };
}

function createProfile(id: string, name: string, role: LearnerProfile["role"]): LearnerProfile {
  return {
    id,
    name,
    role,
    createdAt: todayKey(),
    checkIns: {},
    favoriteWords: [],
    wordReviews: {},
    wrongQuestions: {},
    completedTasks: {},
    level: emptyLevel,
  };
}

function defaultProfiles() {
  return {
    owner: createProfile("owner", "我", "owner"),
    "friend-a": createProfile("friend-a", "朋友 A", "friend"),
    "friend-b": createProfile("friend-b", "朋友 B", "friend"),
  };
}

function snapshotProfile(state: LearningState, profileId = state.activeProfileId): LearnerProfile {
  const existing = state.profiles[profileId] ?? createProfile(profileId, profileId, "friend");
  return {
    ...existing,
    checkIns: state.checkIns,
    favoriteWords: state.favoriteWords,
    wordReviews: state.wordReviews,
    wrongQuestions: state.wrongQuestions,
    completedTasks: state.completedTasks,
    level: state.level,
  };
}

function recomputeLevel(checkIns: Record<string, CheckInRecord>, previousLevel?: number): { level: UserLevel; levelUpMessage?: string } {
  const today = todayKey();
  const totalXp = Object.values(checkIns).reduce((sum, item) => sum + item.xpEarned, 0);
  const todayXp = checkIns[today]?.xpEarned ?? 0;
  const weekXp = Object.values(checkIns).reduce((sum, item) => {
    const diff = Math.floor((Date.now() - new Date(item.date).getTime()) / 86400000);
    return diff >= 0 && diff <= 6 ? sum + item.xpEarned : sum;
  }, 0);
  const level = calculateLevel(totalXp, todayXp, weekXp);
  const levelUpMessage = previousLevel && level.currentLevel > previousLevel ? `你已升级为「${level.currentTitle}」。英语没有突然变简单，但你已经不再停在原地。` : undefined;
  return { level, levelUpMessage };
}

function addXpToRecord(record: CheckInRecord, type: CompletionType, xp: number) {
  const next = { ...record, checkedIn: true, minutes: Math.max(record.minutes + 5, 5), xpEarned: record.xpEarned + xp };
  if (type === "word") next.wordsLearned += 1;
  if (type === "review") next.wordsReviewed += 1;
  if (type === "grammar") next.grammarCompleted += 1;
  if (type === "sentence") next.sentencesLearned += 1;
  if (type === "phonetic") next.phoneticsCompleted += 1;
  if (type === "scenario") next.scenariosCompleted += 1;
  if (type === "exercise") next.exercisesCompleted += 1;
  return next;
}

function defaultWordReview(wordId: string): WordReviewState {
  return {
    wordId,
    dueDate: todayKey(),
    intervalDays: 0,
    ease: 2.3,
    reviewedCount: 0,
    correctStreak: 0,
    wrongCount: 0,
  };
}

function nextReviewState(current: WordReviewState, rating: WordReviewState["lastRating"]): WordReviewState {
  const interval = current.intervalDays || 1;
  const easeChange = rating === "again" ? -0.2 : rating === "hard" ? -0.08 : rating === "easy" ? 0.16 : 0.02;
  const ease = Math.max(1.3, Math.min(3.1, current.ease + easeChange));
  const intervalDays =
    rating === "again"
      ? 1
      : rating === "hard"
        ? Math.max(1, Math.ceil(interval * 1.25))
        : rating === "good"
          ? Math.max(2, Math.ceil(interval * ease))
          : Math.max(3, Math.ceil(interval * (ease + 0.65)));

  return {
    ...current,
    ease,
    intervalDays,
    dueDate: todayKey(addDays(new Date(), intervalDays)),
    reviewedCount: current.reviewedCount + 1,
    correctStreak: rating === "again" ? 0 : current.correctStreak + 1,
    wrongCount: rating === "again" ? current.wrongCount + 1 : current.wrongCount,
    lastReviewedAt: todayKey(),
    lastRating: rating,
  };
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      activeProfileId: "owner",
      profiles: defaultProfiles(),
      preference: {
        theme: "minimal-pro",
        colorMode: "system",
        reduceMotion: false,
        largeFont: false,
        rightPanelOpen: true,
      },
      checkIns: {},
      favoriteWords: [],
      wordReviews: {},
      wrongQuestions: {},
      completedTasks: {},
      level: emptyLevel,
      lastEncouragement: encouragements[0],
      switchProfile: (profileId) => {
        const state = get();
        const profiles = {
          ...state.profiles,
          [state.activeProfileId]: snapshotProfile(state),
        };
        const target = profiles[profileId] ?? createProfile(profileId, profileId, "friend");
        set({
          activeProfileId: target.id,
          profiles: { ...profiles, [target.id]: target },
          checkIns: target.checkIns ?? {},
          favoriteWords: target.favoriteWords ?? [],
          wordReviews: target.wordReviews ?? {},
          wrongQuestions: target.wrongQuestions ?? {},
          completedTasks: target.completedTasks ?? {},
          level: target.level ?? emptyLevel,
          levelUpMessage: undefined,
        });
      },
      renameProfile: (profileId, name) =>
        set((state) => {
          const cleaned = name.trim().slice(0, 12);
          if (!cleaned) return {};
          const profiles = { ...state.profiles, [state.activeProfileId]: snapshotProfile(state) };
          const profile = profiles[profileId] ?? createProfile(profileId, cleaned, "friend");
          return {
            profiles: { ...profiles, [profileId]: { ...profile, name: cleaned } },
          };
        }),
      setTheme: (theme) => set((state) => ({ preference: { ...state.preference, theme } })),
      setColorMode: (colorMode) => set((state) => ({ preference: { ...state.preference, colorMode } })),
      toggleReduceMotion: () => set((state) => ({ preference: { ...state.preference, reduceMotion: !state.preference.reduceMotion } })),
      toggleLargeFont: () => set((state) => ({ preference: { ...state.preference, largeFont: !state.preference.largeFont } })),
      toggleRightPanel: () => set((state) => ({ preference: { ...state.preference, rightPanelOpen: !state.preference.rightPanelOpen } })),
      toggleFavoriteWord: (wordId) =>
        set((state) => {
          const nextFavorites = state.favoriteWords.includes(wordId)
            ? state.favoriteWords.filter((id) => id !== wordId)
            : [...state.favoriteWords, wordId];
          return {
            favoriteWords: nextFavorites,
            wordReviews: state.wordReviews[wordId] ? state.wordReviews : { ...state.wordReviews, [wordId]: defaultWordReview(wordId) },
            profiles: { ...state.profiles, [state.activeProfileId]: { ...snapshotProfile({ ...state, favoriteWords: nextFavorites } as LearningState), favoriteWords: nextFavorites } },
          };
        }),
      completeTask: (type, id) => {
        const state = get();
        const date = todayKey();
        const taskKey = `${date}:${type}`;
        if (state.completedTasks[taskKey]?.includes(id)) return;
        const existing = state.checkIns[date] ?? blankRecord(date);
        const wasUnchecked = !existing.checkedIn;
        const xp =
          (wasUnchecked ? xpRules.firstCheckIn : 0) +
          (type === "word" ? xpRules.word : 0) +
          (type === "review" ? xpRules.reviewWord : 0) +
          (type === "grammar" ? xpRules.grammar : 0) +
          (type === "sentence" ? xpRules.sentence : 0) +
          (type === "phonetic" ? xpRules.phonetic : 0) +
          (type === "scenario" ? xpRules.scenario : 0) +
          (type === "exercise" ? xpRules.exercise : 0);
        const checkIns = { ...state.checkIns, [date]: addXpToRecord(existing, type, xp) };
        const levelResult = recomputeLevel(checkIns, state.level.currentLevel);
        set({
          checkIns,
          completedTasks: { ...state.completedTasks, [taskKey]: [...(state.completedTasks[taskKey] ?? []), id] },
          level: levelResult.level,
          levelUpMessage: levelResult.levelUpMessage,
          lastEncouragement: encouragements[Math.floor(Math.random() * encouragements.length)],
          profiles: {
            ...state.profiles,
            [state.activeProfileId]: {
              ...snapshotProfile(state),
              checkIns,
              completedTasks: { ...state.completedTasks, [taskKey]: [...(state.completedTasks[taskKey] ?? []), id] },
              level: levelResult.level,
            },
          },
        });
      },
      answerExercise: (questionId, isCorrect) => {
        const state = get();
        const now = todayKey();
        const wrongQuestions = { ...state.wrongQuestions };
        if (isCorrect) {
          const existing = wrongQuestions[questionId];
          if (existing) wrongQuestions[questionId] = { ...existing, resolved: true, resolvedAt: now };
        } else {
          const existing = wrongQuestions[questionId];
          wrongQuestions[questionId] = {
            questionId,
            wrongCount: (existing?.wrongCount ?? 0) + 1,
            lastWrongAt: now,
            resolved: false,
          };
        }
        set({ wrongQuestions, profiles: { ...state.profiles, [state.activeProfileId]: { ...snapshotProfile(state), wrongQuestions } } });
        get().completeTask("exercise", questionId);
      },
      reviewWord: (wordId, rating) => {
        const state = get();
        const current = state.wordReviews[wordId] ?? defaultWordReview(wordId);
        const wordReviews = { ...state.wordReviews, [wordId]: nextReviewState(current, rating) };
        set({ wordReviews, profiles: { ...state.profiles, [state.activeProfileId]: { ...snapshotProfile(state), wordReviews } } });
        get().completeTask("review", wordId);
      },
      isWordDue: (wordId, fallbackDue = todayKey()) => {
        const review = get().wordReviews[wordId] ?? { ...defaultWordReview(wordId), dueDate: fallbackDue };
        const due = parseISO(review.dueDate);
        return isBefore(due, addDays(new Date(), 1));
      },
      manualCheckIn: (date = todayKey()) => {
        const state = get();
        const existing = state.checkIns[date] ?? blankRecord(date);
        const xp = existing.checkedIn ? 0 : xpRules.firstCheckIn;
        const checkIns = {
          ...state.checkIns,
          [date]: { ...existing, checkedIn: true, minutes: Math.max(existing.minutes, 3), xpEarned: existing.xpEarned + xp, note: "今天已经迈出一步了，继续学一点会更好。" },
        };
        const levelResult = recomputeLevel(checkIns, state.level.currentLevel);
        set({
          checkIns,
          level: levelResult.level,
          levelUpMessage: levelResult.levelUpMessage,
          lastEncouragement: encouragements[Math.floor(Math.random() * encouragements.length)],
          profiles: { ...state.profiles, [state.activeProfileId]: { ...snapshotProfile(state), checkIns, level: levelResult.level } },
        });
      },
      cancelCheckIn: (date) => {
        const state = get();
        const existing = state.checkIns[date] ?? blankRecord(date);
        const checkIns = { ...state.checkIns, [date]: { ...existing, checkedIn: false, xpEarned: Math.max(0, existing.xpEarned - xpRules.firstCheckIn) } };
        const levelResult = recomputeLevel(checkIns, state.level.currentLevel);
        set({ checkIns, level: levelResult.level, profiles: { ...state.profiles, [state.activeProfileId]: { ...snapshotProfile(state), checkIns, level: levelResult.level } } });
      },
      dismissLevelUp: () => set({ levelUpMessage: undefined }),
    }),
    {
      name: "afterwork-english:learning-store",
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.profiles = { ...defaultProfiles(), ...(state.profiles ?? {}) };
        state.activeProfileId = state.activeProfileId ?? "owner";
        state.wordReviews = state.wordReviews ?? {};
        state.wrongQuestions = state.wrongQuestions ?? {};
        const next = recomputeLevel(state.checkIns);
        state.level = next.level;
        state.profiles[state.activeProfileId] = snapshotProfile(state);
      },
    },
  ),
);

export function useStudyStats() {
  const checkIns = useLearningStore((state) => state.checkIns);
  const streak = streakStats(checkIns);
  const totals = Object.values(checkIns).reduce(
    (sum, item) => ({
      totalMinutes: sum.totalMinutes + item.minutes,
      totalWordsLearned: sum.totalWordsLearned + item.wordsLearned,
      totalGrammarCompleted: sum.totalGrammarCompleted + item.grammarCompleted,
      totalScenariosCompleted: sum.totalScenariosCompleted + item.scenariosCompleted,
      totalExercisesCompleted: sum.totalExercisesCompleted + item.exercisesCompleted,
    }),
    { totalMinutes: 0, totalWordsLearned: 0, totalGrammarCompleted: 0, totalScenariosCompleted: 0, totalExercisesCompleted: 0 },
  );
  return { ...streak, ...totals };
}
