"use client";
import { usePathname } from "next/navigation";
import { FG, heroTone } from "@/lib/hero";
import { pill } from "@/components/ui/pill";
import { WipeLink } from "./Wipe";
import { SignupCta } from "./SignupCta";

const NAV = [
  { href: "/drops", label: "Drops" },
  { href: "/crew-club", label: "Crew Club" },
  { href: "/delivery", label: "Delivery" },
];

/** Transparent over the hero. Text takes the hero's contrast color. */
export function Header() {
  const pathname = usePathname();
  const tone = heroTone(pathname);
  const fg = FG[tone];
  return (
    <header className={`absolute inset-x-0 top-0 z-40 ${fg} ${tone === "green" || tone === "red" ? "on-red" : ""}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-cream">
        Skip to the good stuff
      </a>
      <div className="flex items-center gap-x-4 px-4 pt-4 sm:gap-x-6 sm:px-8 sm:pt-6">
        <WipeLink href="/" className="display whitespace-nowrap text-[24px] leading-none sm:text-[32px]" aria-label="Trader Joe’s, home">
          Trader Joe’s
        </WipeLink>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {NAV.map((n) => (
              <li key={n.href}>
                <WipeLink
                  href={n.href}
                  aria-current={pathname === n.href ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center text-[15px] font-semibold uppercase ${pathname === n.href ? "underline decoration-2 underline-offset-[6px]" : "opacity-80 hover:opacity-100"}`}
                >
                  {n.label}
                </WipeLink>
              </li>
            ))}
          </ul>
        </nav>
        <SignupCta from="header" ariaLabel="Get the Fearless Flyer" className={pill(tone === "red" ? "red" : "cream", "ml-auto min-h-11 px-4 text-[16px] sm:min-h-14 sm:px-7 sm:text-[20px]")}>
          <span className="sm:hidden">Get the Flyer</span>
          <span className="hidden sm:inline">Get the Fearless Flyer</span>
        </SignupCta>
      </div>
      <nav aria-label="Main" className="px-4 pt-3 md:hidden">
        <ul className="flex gap-5">
          {NAV.map((n) => (
            <li key={n.href}>
              <WipeLink
                href={n.href}
                aria-current={pathname === n.href ? "page" : undefined}
                className={`inline-flex min-h-11 items-center text-[14px] font-semibold uppercase ${pathname === n.href ? "underline decoration-2 underline-offset-[6px]" : "opacity-80"}`}
              >
                {n.label}
              </WipeLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
