"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Statewide" },
  { href: "/county", label: "County" },
  { href: "/congressional", label: "Congressional" },
  { href: "/legislative", label: "Legislative" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav" aria-label="Turnout breakdowns">
      <div className="site-nav-scroll">
        <div className="site-nav-inner">
        {TABS.map(({ href, label }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={active ? "site-nav-link active" : "site-nav-link"}
              aria-current={active ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
        </div>
      </div>
    </nav>
  );
}
