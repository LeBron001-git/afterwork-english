import { AppShell } from "@/components/layout/app-shell";
import { ModulePage } from "@/components/learning/module-page";
import { phonetics } from "@/lib/mock-data";

export default function PhoneticPage() {
  return (
    <AppShell>
      <ModulePage title="音标学习" subtitle="先把常见发音拆小，每次只练一个声音。" type="phonetic" items={phonetics.map((item) => ({ id: item.id, title: item.symbol, subtitle: item.words.join(" / "), body: item.tip, meta: "5 XP" }))} />
    </AppShell>
  );
}
