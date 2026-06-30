"use client";

import Logo from "@/components/Logo";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

interface NavItem {
  name?: string;
  url?: string;
  hasChildren?: boolean;
  children?: { name?: string; url?: string }[];
}

const { main }: { main: NavItem[] } = menu;
const { navigation_button, params } = config;

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, []);

  const isActive = (url?: string) =>
    url === "/" ? pathname === "/" : pathname?.startsWith(url ?? "__");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 xl:max-w-[1225px]">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Nav links — desktop */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {main.map((item) =>
              item.hasChildren ? (
                <li key={item.url} className="relative group">
                  <span
                    className={`flex items-center gap-1 px-3 py-2 text-[15px] font-medium cursor-pointer transition-colors hover:text-secondary ${
                      item.children?.some((c) => isActive(c.url))
                        ? "text-secondary"
                        : "text-dark"
                    }`}
                  >
                    {item.name}
                    <svg className="w-3 h-3 mt-0.5 flex-shrink-0" viewBox="0 0 128 128" fill="currentColor">
                      <path d="m64 88c-1.023 0-2.047-.391-2.828-1.172l-40-40c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0l37.172 37.172 37.172-37.172c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656l-40 40c-.781.781-1.805 1.172-2.828 1.172z" />
                    </svg>
                  </span>
                  {/* Dropdown */}
                  <ul className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full left-0 mt-1 min-w-[200px] bg-white border border-border rounded-xl shadow-lg py-2 transition-all duration-200 z-50">
                    {item.children?.map((child) => (
                      <li key={child.url}>
                        <Link
                          href={child.url ?? "#"}
                          onClick={closeMobile}
                          className={`block px-4 py-2.5 text-[14px] transition-colors hover:text-secondary ${
                            isActive(child.url) ? "text-secondary font-semibold" : "text-dark"
                          }`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.url}>
                  <Link
                    href={item.url ?? "#"}
                    className={`block px-3 py-2 text-[15px] font-medium transition-colors hover:text-secondary ${
                      isActive(item.url) ? "text-secondary" : "text-dark"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Right side — phone + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {params?.phone && (
              <a
                href={`tel:${params.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-sm font-medium text-dark hover:text-secondary transition-colors"
              >
                <svg className="w-4 h-4 text-secondary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                {params.phone}
              </a>
            )}
            {navigation_button?.enable && (
              <Link
                href={navigation_button.link ?? "/lien-he"}
                className="px-5 py-2.5 bg-secondary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                {navigation_button.label}
              </Link>
            )}
            {/* Search icon */}
            <button
              aria-label="Tìm kiếm"
              className="w-9 h-9 flex items-center justify-center text-dark hover:text-secondary transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          {/* Hamburger — mobile */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className={`block w-6 h-0.5 bg-dark transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-dark transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-dark transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 bg-white border-t border-border ${
          mobileOpen ? "max-h-screen py-4" : "max-h-0"
        }`}
      >
        <ul className="container mx-auto px-4 xl:max-w-[1225px] flex flex-col gap-1">
          {main.map((item) =>
            item.hasChildren ? (
              <li key={item.url}>
                <button
                  className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-dark hover:text-secondary transition-colors"
                  onClick={() =>
                    setOpenDropdown((p) => (p === item.url ? null : (item.url ?? null)))
                  }
                >
                  {item.name}
                  <svg
                    className={`w-4 h-4 transition-transform ${openDropdown === item.url ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
                {openDropdown === item.url && (
                  <ul className="pl-4 flex flex-col gap-1 pb-2">
                    {item.children?.map((child) => (
                      <li key={child.url}>
                        <Link
                          href={child.url ?? "#"}
                          onClick={closeMobile}
                          className={`block px-3 py-2 text-sm transition-colors hover:text-secondary ${
                            isActive(child.url) ? "text-secondary font-medium" : "text-text"
                          }`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={item.url}>
                <Link
                  href={item.url ?? "#"}
                  onClick={closeMobile}
                  className={`block px-3 py-3 text-sm font-medium transition-colors hover:text-secondary ${
                    isActive(item.url) ? "text-secondary" : "text-dark"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            )
          )}
          {/* Mobile CTA */}
          <li className="pt-3 border-t border-border mt-2">
            <Link
              href={navigation_button?.link ?? "/lien-he"}
              onClick={closeMobile}
              className="block w-full text-center px-5 py-3 bg-secondary text-white text-sm font-semibold rounded-lg"
            >
              {navigation_button?.label ?? "Liên hệ"}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
