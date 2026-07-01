import "@testing-library/jest-dom";

// Stub the reCAPTCHA hook so components using it don't need the provider
// in test. Individual tests can override this via jest.mock.
jest.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: jest.fn().mockResolvedValue("test-recaptcha-token"),
  }),
  GoogleReCaptchaProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

// Silence Next.js router warnings in component tests. Pages that rely on
// routing should render within a MemoryRouter or use next/navigation mocks.
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// jsdom lacks these but Next.js/swiper/aos touch them.
if (typeof window !== "undefined") {
  window.scrollTo = jest.fn() as unknown as typeof window.scrollTo;
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }),
    });
  }
}
