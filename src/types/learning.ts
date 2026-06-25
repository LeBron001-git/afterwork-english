export type ThemeId =
  | "minimal-pro"
  | "dark-focus"
  | "bento-glass"
  | "cyber-energy"
  | "warm-study";

export type ColorMode = "light" | "dark" | "system";

export type CheckInRecord = {
  date: string;
  checkedIn: boolean;
  minutes: number;
  wordsLearned: number;
  wordsReviewed: number;
  grammarCompleted: number;
  sentencesLearned: number;
  phoneticsCompleted: number;
  scenariosCompleted: number;
  exercisesCompleted: number;
  xpEarned: number;
  mood?: "good" | "normal" | "tired" | "stressed";
  note?: string;
};

export type UserLevel = {
  totalXp: number;
  currentLevel: number;
  currentTitle: string;
  currentLevelMinXp: number;
  nextLevelXp: number;
  xpToNextLevel: number;
  todayXp: number;
  weekXp: number;
  lastLevelUpAt?: string;
};

export type StudyStats = {
  totalStudyDays: number;
  currentStreak: number;
  longestStreak: number;
  totalMinutes: number;
  totalWordsLearned: number;
  totalGrammarCompleted: number;
  totalScenariosCompleted: number;
  totalExercisesCompleted: number;
};

export type WordItem = {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  exampleCn: string;
  category: "basic" | "workplace" | "testing" | "finance" | "commerce";
};

export type GrammarPoint = {
  id: string;
  title: string;
  rule: string;
  example: string;
  translation: string;
};

export type PhoneticItem = {
  id: string;
  symbol: string;
  tip: string;
  words: string[];
};

export type SentenceItem = {
  id: string;
  en: string;
  cn: string;
  scene: string;
};

export type ExerciseQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type ScenarioItem = {
  id: string;
  title: string;
  context: string;
  lines: { en: string; cn: string }[];
};

export type UserPreference = {
  theme: ThemeId;
  colorMode: ColorMode;
  reduceMotion: boolean;
  largeFont: boolean;
  rightPanelOpen: boolean;
};

export type WordReviewState = {
  wordId: string;
  dueDate: string;
  intervalDays: number;
  ease: number;
  reviewedCount: number;
  correctStreak: number;
  wrongCount: number;
  lastReviewedAt?: string;
  lastRating?: "again" | "hard" | "good" | "easy";
};

export type WrongQuestionState = {
  questionId: string;
  wrongCount: number;
  lastWrongAt: string;
  resolved: boolean;
  resolvedAt?: string;
};

export type LearnerProfile = {
  id: string;
  name: string;
  role: "owner" | "friend";
  createdAt: string;
  checkIns: Record<string, CheckInRecord>;
  favoriteWords: string[];
  wordReviews: Record<string, WordReviewState>;
  wrongQuestions: Record<string, WrongQuestionState>;
  completedTasks: Record<string, string[]>;
  level: UserLevel;
};
