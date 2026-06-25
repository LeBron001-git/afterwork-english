import { AppShell } from "@/components/layout/app-shell";
import { ProfileSwitcher } from "@/components/profile/profile-switcher";
import { StudyPlanSettings } from "@/components/settings/study-plan-settings";
import { ShareAccessPanel } from "@/components/share/share-access-panel";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="grid gap-5">
        <section className="card p-6">
          <p className="text-sm text-muted">设置</p>
          <h1 className="mt-2 text-3xl font-semibold">让学习环境更顺手</h1>
          <p className="mt-2 max-w-2xl text-muted">主题、明暗模式、动画和字体都会保存到本地。</p>
        </section>
        <section className="card p-6">
          <ThemeSwitcher />
        </section>
        <StudyPlanSettings />
        <ProfileSwitcher />
        <ShareAccessPanel />
        <section className="card p-6">
          <h2 className="text-xl font-semibold">本地数据</h2>
          <p className="mt-2 text-muted">学习记录保存在浏览器 localStorage 中，当前 MVP 不上传云端、不需要登录。</p>
          <div className="mt-4 grid gap-2 text-sm text-muted">
            <code>afterwork-english:learning-store</code>
            <code>afterwork-english:user-preference</code>
            <code>afterwork-english:check-in-records</code>
            <code>afterwork-english:user-words</code>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
