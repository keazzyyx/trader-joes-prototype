/* Flat front-of-pack cutouts for the seasonal drops. Thick ink outline, flat fills, no shadow, no background. */

export type PackArt = {
  shape: "box" | "bag" | "tub" | "tin" | "bottle" | "pouch";
  body: string;
  accent: string;
  label: string;
  title: [string, string];
  motif: "pumpkin" | "slice" | "donut" | "cookie" | "leaf" | "stripes" | "berries" | "cone" | "melon" | "bun";
};

const INK = "#151515";
const o = { stroke: INK, strokeWidth: 5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function Motif({ motif, accent, cx, cy, s = 1 }: { motif: PackArt["motif"]; accent: string; cx: number; cy: number; s?: number }) {
  const t = `translate(${cx} ${cy}) scale(${s})`;
  const k = { ...o, strokeWidth: 4 };
  switch (motif) {
    case "pumpkin":
      return (
        <g transform={t}>
          <ellipse cx="0" cy="6" rx="26" ry="19" fill="#F08A24" {...k} />
          <path d="M-9-11c-5 10-5 24 0 34M9-11c5 10 5 24 0 34" fill="none" {...k} />
          <path d="M0-13c0-6 3-10 8-11" fill="none" {...k} stroke="#3E6B2E" strokeWidth={6} />
        </g>
      );
    case "slice":
      return (
        <g transform={t}>
          <path d="M-28 12L26-14 26 12z" fill="#E08A3A" {...k} />
          <path d="M-28 12h54v8h-54z" fill="#B87A45" {...k} />
        </g>
      );
    case "donut":
      return (
        <g transform={t}>
          <circle r="24" fill="#C98A4B" {...k} />
          <circle r="8" fill={accent} {...k} />
        </g>
      );
    case "cookie":
      return (
        <g transform={t}>
          <rect x="-28" y="-9" width="56" height="8" rx="4" fill="#3A2416" {...k} />
          <rect x="-26" y="-2" width="52" height="6" fill="#F4A64A" {...k} />
          <rect x="-28" y="3" width="56" height="8" rx="4" fill="#3A2416" {...k} />
        </g>
      );
    case "leaf":
      return (
        <g transform={t}>
          <path d="M0-26l7 12 12-5-5 12 14 2-12 10 5 7-14-2-7 10-7-10-14 2 5-7-12-10 14-2-5-12 12 5z" fill={accent} {...k} />
          <path d="M0 6v20" fill="none" {...k} />
        </g>
      );
    case "stripes":
      return (
        <g transform={t}>
          <path d="M-8 26V-8a12 12 0 0 1 24 0v6" fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
          <path d="M-8 26V-8a12 12 0 0 1 24 0v6" fill="none" stroke={accent} strokeWidth="12" strokeDasharray="7 7" />
          <path d="M-8 26V-8a12 12 0 0 1 24 0v6" fill="none" {...k} strokeWidth={17} opacity={0} />
        </g>
      );
    case "berries":
      return (
        <g transform={t}>
          {[
            [-10, 2],
            [8, -3],
            [0, 13],
            [15, 11],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="9" fill="#B3122F" {...k} />
          ))}
        </g>
      );
    case "cone":
      return (
        <g transform={t}>
          <path d="M-13-2L0 28 13-2z" fill="#D9A45B" {...k} />
          <circle cx="0" cy="-10" r="14" fill="#FFF3F5" {...k} />
        </g>
      );
    case "melon":
      return (
        <g transform={t}>
          <path d="M-28-4a28 28 0 0 0 56 0z" fill="#2F7A3A" {...k} />
          <path d="M-21-4a21 21 0 0 0 42 0z" fill="#FF6B78" {...k} strokeWidth={3} />
          {[-10, -2, 6].map((x, i) => (
            <ellipse key={i} cx={x} cy={i % 2 ? 8 : 4} rx="2" ry="3" fill={INK} />
          ))}
        </g>
      );
    case "bun":
      return (
        <g transform={t}>
          <ellipse cy="4" rx="26" ry="17" fill="#C88A4E" {...k} />
          <path d="M-18 2h36M0-10v28" fill="none" stroke="#FFF7EA" strokeWidth="6" strokeLinecap="round" />
        </g>
      );
  }
}

function Label({ art, x, y, w, h }: { art: PackArt; x: number; y: number; w: number; h: number }) {
  const ink = art.accent.toLowerCase() === art.label.toLowerCase() ? INK : art.accent;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={art.label} {...o} strokeWidth={4} />
      <text x={x + w / 2} y={y + 15} textAnchor="middle" fontSize="9" fontWeight={700} fill={ink} className="font-body" style={{ textTransform: "uppercase" }}>
        TRADER JOE’S
      </text>
      <text x={x + w / 2} y={y + 34} textAnchor="middle" fontSize="16" fill={ink} className="display">
        {art.title[0]}
      </text>
      <text x={x + w / 2} y={y + 51} textAnchor="middle" fontSize="16" fill={ink} className="display">
        {art.title[1]}
      </text>
    </g>
  );
}

export function Package({ art, className = "" }: { art: PackArt; className?: string }) {
  let body: React.ReactNode;
  switch (art.shape) {
    case "box":
      body = (
        <>
          <path d="M26 30l14-12h96l-14 12z" fill={art.accent} {...o} />
          <path d="M122 30l14-12v152l-14 12z" fill={art.accent} {...o} />
          <rect x="26" y="30" width="96" height="152" fill={art.body} {...o} />
          <Label art={art} x={34} y={42} w={80} h={58} />
          <Motif motif={art.motif} accent={art.accent} cx={74} cy={140} s={1.05} />
        </>
      );
      break;
    case "bag":
      body = (
        <>
          <path d="M32 24h96l8 156c-32 10-80 10-112 0z" fill={art.body} {...o} />
          <path d="M32 24h96l-2 14H34z" fill={art.accent} {...o} />
          <Label art={art} x={42} y={50} w={76} h={58} />
          <Motif motif={art.motif} accent={art.accent} cx={80} cy={146} s={1} />
        </>
      );
      break;
    case "pouch":
      body = (
        <>
          <path d="M34 30c0-8 6-12 12-12h68c6 0 12 4 12 12v138c-2 8-10 12-16 12H50c-6 0-14-4-16-12z" fill={art.body} {...o} />
          <path d="M40 36h80" fill="none" stroke={INK} strokeWidth="3" strokeDasharray="4 4" />
          <Label art={art} x={44} y={48} w={72} h={58} />
          <Motif motif={art.motif} accent={art.accent} cx={80} cy={146} s={0.95} />
        </>
      );
      break;
    case "tub":
      body = (
        <>
          <path d="M22 72h116l-8 108H30z" fill={art.body} {...o} />
          <rect x="16" y="54" width="128" height="22" fill={art.accent} {...o} />
          <Label art={art} x={34} y={88} w={92} h={58} />
          <Motif motif={art.motif} accent={art.accent} cx={80} cy={166} s={0.7} />
        </>
      );
      break;
    case "tin":
      body = (
        <>
          <rect x="22" y="44" width="116" height="138" rx="8" fill={art.body} {...o} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${30 + i * 19} 178l22-130`} stroke={art.accent} strokeWidth="8" />
          ))}
          <rect x="22" y="44" width="116" height="138" rx="8" fill="none" {...o} />
          <rect x="18" y="32" width="124" height="24" fill={art.label} {...o} />
          <Label art={art} x={36} y={78} w={88} h={58} />
        </>
      );
      break;
    case "bottle":
      body = (
        <>
          <rect x="66" y="6" width="28" height="18" fill={art.accent} {...o} />
          <path d="M68 24h24v22c0 10 26 16 26 34v96c0 6-4 8-10 8H52c-6 0-10-2-10-8V80c0-18 26-24 26-34z" fill={art.body} {...o} />
          <Label art={art} x={46} y={96} w={68} h={58} />
          <Motif motif={art.motif} accent={art.accent} cx={80} cy={170} s={0.5} />
        </>
      );
      break;
  }
  return (
    <svg viewBox="0 0 160 200" className={className} role="img" aria-label={`${art.title.join(" ")} package`}>
      {body}
    </svg>
  );
}
