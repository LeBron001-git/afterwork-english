import { AppShell } from "@/components/layout/app-shell";
import { CheckInCalendarCard } from "@/components/checkin/check-in-calendar-card";
import { DailyPlanCard, StudyTaskGrid } from "@/components/learning/task-cards";
import { LearnerLevelCard } from "@/components/level/learner-level-card";
import { ProgressSnapshot } from "@/components/learning/progress-snapshot";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-5 md:grid-cols-2">
          <DailyPlanCard />
          <StudyTaskGrid />
          <ProgressSnapshot />
        </div>
        <div className="grid content-start gap-5">
          <CheckInCalendarCard />
          <LearnerLevelCard />
        </div>
      </div>
    </AppShell>
  );
}
