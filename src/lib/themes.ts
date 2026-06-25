import type { ThemeId } from "@/types/learning";

export const themes: { id: ThemeId; name: string; desc: string }[] = [
  { id: "minimal-pro", name: "Minimal Pro", desc: "极简高级" },
  { id: "dark-focus", name: "Dark Focus", desc: "夜间专注" },
  { id: "bento-glass", name: "Bento Glass", desc: "玻璃拟态" },
  { id: "cyber-energy", name: "Cyber Energy", desc: "轻科技感" },
  { id: "warm-study", name: "Warm Study", desc: "温暖低压" },
];
