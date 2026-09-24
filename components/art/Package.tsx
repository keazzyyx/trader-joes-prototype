/** Generic illustrated grocery packaging, drawn in SVG. Packaging is the one place other colors are allowed. */
export type PackArt = {
  shape: "box" | "bag" | "tub" | "tin" | "bottle" | "pouch";
  body: string;
  accent: string;
  label: string;
  title: [string, string];
  motif: "pumpkin" | "slice" | "donut" | "cookie" | "leaf" | "stripes" | "berries" | "cone" | "melon" | "bun";
};

function Motif({ motif, accent, cx, cy, s = 1 }: { motif: PackArt["motif"]; accent: string; cx: number; cy: number; s?: number }) {
  const t = `translate(${cx} ${cy}) scale(${s})`;
  switch (motif) {
    case "pumpkin":
      return (
        <g transform={t}>
          <ellipse cx="0" cy="4" rx="22" ry="16" fill="#F08A24" stroke="#7A3B10" strokeWidth="1.5" />
          <path d="M-8 -10c-4 8-4 22 0 29M8 -10c4 8 4 22 0 29M0 -12v31" stroke="#7A3B10" strokeWidth="1.2" fill="none" />
          <path d="M0-12c0-5 2-8 6-9" stroke="#3E6B2E" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      );
    case "slice":
      return (
        <g transform={t}>
          <path d="M-24 10L22-12 22 10z" fill="#E08A3A" stroke="#7A3B10" strokeWidth="1.5" />
          <path d="M-24 10h46v6h-46z" fill="#B87A45" stroke="#7A3B10" strokeWidth="1.5" />
          <circle cx="12" cy="-4" r="3.5" fill="#FFF4E0" />
        </g>
      );
    case "donut":
      return (
        <g transform={t}>
          <circle r="20" fill="#C98A4B" stroke="#6B3A12" strokeWidth="1.5" />
          <circle r="7" fill="#F6E7C8" stroke="#6B3A12" strokeWidth="1.5" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <circle key={i} cx={Math.cos(i) * 13} cy={Math.sin(i * 1.3) * 12} r="1.1" fill="#FFF4E0" />
          ))}
        </g>
      );
    case "cookie":
      return (
        <g transform={t}>
          <rect x="-24" y="-7" width="48" height="6" rx="3" fill="#3A2416" />
          <rect x="-23" y="-1" width="46" height="5" rx="2.5" fill="#F4A64A" />
          <rect x="-24" y="4" width="48" height="6" rx="3" fill="#3A2416" />
        </g>
      );
    case "leaf":
      return (
        <g transform={t}>
          <path d="M0 22V-2M0-22l6 10 10-4-4 10 12 2-10 8 4 6-12-2-6 8-6-8-12 2 4-6-10-8 12-2-4-10 10 4z" fill={accent} stroke="#6B2A12" strokeWidth="1.2" />
        </g>
      );
    case "stripes":
      return (
        <g transform={t}>
          <path d="M-6 22v-30a10 10 0 0 1 20 0v4" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
          <path d="M-6 22v-30a10 10 0 0 1 20 0v4" fill="none" stroke={accent} strokeWidth="7" strokeDasharray="5 5" strokeLinecap="butt" />
        </g>
      );
    case "berries":
      return (
        <g transform={t}>
          {[
            [-8, 2],
            [6, -2],
            [0, 10],
            [12, 9],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="7" fill="#B3122F" stroke="#5A0A18" strokeWidth="1" />
          ))}
          <path d="M-4-8c6-8 14-8 20-4" stroke="#3E6B2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case "cone":
      return (
        <g transform={t}>
          <path d="M-10-2L0 24 10-2z" fill="#D9A45B" stroke="#6B3E26" strokeWidth="1.3" />
          <path d="M-6 4l10 8M-3 12l6 -8M-8 0l14 10" stroke="#6B3E26" strokeWidth=".8" />
          <circle cx="0" cy="-8" r="11" fill="#FFF3F5" stroke="#6B3E26" strokeWidth="1.3" />
          <path d="M-10-6c4 4 16 4 20 0" stroke="#6B3E26" strokeWidth="3" fill="none" />
        </g>
      );
    case "melon":
      return (
        <g transform={t}>
          <path d="M-24-4a24 24 0 0 0 48 0z" fill="#2F7A3A" />
          <path d="M-20-4a20 20 0 0 0 40 0z" fill="#FF6B78" />
          {[-10, -3, 4, 11].map((x, i) => (
            <ellipse key={i} cx={x} cy={i % 2 ? 4 : 7} rx="1.3" ry="2" fill="#1f1a17" />
          ))}
        </g>
      );
    case "bun":
      return (
        <g transform={t}>
          <ellipse cy="4" rx="22" ry="15" fill="#C88A4E" stroke="#6B3E26" strokeWidth="1.3" />
          <path d="M-16 0h32M0-10v26" stroke="#FFF7EA" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
  }
}

function Label({ art, x, y, w, h }: { art: PackArt; x: number; y: number; w: number; h: number }) {
  const ink = art.accent.toLowerCase() === art.label.toLowerCase() ? "#1f1a17" : art.accent;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={art.label} />
      <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize="8" fontStyle="italic" fill={ink} opacity=".8" className="font-wonk" fontWeight="700">
        Trader Joe&rsquo;s
      </text>
      <text x={x + w / 2} y={y + 31} textAnchor="middle" fontSize="13" fontWeight="800" fill={ink} className="font-display">
        {art.title[0]}
      </text>
      <text x={x + w / 2} y={y + 46} textAnchor="middle" fontSize="13" fontWeight="800" fill={ink} className="font-display">
        {art.title[1]}
      </text>
    </g>
  );
}

export function Package({ art, className = "" }: { art: PackArt; className?: string }) {
  const shade = <rect x="0" y="0" width="160" height="200" fill="url(#pack-shade)" pointerEvents="none" />;
  let body: React.ReactNode;
  switch (art.shape) {
    case "box":
      body = (
        <>
          <path d="M28 30l12-10h92l-12 10z" fill={art.accent} opacity=".85" />
          <path d="M120 30l12-10v150l-12 10z" fill={art.accent} opacity=".6" />
          <rect x="28" y="30" width="92" height="150" fill={art.body} />
          <Label art={art} x={34} y={40} w={80} h={52} />
          <Motif motif={art.motif} accent={art.accent} cx={74} cy={134} s={1.1} />
        </>
      );
      break;
    case "bag":
      body = (
        <>
          <path d="M34 26h92l6 150c-30 8-74 8-104 0z" fill={art.body} />
          <path d="M34 26h92l-2 12H36z" fill={art.accent} opacity=".5" />
          <path d="M36 22h88" stroke={art.accent} strokeWidth="6" strokeLinecap="round" />
          <Label art={art} x={42} y={48} w={76} h={52} />
          <Motif motif={art.motif} accent={art.accent} cx={80} cy={138} s={1.05} />
        </>
      );
      break;
    case "pouch":
      body = (
        <>
          <path d="M36 30c0-6 4-10 10-10h68c6 0 10 4 10 10v140c-2 6-8 8-14 8H50c-6 0-12-2-14-8z" fill={art.body} />
          <path d="M40 34h80" stroke="#fffdf8" strokeOpacity=".5" strokeWidth="2" strokeDasharray="3 3" />
          <Label art={art} x={44} y={46} w={72} h={52} />
          <Motif motif={art.motif} accent={art.accent} cx={80} cy={140} s={1} />
        </>
      );
      break;
    case "tub":
      body = (
        <>
          <ellipse cx="80" cy="176" rx="56" ry="8" fill={art.accent} opacity=".6" />
          <path d="M22 70h116l-6 106H28z" fill={art.body} />
          <rect x="18" y="56" width="124" height="18" rx="4" fill={art.accent} />
          <Label art={art} x={34} y={84} w={92} h={52} />
          <Motif motif={art.motif} accent={art.accent} cx={80} cy={158} s={0.8} />
        </>
      );
      break;
    case "tin":
      body = (
        <>
          <rect x="24" y="44" width="112" height="136" rx="10" fill={art.body} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={i} d={`M${24 + i * 18} 180l24-136`} stroke={art.accent} strokeWidth="6" opacity=".85" />
          ))}
          <rect x="20" y="34" width="120" height="22" rx="6" fill={art.label} />
          <Label art={art} x={36} y={80} w={88} h={54} />
        </>
      );
      break;
    case "bottle":
      body = (
        <>
          <rect x="68" y="8" width="24" height="14" rx="3" fill={art.accent} />
          <path d="M70 22h20v24c0 10 26 16 26 34v96c0 4-4 6-8 6H52c-4 0-8-2-8-6V80c0-18 26-24 26-34z" fill={art.body} />
          <path d="M56 64c0 40 0 80 2 110" stroke="#fffdf8" strokeOpacity=".3" strokeWidth="5" strokeLinecap="round" />
          <Label art={art} x={46} y={96} w={68} h={52} />
          <Motif motif={art.motif} accent={art.accent} cx={80} cy={166} s={0.55} />
        </>
      );
      break;
  }
  return (
    <svg viewBox="0 0 160 200" className={className} role="img" aria-label={`${art.title.join(" ")} package`}>
      <defs>
        <linearGradient id="pack-shade" x1="0" x2="1">
          <stop offset="0" stopColor="#fffdf8" stopOpacity=".12" />
          <stop offset=".45" stopColor="#fffdf8" stopOpacity="0" />
          <stop offset="1" stopColor="#1f1a17" stopOpacity=".12" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="186" rx="60" ry="6" fill="#1f1a17" opacity=".18" />
      {body}
      {art.shape !== "bottle" && shade}
    </svg>
  );
}
