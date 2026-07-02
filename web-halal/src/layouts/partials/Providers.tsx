"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { AuthProvider } from "@/lib/auth/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Initialize AOS (Animate On Scroll) library
  useEffect(() => {
    AOS.init({
      duration: 450,
      offset: 100,
      once: true,
    });
  }, []);

  const tree = <AuthProvider>{children}</AuthProvider>;

  if (!recaptchaKey) {
    // In local dev without a site key, skip the provider so the badge and
    // network calls are absent. The backend verify helper also bypasses in
    // non-production when RECAPTCHA_SECRET_KEY is unset.
    return tree;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey}
      scriptProps={{ async: true, defer: true, appendTo: "head" }}
    >
      {tree}
    </GoogleReCaptchaProvider>
  );
}
