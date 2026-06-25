"use client";

import { Moon, Palette, Sparkles, Sun, Type, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLearningStore } from "@/store/use-learning-store";
import { themes } from "@/lib/themes";

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { preference, setTheme, setColorMode, toggleLargeFont, toggleReduceMotion } = useLearningStore();

  return (
    <div className={compact ? "grid gap-2" : "grid gap-4"}>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`focus-ring rounded-xl border px-3 py-2 text-left text-sm transition ${
              preference.theme === theme.id ? "border-[var(--accent)] bg-[var(--soft)]" : "border-[var(--line)] bg-[var(--card)]"
            }`}
          >
            <span className="block font-semibold">{theme.name}</span>
            {!compact && <span className="text-xs text-muted">{theme.desc}</span>}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={preference.colorMode === "light" ? "primary" : "secondary"} onClick={() => setColorMode("light")}>
          <Sun size={16} /> 浅色
        </Button>
        <Button size="sm" variant={preference.colorMode === "dark" ? "primary" : "secondary"} onClick={() => setColorMode("dark")}>
          <Moon size={16} /> 深色
        </Button>
        <Button size="sm" variant={preference.colorMode === "system" ? "primary" : "secondary"} onClick={() => setColorMode("system")}>
          <Palette size={16} /> 跟随系统
        </Button>
        <Button size="sm" variant={preference.reduceMotion ? "primary" : "secondary"} onClick={toggleReduceMotion}>
          <Waves size={16} /> 动画
        </Button>
        <Button size="sm" variant={preference.largeFont ? "primary" : "secondary"} onClick={toggleLargeFont}>
          <Type size={16} /> 大字
        </Button>
      </div>
      {!compact && (
        <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] px-3 py-2 text-sm text-muted">
          <Sparkles size={16} /> 设置会自动保存，刷新后仍保留。
        </div>
      )}
    </div>
  );
}
