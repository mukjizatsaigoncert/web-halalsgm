// Shared light-theme field styling for forms that sit on a white card —
// styles/utilities.css's .form-label/.form-input assume a dark card
// background (built for ContactForm's bg-primary panel) and shouldn't be
// reused here. See HomeCertPortal-era CertificationApplicationForm note.
export const LABEL_CLASS = "mb-2 block font-medium text-dark text-sm";
export const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/40 disabled:opacity-60";
