import type { StudySlot } from "@/types/learning";

export type DailyPlanItem = {
  key: "word" | "grammar" | "sentence" | "scenario" | "review" | "practice";
  label: string;
  target: string;
  minutes: number;
  reason: string;
};

export const studySlots: { id: StudySlot; label: string; hint: string }[] = [
  { id: "morning", label: "早晨", hint: "先输入，少负担" },
  { id: "lunch", label: "午休", hint: "短任务，快完成" },
  { id: "commute", label: "通勤", hint: "听读优先" },
  { id: "night", label: "晚上", hint: "复盘和练习" },
];

export const minuteOptions = [10, 20, 30, 45];

export function buildDailyPlan(minutes: number, dueReviewCount: number, slot: StudySlot): DailyPlanItem[] {
  const reviewTarget = Math.max(dueReviewCount, slot === "night" ? 5 : 3);
  if (minutes <= 10) {
    return [
      { key: "word", label: "基础单词", target: "3 个", minutes: 4, reason: "先找回熟悉感" },
      { key: "sentence", label: "经典短句", target: "1 句", minutes: 3, reason: "马上能开口" },
      { key: "review", label: "记忆复习", target: `${Math.min(reviewTarget, 3)} 个`, minutes: 3, reason: "今天不欠账" },
    ];
  }
  if (minutes <= 20) {
    return [
      { key: "word", label: "基础单词", target: "5 个", minutes: 7, reason: "稳定输入" },
      { key: "grammar", label: "语法点", target: "1 个", minutes: 5, reason: "理解句子结构" },
      { key: "sentence", label: "经典短句", target: "1 句", minutes: 3, reason: "形成表达颗粒" },
      { key: "review", label: "记忆复习", target: `${Math.min(reviewTarget, 5)} 个`, minutes: 5, reason: "巩固收藏词" },
    ];
  }
  if (minutes <= 30) {
    return [
      { key: "word", label: "基础单词", target: "8 个", minutes: 10, reason: "扩展今天词库" },
      { key: "grammar", label: "语法点", target: "1 个", minutes: 6, reason: "减少读句卡顿" },
      { key: "sentence", label: "经典短句", target: "2 句", minutes: 5, reason: "补充真实表达" },
      { key: "scenario", label: "场景练习", target: "1 个", minutes: 5, reason: "贴近工作生活" },
      { key: "review", label: "记忆复习", target: `${Math.min(reviewTarget, 8)} 个`, minutes: 4, reason: "维持记忆曲线" },
    ];
  }
  return [
    { key: "word", label: "基础单词", target: "12 个", minutes: 14, reason: "做一轮扎实输入" },
    { key: "grammar", label: "语法点", target: "2 个", minutes: 10, reason: "补结构短板" },
    { key: "sentence", label: "经典短句", target: "3 句", minutes: 7, reason: "提升表达密度" },
    { key: "scenario", label: "场景练习", target: "1 个", minutes: 8, reason: "进入真实语境" },
    { key: "practice", label: "练习题", target: "5 道", minutes: 6, reason: "确认理解程度" },
  ];
}

export function planTargetFor(plan: DailyPlanItem[], key: DailyPlanItem["key"]) {
  return plan.find((item) => item.key === key)?.target;
}
