"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { pillClass } from "@/components/ui/button";
import { FlyerButton } from "./FlyerDrawer";

const NAV = [
  { href: "/drops", label: "Drops" },
  { href: "/crew-club", label: "Crew Club" },
  { href: "/delivery", label: "Delivery" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled ? "tex-paper border-b border-ink/15 shadow-[0_6px_18px_-14px_rgb(31_26_23/0.6)]" : "border-b border-transparent bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[70] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to the good stuff
      </a>
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 pt-3 sm:px-6 md:py-3">
        <Link href="/" className="font-wonk shrink-0 text-[26px] leading-none font-bold text-red sm:text-[30px]" aria-label="Trader Joe’s, home">
          Trader Joe&rsquo;s
        </Link>
        <nav aria-label="Main" className="ml-6 hidden md:block">
          <NavLinks pathname={pathname} />
        </nav>
        <FlyerButton from="header" className={`${pillClass} ml-auto max-[359px]:px-3 max-[359px]:text-[13px]`}>
          Get the Fearless Flyer
        </FlyerButton>
      </div>
      <nav aria-label="Main" className="mx-auto max-w-[1200px] px-4 pb-1 md:hidden">
        <NavLinks pathname={pathname} />
      </nav>
    </header>
  );
}

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <ul className="flex items-center gap-1 sm:gap-2">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative inline-flex min-h-11 items-center px-2.5 text-[16px] font-medium ${active ? "text-ink" : "text-ink/70 hover:text-ink"}`}
            >
              {item.label}
              {active && (
                <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute inset-x-1.5 bottom-1.5 h-2 text-red" aria-hidden>
                  <motion.path
                    d="M2 6c20-4 44-4 62-2s24 2 34-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
                  />
                </svg>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
