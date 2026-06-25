import { AppShell } from "@/components/layout/app-shell";
import { ModulePage } from "@/components/learning/module-page";
import { grammarPoints } from "@/lib/mock-data";

export default function GrammarPage() {
  return (
    <AppShell>
      <ModulePage title="语法重启" subtitle="不背术语，先看懂工作和生活里最常见的句子结构。" type="grammar" items={grammarPoints.map((item) => ({ id: item.id, title: item.title, subtitle: item.rule, body: `${item.example} ${item.translation}`, meta: "8 XP" }))} />
    </AppShell>
  );
}
