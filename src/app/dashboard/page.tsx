import { AppShell } from "@/components/layout/app-shell";
import { CheckInCalendarCard } from "@/components/checkin/check-in-calendar-card";
import { DailyPlanCard, StudyTaskBoard } from "@/components/learning/task-cards";
import { LearnerLevelCard } from "@/components/level/learner-level-card";
import { ProgressSnapshot } from "@/components/learning/progress-snapshot";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="mx-auto grid max-w-[1380px] gap-5">
        <DailyPlanCard />
        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid min-w-0 gap-5">
            <StudyTaskBoard />
            <ProgressSnapshot />
          </div>
          <aside className="grid content-start gap-5 md:grid-cols-2 2xl:grid-cols-1">
            <div className="xl:hidden">
              <CheckInCalendarCard />
            </div>
            <LearnerLevelCard />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
