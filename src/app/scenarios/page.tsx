import { AppShell } from "@/components/layout/app-shell";
import { ModulePage } from "@/components/learning/module-page";
import { scenarios } from "@/lib/mock-data";

export default function ScenariosPage() {
  return (
    <AppShell>
      <ModulePage title="场景练习" subtitle="围绕成年人真实高频场景，练能马上用的一小段表达。" type="scenario" items={scenarios.map((item) => ({ id: item.id, title: item.title, subtitle: item.context, body: item.lines.map((line) => `${line.en} ${line.cn}`).join(" / "), meta: "12 XP" }))} />
    </AppShell>
  );
}
