"use client";
import { motion } from "framer-motion";

/* Four ink-line illustrations for the delivery walkthrough. Lines draw on when a step becomes active. */

const draw = (delay = 0) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const ink = { fill: "none", stroke: "var(--color-ink)", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function OrderAhead() {
  return (
    <svg viewBox="0 0 320 260" className="h-full w-full" role="img" aria-label="A shopping list on a clipboard next to a phone">
      <rect x="62" y="30" width="140" height="196" rx="8" fill="var(--color-paper)" />
      <motion.path {...draw()} {...ink} d="M62 38c0-5 3-8 8-8h124c5 0 8 3 8 8v180c0 5-3 8-8 8H70c-5 0-8-3-8-8z" />
      <rect x="104" y="20" width="56" height="22" rx="5" fill="var(--color-kraft-deep)" />
      {["Bananas", "Orange chicken", "Flowers", "Cookie butter"].map((t, i) => (
        <g key={t}>
          <motion.path {...draw(0.3 + i * 0.15)} {...ink} strokeWidth={2.5} d={`M80 ${76 + i * 36}h14v14H80z`} />
          <motion.path {...draw(0.5 + i * 0.15)} fill="none" stroke="var(--color-red)" strokeWidth={3} strokeLinecap="round" d={`M81 ${84 + i * 36}l5 5 9-12`} />
          <text x="104" y={89 + i * 36} fontSize="15" fill="var(--color-ink)" className="font-body">
            {t}
          </text>
        </g>
      ))}
      <rect x="208" y="96" width="72" height="130" rx="12" fill="var(--color-board)" />
      <motion.path {...draw(0.4)} {...ink} d="M216 96h56c5 0 8 3 8 8v114c0 5-3 8-8 8h-56c-5 0-8-3-8-8V104c0-5 3-8 8-8z" />
      <rect x="216" y="110" width="56" height="94" rx="3" fill="var(--color-chalk)" />
      <text x="244" y="148" textAnchor="middle" fontSize="11" fill="var(--color-ink)" className="font-body">Order</text>
      <text x="244" y="162" textAnchor="middle" fontSize="11" fill="var(--color-ink)" className="font-body">placed</text>
      <motion.path {...draw(0.9)} fill="none" stroke="var(--color-red)" strokeWidth={3} strokeLinecap="round" d="M234 178l7 7 13-15" />
    </svg>
  );
}

export function CrewShops() {
  return (
    <svg viewBox="0 0 320 260" className="h-full w-full" role="img" aria-label="A shopping basket being filled with groceries">
      {/* items */}
      <rect x="92" y="78" width="40" height="56" rx="3" fill="#F07C1B" />
      <rect x="138" y="62" width="34" height="72" rx="3" fill="var(--color-red)" />
      <ellipse cx="200" cy="104" rx="26" ry="30" fill="#5B8C3A" />
      <path d="M112 78v-8M155 62v-8" stroke="var(--color-ink)" strokeWidth={2} />
      <path d="M184 76c10-14 22-18 34-14" {...ink} strokeWidth={2.5} />
      {/* hibiscus: the Hawaiian-shirt crew */}
      <g transform="translate(248 50)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="0" cy="-13" rx="9" ry="13" fill="var(--color-red)" transform={`rotate(${r})`} />
        ))}
        <circle r="5" fill="var(--color-kraft)" />
      </g>
      {/* basket */}
      <path d="M60 128h200l-20 96H80z" fill="var(--color-kraft)" />
      <motion.path {...draw()} {...ink} d="M60 128h200l-20 96H80z" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.path key={i} {...draw(0.2 + i * 0.05)} {...ink} strokeWidth={2} d={`M${88 + i * 24} 134l${-4 + i * 0.3} 84`} />
      ))}
      <motion.path {...draw(0.3)} {...ink} strokeWidth={2} d="M68 164h184M74 194h172" />
      <motion.path {...draw(0.6)} {...ink} d="M92 128c0-60 136-60 136 0" />
    </svg>
  );
}

export function Handoff() {
  return (
    <svg viewBox="0 0 320 260" className="h-full w-full" role="img" aria-label="A paper grocery bag on a doorstep, and a clock showing a pickup window">
      <rect x="70" y="34" width="110" height="190" fill="var(--color-board)" />
      <motion.path {...draw()} {...ink} d="M70 224V34h110v190" />
      <motion.path {...draw(0.2)} {...ink} strokeWidth={2} d="M84 48h82v70H84zM84 132h82v78H84z" />
      <circle cx="166" cy="132" r="4" fill="var(--color-kraft)" />
      <motion.path {...draw(0.1)} {...ink} d="M40 224h240M52 236h216" />
      {/* bag */}
      <path d="M150 160h56l6 64h-68z" fill="var(--color-kraft)" />
      <motion.path {...draw(0.4)} {...ink} d="M150 160h56l6 64h-68z" />
      <motion.path {...draw(0.6)} {...ink} strokeWidth={2} d="M150 160l8-10h40l8 10" />
      <path d="M166 150c-2-14 6-22 12-22s10 10 6 22" fill="#5B8C3A" />
      <text x="178" y="200" textAnchor="middle" fontSize="11" fontStyle="italic" fontWeight={700} fill="var(--color-red-deep)" className="font-wonk">
        TJ&rsquo;s
      </text>
      {/* clock */}
      <circle cx="250" cy="90" r="34" fill="var(--color-paper)" />
      <motion.circle {...draw(0.3)} {...ink} cx="250" cy="90" r="34" />
      <motion.path {...draw(0.7)} d="M250 90V56A34 34 0 0 1 279 107z" fill="rgb(200 16 46 / 0.2)" stroke="none" />
      <motion.path {...draw(0.8)} {...ink} d="M250 90V66M250 90l14 8" />
    </svg>
  );
}

export function Refund() {
  return (
    <svg viewBox="0 0 320 260" className="h-full w-full" role="img" aria-label="A receipt stamped Refunded">
      <path d="M96 22h128v206l-10-8-11 8-11-8-11 8-11-8-11 8-11-8-11 8-11-8-11 8-10-8-10 8z" fill="var(--color-paper)" />
      <motion.path {...draw()} {...ink} d="M96 22h128v206l-10-8-11 8-11-8-11 8-11-8-11 8-11-8-11 8-11-8-11 8-10-8-10 8z" />
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.path key={i} {...draw(0.2 + i * 0.08)} {...ink} strokeWidth={2} d={`M112 ${54 + i * 22}h${60 + ((i * 17) % 30)}M${196} ${54 + i * 22}h12`} />
      ))}
      <motion.path {...draw(0.6)} {...ink} strokeWidth={2} d="M112 176h96" strokeDasharray="4 5" />
      <motion.g
        initial={{ scale: 2, opacity: 0, rotate: -30 }}
        animate={{ scale: 1, opacity: 1, rotate: -14 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 600, damping: 22 }}
        style={{ originX: "160px", originY: "140px" }}
      >
        <rect x="92" y="112" width="136" height="50" rx="6" fill="none" stroke="var(--color-red)" strokeWidth={4} />
        <text x="160" y="146" textAnchor="middle" fontSize="24" fontWeight={800} fill="var(--color-red)" className="font-display" letterSpacing="1">
          REFUNDED
        </text>
      </motion.g>
    </svg>
  );
}
