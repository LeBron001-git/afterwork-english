"use client";

import { CheckCircle2, Circle, RotateCcw, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exercises } from "@/lib/mock-data";
import { useLearningStore } from "@/store/use-learning-store";

type AnswerState = Record<string, { choice?: string; submitted: boolean; correct?: boolean }>;

export function PracticeCenter() {
  const [answers, setAnswers] = useState<AnswerState>({});
  const { answerExercise, wrongQuestions } = useLearningStore();

  const stats = useMemo(() => {
    const submitted = Object.values(answers).filter((item) => item.submitted);
    const correct = submitted.filter((item) => item.correct).length;
    return { submitted: submitted.length, correct, rate: submitted.length ? Math.round((correct / submitted.length) * 100) : 0 };
  }, [answers]);

  function choose(questionId: string, choice: string) {
    setAnswers((current) => ({ ...current, [questionId]: { ...current[questionId], choice, submitted: false } }));
  }

  function submit(questionId: string, answer: string) {
    const choice = answers[questionId]?.choice;
    if (!choice) return;
    const correct = choice === answer;
    setAnswers((current) => ({ ...current, [questionId]: { ...current[questionId], submitted: true, correct } }));
    answerExercise(questionId, correct);
  }

  function reset() {
    setAnswers({});
  }

  return (
    <div className="grid gap-5">
      <section className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">练习中心</p>
            <h1 className="mt-2 text-3xl font-semibold">做题不是考试，是确认哪里还模糊。</h1>
            <p className="mt-2 max-w-2xl text-muted">选择答案后提交，立即看到正确性和中文解析。答错会进入错题记录。</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <Metric label="已做" value={stats.submitted} />
            <Metric label="正确" value={stats.correct} />
            <Metric label="正确率" value={`${stats.rate}%`} />
          </div>
        </div>
        <Button className="mt-5" variant="secondary" size="sm" onClick={reset}>
          <RotateCcw size={16} /> 重做本页
        </Button>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-4">
          {exercises.map((question, index) => {
            const state = answers[question.id];
            const wrong = wrongQuestions[question.id];
            return (
              <article key={question.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted">Question {index + 1}</p>
                    <h2 className="mt-1 text-lg font-semibold">{question.prompt}</h2>
                  </div>
                  {wrong && !wrong.resolved && <span className="rounded-full bg-[var(--soft)] px-3 py-1 text-xs text-[var(--accent-3)]">错题 x{wrong.wrongCount}</span>}
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const selected = state?.choice === option;
                    const submitted = state?.submitted;
                    const isAnswer = question.answer === option;
                    const isWrongChoice = submitted && selected && !isAnswer;
                    return (
                      <button
                        key={option}
                        onClick={() => choose(question.id, option)}
                        className={cn(
                          "focus-ring flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition hover:bg-[var(--soft)]",
                          selected ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]" : "border-[var(--line)] bg-[var(--card)]",
                          submitted && isAnswer && "border-[var(--accent-2)] bg-[color-mix(in_srgb,var(--accent-2)_18%,transparent)]",
                          isWrongChoice && "border-[var(--accent-3)] bg-[color-mix(in_srgb,var(--accent-3)_18%,transparent)]",
                        )}
                      >
                        {submitted && isAnswer ? <CheckCircle2 size={18} /> : isWrongChoice ? <XCircle size={18} /> : <Circle size={18} />}
                        {option}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button variant={state?.submitted ? "secondary" : "primary"} disabled={!state?.choice} onClick={() => submit(question.id, question.answer)}>
                    {state?.submitted ? "已判题" : "提交答案"}
                  </Button>
                  {state?.submitted && (
                    <span className={cn("text-sm font-medium", state.correct ? "text-[var(--accent-2)]" : "text-[var(--accent-3)]")}>
                      {state.correct ? "回答正确，继续保持。" : `正确答案是 ${question.answer}`}
                    </span>
                  )}
                </div>
                {state?.submitted && <p className="mt-4 rounded-2xl bg-[var(--soft)] p-4 text-sm leading-6 text-muted">{question.explanation}</p>}
              </article>
            );
          })}
        </div>
        <aside className="card h-fit p-5">
          <h2 className="text-lg font-semibold">错题面板</h2>
          <p className="mt-1 text-sm text-muted">答错的题会留在这里，答对后标记为已解决。</p>
          <div className="mt-4 grid gap-3">
            {Object.values(wrongQuestions).length === 0 && <div className="rounded-2xl bg-[var(--soft)] p-4 text-sm text-muted">暂无错题，先做几道题看看。</div>}
            {Object.values(wrongQuestions).map((item) => {
              const question = exercises.find((entry) => entry.id === item.questionId);
              if (!question) return null;
              return (
                <div key={item.questionId} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-sm">{question.prompt}</strong>
                    <span className={cn("rounded-full px-2 py-1 text-xs", item.resolved ? "bg-[var(--soft)] text-[var(--accent-2)]" : "bg-[var(--soft)] text-[var(--accent-3)]")}>
                      {item.resolved ? "已解决" : `错 ${item.wrongCount} 次`}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted">{question.explanation}</p>
                </div>
              );
            })}
          </div>
        </aside>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-[var(--soft)] px-4 py-3">
      <div className="text-xs text-muted">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}
