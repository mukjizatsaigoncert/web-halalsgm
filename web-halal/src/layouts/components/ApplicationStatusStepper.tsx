import { STEP_LABELS, STEP_ORDER } from "@/lib/constants/applicationStatus";

type StepState = "done" | "current" | "upcoming";

function Dot({ state, number }: { state: StepState | "rejected"; number: number }) {
  if (state === "rejected") {
    return (
      <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
        ✕
      </div>
    );
  }
  if (state === "done") {
    return (
      <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
        ✓
      </div>
    );
  }
  if (state === "current") {
    return (
      <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-dark ring-4 ring-gold/20">
        {number}
      </div>
    );
  }
  return (
    <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-border bg-white text-xs font-bold text-text/50">
      {number}
    </div>
  );
}

// Each step takes an equal flex-1 slot; the connecting line is absolutely
// positioned spanning from the previous slot's center to this slot's
// center, so it never has to compete for width with the label (a plain
// flex line-then-dot layout collides on the last two labels once the last
// segment shrinks to fit its content).
function Seg({
  first,
  lineDone,
  children,
}: {
  first: boolean;
  lineDone: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-1 flex-col items-center">
      {!first && (
        <div
          className={`absolute top-[11px] -left-1/2 z-0 h-0.5 w-full ${lineDone ? "bg-secondary" : "bg-border"}`}
        />
      )}
      {children}
    </div>
  );
}

export default function ApplicationStatusStepper({
  status,
  siteVisitDate,
}: {
  status: string;
  siteVisitDate?: string;
}) {
  if (status === "rejected") {
    // No per-step history is stored server-side — infer how far the
    // application got from data we already have (siteVisitDate presence)
    // rather than guessing a fixed stopping point.
    const reachedSiteVisit = Boolean(siteVisitDate);
    const steps = reachedSiteVisit
      ? (["submitted", "under_review", "site_visit_scheduled"] as const)
      : (["submitted", "under_review"] as const);

    return (
      <div className="flex items-center">
        {steps.map((step, i) => (
          <Seg key={step} first={i === 0} lineDone>
            <Dot state="done" number={i + 1} />
            <span className="mt-1.5 text-center text-[10.5px] whitespace-nowrap text-text/70">
              {STEP_LABELS[step]}
            </span>
          </Seg>
        ))}
        <Seg first={false} lineDone>
          <Dot state="rejected" number={steps.length + 1} />
          <span className="mt-1.5 text-center text-[10.5px] font-semibold whitespace-nowrap text-red-600">
            Từ chối
          </span>
        </Seg>
      </div>
    );
  }

  const currentIndex = STEP_ORDER.indexOf(status as (typeof STEP_ORDER)[number]);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="flex items-center">
      {STEP_ORDER.map((step, i) => {
        const state: StepState =
          i < safeIndex || (i === safeIndex && status === "approved")
            ? "done"
            : i === safeIndex
              ? "current"
              : "upcoming";

        return (
          <Seg key={step} first={i === 0} lineDone={i <= safeIndex}>
            <Dot state={state} number={i + 1} />
            <span
              className={`mt-1.5 text-center text-[10.5px] whitespace-nowrap ${
                state === "upcoming" ? "text-text/50" : "font-medium text-dark"
              }`}
            >
              {STEP_LABELS[step]}
            </span>
          </Seg>
        );
      })}
    </div>
  );
}
