// Shared status vocabulary for certification-application status badges,
// used by both /ho-so-cua-toi (applicant's own submissions) and
// /doi-tac-malaysia (Malaysia-partner dashboard).
export const STATUS_LABELS: Record<string, string> = {
  submitted: "Đã tiếp nhận",
  under_review: "Đang xem xét",
  site_visit_scheduled: "Đã lên lịch khảo sát",
  approved: "Đã phê duyệt",
  rejected: "Không chấp thuận",
};

export const STATUS_CLASSES: Record<string, string> = {
  submitted: "bg-secondary/10 text-secondary border border-secondary/30",
  under_review: "bg-gold/10 text-gold border border-gold/30",
  site_visit_scheduled: "bg-gold/10 text-gold border border-gold/30",
  approved: "bg-green-500/10 text-green-700 border border-green-400/30",
  rejected: "bg-red-500/10 text-red-700 border border-red-400/30",
};

// Forward-only pipeline steps for the /ho-so-cua-toi status stepper.
// "rejected" is a terminal branch handled separately (see
// ApplicationStatusStepper) since it isn't a step in the happy path.
export const STEP_ORDER = [
  "submitted",
  "under_review",
  "site_visit_scheduled",
  "approved",
] as const;

export const STEP_LABELS: Record<(typeof STEP_ORDER)[number], string> = {
  submitted: "Tiếp nhận",
  under_review: "Xem xét",
  site_visit_scheduled: "Khảo sát",
  approved: "Phê duyệt",
};
