"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((x) => x);
  const humanize = (str: string) =>
    str.replace(/[-_]/g, " ").replace(/^\w/, (c) => c.toUpperCase());

  let parts = [
    {
      label: "Trang chu",
      href: "/",
      "aria-label": pathname === "/" ? "page" : undefined,
    },
  ];

  paths.forEach((label, i) => {
    const href = `/${paths.slice(0, i + 1).join("/")}`;
    label !== "page" &&
      parts.push({
        label: humanize(label.replace(".html", "")),
        href,
        "aria-label": pathname === href ? "page" : undefined,
      });
  });

  return (
    <nav
      data-aos="zoom-out-sm"
      data-aos-delay="150"
      aria-label="Breadcrumb"
      className={className}
    >
      <ol className="inline-flex" role="list">
        {parts.map(({ label, ...attrs }, index) => (
          <li className="mx-1 capitalize" role="listitem" key={index}>
            {index > 0 && (
              <span className="inline-block mr-1 text-white">/</span>
            )}
            {index !== parts.length - 1 ? (
              <Link
                href={attrs.href}
                className="text-white"
                aria-label={attrs["aria-label"]}
              >
                {label}
              </Link>
            ) : (
              <span className="text-text-light/80 ">{label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
