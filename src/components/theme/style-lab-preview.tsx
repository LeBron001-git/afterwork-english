import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { themes } from "@/lib/themes";

export function StyleLabPreview() {
  return (
    <div className="grid gap-5">
      <section className="card p-5">
        <h2 className="text-xl font-semibold">主题控制台</h2>
        <p className="mt-1 text-sm text-muted">切换风格、明暗模式、动画和字号。</p>
        <div className="mt-4">
          <ThemeSwitcher />
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {themes.map((theme) => (
          <div key={theme.id} className="card p-4">
            <div className="h-24 rounded-xl border border-[var(--line)] bg-[var(--soft)]" />
            <h3 className="mt-3 font-semibold">{theme.name}</h3>
            <p className="text-sm text-muted">{theme.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
