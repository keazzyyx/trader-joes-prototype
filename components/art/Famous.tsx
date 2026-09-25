/* The six regulars as flat cutouts. Thick ink outlines, flat fills, no shadow, no background. */

const INK = "#151515";
const o = { stroke: INK, strokeWidth: 5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const Brand = ({ y, fill, x = 80 }: { y: number; fill: string; x?: number }) => (
  <text x={x} y={y} textAnchor="middle" fontSize="9" fontWeight={700} fill={fill} className="font-body">
    TRADER JOE’S
  </text>
);
const Big = ({ y, fill, size = 16, children, x = 80 }: { y: number; fill: string; size?: number; children: React.ReactNode; x?: number }) => (
  <text x={x} y={y} textAnchor="middle" fontSize={size} fill={fill} className="display">
    {children}
  </text>
);

export function BagelSeasoning() {
  const seeds = Array.from({ length: 60 }, (_, i) => [54 + ((i * 37) % 54), 134 + ((i * 53) % 44), i % 3]);
  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="Everything but the Bagel Sesame Seasoning Blend jar">
      <rect x="48" y="30" width="64" height="26" fill={INK} {...o} />
      <path d="M44 56h72c4 0 6 3 6 7v118c0 6-4 9-9 9H47c-5 0-9-3-9-9V63c0-4 2-7 6-7z" fill="#EFE7D6" {...o} />
      {seeds.map(([x, y, k], i) => (
        <ellipse key={i} cx={x} cy={y} rx={k === 2 ? 2 : 1.4} ry="1" fill={k === 0 ? INK : k === 1 ? "#E8C978" : "#8a6a3a"} transform={`rotate(${i * 29} ${x} ${y})`} />
      ))}
      <rect x="42" y="70" width="76" height="60" fill="#FFFFFF" {...o} strokeWidth={4} />
      <rect x="42" y="70" width="76" height="12" fill="#C24A21" {...o} strokeWidth={4} />
      <Big y={102} fill={INK} size={15}>Everything</Big>
      <text x="80" y="112" textAnchor="middle" fontSize="8" fontWeight={700} fill="#C24A21" className="font-body">but the</text>
      <Big y={126} fill={INK} size={17}>Bagel</Big>
    </svg>
  );
}

export function OrangeChicken() {
  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="Mandarin Orange Chicken bag">
      <path d="M22 26c0-4 2-6 6-6h104c4 0 6 2 6 6l4 156c-38 10-82 10-120 0z" fill="#F07C1B" {...o} />
      <path d="M22 20h116v18H22z" fill="#D8342B" {...o} />
      <Brand y={33} fill="#FFF3DC" />
      <Big y={62} fill="#FFF7E8" size={20}>Mandarin</Big>
      <Big y={82} fill="#FFF7E8" size={20}>Orange</Big>
      <Big y={102} fill="#FFF7E8" size={20}>Chicken</Big>
      <ellipse cx="80" cy="144" rx="44" ry="28" fill="#FFF3DC" {...o} strokeWidth={4} />
      {[
        [64, 136, 10],
        [86, 132, 11],
        [100, 146, 9],
        [70, 154, 10],
        [90, 156, 9],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#B8561E" : "#C9651F"} {...o} strokeWidth={3} />
      ))}
    </svg>
  );
}

export function CookieButter() {
  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="Speculoos Cookie Butter jar">
      <rect x="38" y="44" width="84" height="26" fill="#C8102E" {...o} />
      <path d="M38 70h84c4 0 6 3 6 7v104c0 7-5 11-12 11H44c-7 0-12-4-12-11V77c0-4 2-7 6-7z" fill="#A9652D" {...o} />
      <rect x="36" y="94" width="88" height="72" fill="#F6E6C9" {...o} strokeWidth={4} />
      <Brand y={108} fill="#9A4A1C" />
      <Big y={130} fill="#6A3212" size={18}>Speculoos</Big>
      <Big y={148} fill="#C8102E" size={15}>Cookie Butter</Big>
    </svg>
  );
}

export function CauliflowerGnocchi() {
  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="Cauliflower Gnocchi bag">
      <path d="M26 22h108l4 162c-36 10-80 10-116 0z" fill="#5B8C3A" {...o} />
      <path d="M26 22h108v14H26z" fill="#3F6B28" {...o} />
      <Brand y={33} fill="#EAF3D8" />
      <Big y={64} fill="#FFFFFF" size={20}>Cauliflower</Big>
      <Big y={86} fill="#F8E7A0" size={22}>Gnocchi</Big>
      <circle cx="80" cy="136" r="36" fill="#EAF3D8" {...o} strokeWidth={4} />
      {[
        [66, 126],
        [84, 120],
        [96, 132],
        [72, 142],
        [90, 146],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="10" fill="#FFFDF2" {...o} strokeWidth={3} />
      ))}
    </svg>
  );
}

export function UnexpectedCheddar() {
  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="Unexpected Cheddar cheese wedge">
      <path d="M18 150L128 94l16 8v72L18 192z" fill="#F2B53A" {...o} />
      <path d="M18 150L128 94l16 8L34 160z" fill="#F7CE6A" {...o} />
      {[
        [70, 172, 5],
        [104, 156, 4],
        [50, 180, 3],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#D99A22" />
      ))}
      <g transform="rotate(-6 80 90)">
        <rect x="38" y="52" width="84" height="66" fill={INK} {...o} />
        <Brand y={70} fill="#F2B53A" />
        <Big y={92} fill="#FFFFFF" size={17}>Unexpected</Big>
        <Big y={110} fill="#F2B53A" size={19}>Cheddar</Big>
      </g>
    </svg>
  );
}

export function ChiliOnionCrunch() {
  const bits = Array.from({ length: 34 }, (_, i) => [50 + ((i * 41) % 60), 122 + ((i * 29) % 56)]);
  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="Chili Onion Crunch jar">
      <rect x="46" y="58" width="68" height="24" fill={INK} {...o} />
      <path d="M48 82h64c4 0 6 3 6 6v94c0 6-4 10-10 10H52c-6 0-10-4-10-10V88c0-3 2-6 6-6z" fill="#A3200F" {...o} />
      {bits.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 2.4 : 1.6} fill={i % 3 === 0 ? "#E8A13A" : i % 3 === 1 ? "#5A0B06" : "#F2C94C"} />
      ))}
      <rect x="42" y="96" width="76" height="54" fill="#F4E9D2" {...o} strokeWidth={4} />
      <Brand y={110} fill="#A3200F" />
      <Big y={130} fill={INK} size={15}>Chili Onion</Big>
      <Big y={146} fill="#C8102E" size={17}>Crunch</Big>
    </svg>
  );
}
