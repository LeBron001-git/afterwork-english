import { AppShell } from "@/components/layout/app-shell";
import { ModulePage } from "@/components/learning/module-page";
import { sentences } from "@/lib/mock-data";

export default function SentencesPage() {
  return (
    <AppShell>
      <ModulePage title="经典短句" subtitle="把短句作为真实表达的最小单位，适合碎片时间反复看。" type="sentence" items={sentences.map((item) => ({ id: item.id, title: item.en, subtitle: item.cn, body: item.scene, meta: "3 XP" }))} />
    </AppShell>
  );
}
