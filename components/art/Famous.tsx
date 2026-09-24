/* Bespoke packaging for the six famous regulars. Packaging colors are exempt from the site palette. */

const Shadow = () => <ellipse cx="80" cy="192" rx="58" ry="6" fill="#1f1a17" opacity=".2" />;
const Brand = ({ x = 80, y, fill, size = 9 }: { x?: number; y: number; fill: string; size?: number }) => (
  <text x={x} y={y} textAnchor="middle" fontSize={size} fontStyle="italic" fontWeight={700} fill={fill} className="font-wonk">
    Trader Joe&rsquo;s
  </text>
);

export function BagelSeasoning() {
  const seeds = Array.from({ length: 70 }, (_, i) => [52 + ((i * 37) % 58), 132 + ((i * 53) % 48), i % 3]);
  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="Everything but the Bagel Sesame Seasoning Blend jar">
      <Shadow />
      <rect x="50" y="36" width="60" height="22" rx="4" fill="#161311" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <path key={i} d={`M${54 + i * 6.5} 38v18`} stroke="#3a3430" strokeWidth="1.4" />
      ))}
      <path d="M46 58h68c4 0 6 3 6 7v118c0 6-4 9-9 9H49c-5 0-9-3-9-9V65c0-4 2-7 6-7z" fill="#EDE6DA" opacity=".55" />
      <path d="M46 126h68v58c0 5-4 8-9 8H49c-5 0-9-3-9-8z" fill="#EFE7D6" />
      {seeds.map(([x, y, k], i) => (
        <ellipse key={i} cx={x} cy={y} rx={k === 2 ? 1.6 : 1.1} ry={0.8} fill={k === 0 ? "#1b1b1b" : k === 1 ? "#F4E3B5" : "#8a6a3a"} transform={`rotate(${i * 29} ${x} ${y})`} />
      ))}
      <rect x="42" y="72" width="76" height="62" rx="3" fill="#FFFFFF" />
      <rect x="42" y="72" width="76" height="10" fill="#C24A21" />
      <Brand y={80.5} fill="#FFFFFF" size={7.5} />
      <text x="80" y="96" textAnchor="middle" fontSize="10.5" fontWeight={800} fill="#2B2B2B" className="font-display">Everything</text>
      <text x="80" y="107" textAnchor="middle" fontSize="8.5" fontStyle="italic" fill="#C24A21" className="font-display">but the</text>
      <text x="80" y="119" textAnchor="middle" fontSize="12" fontWeight={800} fill="#2B2B2B" className="font-display">Bagel</text>
      <text x="80" y="129" textAnchor="middle" fontSize="4.4" fill="#555" className="font-body">SESAME SEASONING BLEND</text>
      <path d="M110 64c2 30 2 80 0 120" stroke="#fff" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function OrangeChicken() {
  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="Mandarin Orange Chicken bag">
      <Shadow />
      <path d="M24 28c0-4 2-6 6-6h100c4 0 6 2 6 6l4 156c-38 10-82 10-120 0z" fill="#F07C1B" />
      <path d="M24 22h112v14H24z" fill="#D8342B" />
      <path d="M26 24h108" stroke="#fff" strokeOpacity=".35" strokeWidth="1" strokeDasharray="2 2" />
      <Brand y={33} fill="#FFF3DC" size={8.5} />
      <text x="80" y="58" textAnchor="middle" fontSize="15" fontWeight={800} fill="#FFF7E8" className="font-wonk">Mandarin</text>
      <text x="80" y="74" textAnchor="middle" fontSize="15" fontWeight={800} fill="#FFF7E8" className="font-wonk">Orange</text>
      <text x="80" y="91" textAnchor="middle" fontSize="15" fontWeight={800} fill="#FFF7E8" className="font-wonk">Chicken</text>
      <ellipse cx="80" cy="140" rx="46" ry="30" fill="#FFF3DC" />
      <ellipse cx="80" cy="140" rx="40" ry="24" fill="#F7E9CF" stroke="#E0C9A0" />
      {[
        [64, 132, 10], [84, 128, 11], [100, 140, 9], [70, 150, 11], [90, 152, 10], [78, 140, 8],
      ].map(([x, y, r], i) => (
        <path key={i} d={`M${x - r} ${y}c0-${r * 0.8} ${r * 0.6}-${r} ${r}-${r}s${r} ${r * 0.3} ${r} ${r}-${r * 0.5} ${r * 0.8}-${r} ${r * 0.8}-${r}-${r * 0.2}-${r}-${r * 0.8}z`} fill={i % 2 ? "#B8561E" : "#C9651F"} stroke="#8A3A12" strokeWidth=".8" />
      ))}
      {[[70, 128], [92, 136], [80, 150], [100, 146]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="#3E8B3A" />
      ))}
      <text x="80" y="182" textAnchor="middle" fontSize="6" fill="#FFF3DC" className="font-body">CRISPY CHICKEN, SAUCE INSIDE</text>
    </svg>
  );
}

export function CookieButter() {
  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="Speculoos Cookie Butter jar">
      <Shadow />
      <rect x="40" y="46" width="80" height="22" rx="5" fill="#C8102E" />
      <rect x="40" y="46" width="80" height="6" rx="3" fill="#E23A52" opacity=".6" />
      <path d="M40 70h80c4 0 6 3 6 7v104c0 7-5 11-12 11H46c-7 0-12-4-12-11V77c0-4 2-7 6-7z" fill="#A9652D" />
      <path d="M36 80c14-4 30 4 44 0s30-4 44 0v6H36z" fill="#8E5122" />
      <rect x="38" y="96" width="84" height="70" rx="3" fill="#F6E6C9" />
      <Brand y={108} fill="#9A4A1C" size={8} />
      <text x="80" y="124" textAnchor="middle" fontSize="12" fontWeight={800} fill="#6A3212" className="font-display">Speculoos</text>
      <text x="80" y="138" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#C8102E" className="font-wonk">Cookie Butter</text>
      <rect x="62" y="144" width="36" height="16" rx="2" fill="#C98A4B" stroke="#8E5122" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${66 + i * 8} 147v10`} stroke="#8E5122" strokeWidth=".8" />
      ))}
      <path d="M118 80c2 30 2 70 0 100" stroke="#fff" strokeOpacity=".3" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function CauliflowerGnocchi() {
  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="Cauliflower Gnocchi bag">
      <Shadow />
      <path d="M28 24h104l4 160c-36 10-76 10-112 0z" fill="#5B8C3A" />
      <path d="M28 24h104v12H28z" fill="#3F6B28" />
      <Brand y={33} fill="#EAF3D8" size={8.5} />
      <text x="80" y="58" textAnchor="middle" fontSize="16" fontWeight={800} fill="#FFFFFF" className="font-wonk">Cauliflower</text>
      <text x="80" y="78" textAnchor="middle" fontSize="18" fontStyle="italic" fontWeight={700} fill="#F8E7A0" className="font-wonk">Gnocchi</text>
      <circle cx="80" cy="132" r="34" fill="#EAF3D8" />
      {[
        [68, 124], [82, 118], [94, 128], [74, 138], [88, 140], [80, 130],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="#FFFDF2" stroke="#C9C2A0" />
          <circle cx={x - 3} cy={y - 2} r="3" fill="#F1ECD3" />
        </g>
      ))}
      <path d="M72 150c4 6 12 6 16 0" stroke="#5B8C3A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <text x="80" y="182" textAnchor="middle" fontSize="6" fill="#EAF3D8" className="font-body">MOSTLY CAULIFLOWER. REALLY.</text>
    </svg>
  );
}

export function UnexpectedCheddar() {
  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="Unexpected Cheddar cheese wedge">
      <Shadow />
      <path d="M20 150L128 96l14 8v70L20 190z" fill="#F2B53A" />
      <path d="M20 150L128 96l14 8L34 158z" fill="#F7CE6A" />
      <path d="M20 150l14 8v32l-14-4z" fill="#D99A22" />
      {[[70, 170, 4], [100, 156, 3], [52, 176, 2.5], [118, 150, 2.4]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} fill="#D99A22" />
      ))}
      <path d="M44 126l76-38 18 10-76 38z" fill="#141414" />
      <path d="M40 60h80v58H40z" fill="#141414" transform="rotate(-6 80 90)" />
      <g transform="rotate(-6 80 90)">
        <Brand y={76} fill="#F2B53A" size={8} />
        <text x="80" y="95" textAnchor="middle" fontSize="12" fontWeight={800} fill="#FFFFFF" className="font-wonk">Unexpected</text>
        <text x="80" y="111" textAnchor="middle" fontSize="13" fontWeight={800} fill="#F2B53A" className="font-wonk">Cheddar</text>
      </g>
    </svg>
  );
}

export function ChiliOnionCrunch() {
  const bits = Array.from({ length: 40 }, (_, i) => [50 + ((i * 41) % 60), 120 + ((i * 29) % 60)]);
  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="Chili Onion Crunch jar">
      <Shadow />
      <rect x="48" y="62" width="64" height="20" rx="4" fill="#1B1B1B" />
      <path d="M50 84h60c4 0 6 3 6 6v92c0 6-4 10-10 10H54c-6 0-10-4-10-10V90c0-3 2-6 6-6z" fill="#7A1510" />
      <path d="M44 110h72v72c0 6-4 10-10 10H54c-6 0-10-4-10-10z" fill="#A3200F" />
      {bits.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 1.8 : 1.1} fill={i % 3 === 0 ? "#E8A13A" : i % 3 === 1 ? "#5A0B06" : "#F2C94C"} />
      ))}
      <rect x="44" y="96" width="72" height="52" rx="2" fill="#F4E9D2" />
      <Brand y={108} fill="#A3200F" size={7.5} />
      <text x="80" y="124" textAnchor="middle" fontSize="11.5" fontWeight={800} fill="#2A0E0A" className="font-wonk">Chili Onion</text>
      <text x="80" y="139" textAnchor="middle" fontSize="13" fontWeight={800} fill="#C8102E" className="font-wonk">Crunch</text>
      <path d="M110 90c2 30 2 60 0 90" stroke="#fff" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
