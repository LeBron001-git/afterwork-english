import { AppShell } from "@/components/layout/app-shell";
import { ProgressSnapshot } from "@/components/learning/progress-snapshot";
import { CheckInCalendarCard } from "@/components/checkin/check-in-calendar-card";
import { LearnerLevelCard } from "@/components/level/learner-level-card";

export default function ProgressPage() {
  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-2">
        <ProgressSnapshot />
        <LearnerLevelCard />
        <CheckInCalendarCard />
      </div>
    </AppShell>
  );
}
