/** Small plotted graphs used on cards. `tone="dark"` is for charcoal surfaces. */
export function MiniGraph({ kind, label, tone = "light", className = "h-24 w-full" }: { kind: "parabola" | "steps" | "sine" | "recip" | "cos"; label?: React.ReactNode; tone?: "light" | "dark"; className?: string }) {
  const axis = tone === "dark" ? "rgba(255,255,255,.75)" : "var(--ink)";
  const curve = { fill: "none", stroke: "#F5861F", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  // origin position differs per graph, like in a textbook sketch
  const ox = kind === "sine" || kind === "cos" ? 26 : kind === "steps" ? 30 : 70;
  const oy = kind === "parabola" || kind === "steps" ? 74 : 50;
  return (
    <svg viewBox="0 0 180 90" className={className} aria-hidden="true">
      <g stroke={axis} strokeWidth="1.1" fill={axis}>
        <path d={`M${ox} 86V8`} fill="none" />
        <path d={`M10 ${oy}H160`} fill="none" />
        <path d={`M${ox} 5l-3.5 6h7z`} stroke="none" />
        <path d={`M164 ${oy}l-6-3.500v7z`} stroke="none" />
      </g>
      <g fontFamily="var(--font-serif)" fontStyle="italic" fontSize="11" fill={axis}>
        <text x={ox + 6} y="12">y</text>
        <text x="166" y={oy + 12}>x</text>
        {label && <text x="112" y="16" fontSize="12">{label}</text>}
      </g>
      {kind === "parabola" && <path d="M34 14C46 94 94 94 106 14" {...curve} />}
      {kind === "steps" && (
        <g {...curve}>
          <path d="M40 62h26M66 48h26M92 34h26M118 20h26" />
          {[66, 92, 118, 144].map((x, i) => (
            <circle key={x} cx={x} cy={62 - i * 14} r="2.6" fill="var(--surface)" />
          ))}
        </g>
      )}
      {kind === "sine" && <path d="M26 50c12-36 26-36 40 0s28 36 40 0s26-36 40 0" {...curve} />}
      {kind === "cos" && <path d="M26 20c14 0 22 60 40 60s26-60 40-60s26 60 40 60" {...curve} />}
      {kind === "recip" && (
        <g {...curve}>
          <path d="M76 10c2 24 12 32 78 35" />
          <path d="M64 86c-2-22-10-28-50-31" />
        </g>
      )}
    </svg>
  );
}

/** (a + b)² as an area. `tone="dark"` draws it in orange lines for charcoal sections. */
export function SquareIdentity({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const line = dark ? "#F5861F" : "var(--ink)";
  const text = dark ? "#F5861F" : "var(--ink)";
  const dim = dark ? "rgba(255,255,255,.8)" : "var(--muted)";
  return (
    <figure className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center lg:gap-8">
      <svg viewBox="0 0 190 170" className="w-44 shrink-0" role="img" aria-label="A square of side a plus b divided into a squared, two rectangles of area a b, and b squared">
        <g fill={dark ? "none" : "var(--xii-soft)"} stroke={line} strokeWidth="2">
          <rect x="44" y="34" width="74" height="64" />
          <rect x="118" y="34" width="56" height="64" fill={dark ? "none" : "var(--surface)"} />
          <rect x="44" y="98" width="74" height="54" fill={dark ? "none" : "var(--surface)"} />
          <rect x="118" y="98" width="56" height="54" />
        </g>
        <g fontFamily="var(--font-serif)" fontStyle="italic" fontSize="19" fill={text} textAnchor="middle">
          <text x="81" y="73">a²</text><text x="146" y="73">ab</text><text x="81" y="132">ab</text><text x="146" y="132">b²</text>
        </g>
        <g fontFamily="var(--font-serif)" fontStyle="italic" fontSize="16" fill={dim} textAnchor="middle">
          <text x="81" y="14">a</text><text x="146" y="14">b</text><text x="16" y="70">a</text><text x="16" y="130">b</text>
        </g>
        <g stroke={dim} strokeWidth="1" fill="none">
          <path d="M46 24h70M120 24h52M32 36v60M32 100v50" />
        </g>
      </svg>
      <figcaption className={`math rounded-lg border-2 px-5 py-2.5 text-xl sm:text-2xl ${dark ? "border-[#F5861F] text-white" : "border-accent"}`}>
        (a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup>
      </figcaption>
    </figure>
  );
}

/** Empty-state trophy with laurels (Results page). */
export function Trophy({ className = "w-64" }: { className?: string }) {
  const leaf = (x: number, y: number, r: number) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="4.5" ry="10" transform={`rotate(${r} ${x} ${y})`} fill="#F5861F" opacity=".85" />;
  return (
    <svg viewBox="0 0 260 150" className={className} fill="none" aria-hidden="true">
      <g stroke="#F5861F" strokeWidth="3" strokeLinecap="round">
        <path d="M130 6v14M104 14l8 12M156 14l-8 12" />
      </g>
      <g stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M100 42h60v26c0 18-13 31-30 31s-30-13-30-31z" fill="var(--surface)" />
        <path d="M100 50H84c0 16 6 26 18 28M160 50h16c0 16-6 26-18 28" />
        <path d="M130 99v18M108 132h44l-6-15h-32z" fill="var(--surface)" />
      </g>
      <path d="M130 54l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3-9.3-4.9-9.3 4.9 1.8-10.3-7.5-7.3 10.4-1.500z" stroke="#F5861F" strokeWidth="3" strokeLinejoin="round" />
      <path d="M62 128C40 108 38 78 52 52M198 128c22-20 24-50 10-76" stroke="#F5861F" strokeWidth="2" />
      {[[48, 62, -20], [42, 82, -8], [44, 102, 10], [54, 120, 30], [64, 70, 35], [60, 92, 45]].map(([x, y, r]) => leaf(x, y, r))}
      {[[212, 62, 20], [218, 82, 8], [216, 102, -10], [206, 120, -30], [196, 70, -35], [200, 92, -45]].map(([x, y, r]) => leaf(x, y, r))}
      <ellipse cx="130" cy="140" rx="46" ry="5" fill="var(--xii-soft)" />
    </svg>
  );
}

/** Empty-state photo stack (Gallery page). */
export function PhotoStack({ className = "w-40" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} fill="none" aria-hidden="true">
      <g stroke="#F5861F" strokeWidth="3" strokeLinecap="round">
        <path d="M80 4v12M58 10l7 11M102 10l-7 11" />
      </g>
      <rect x="52" y="40" width="80" height="60" rx="6" transform="rotate(8 92 70)" stroke="var(--ink)" strokeWidth="3.5" fill="var(--surface)" />
      <rect x="30" y="38" width="84" height="64" rx="6" stroke="var(--ink)" strokeWidth="3.5" fill="var(--surface)" />
      <circle cx="72" cy="58" r="7" stroke="#F5861F" strokeWidth="3" />
      <path d="M36 94l22-22 14 12 12-10 24 20" stroke="#F5861F" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** Large question mark drawn as an arc line (FAQ page). */
export function QuestionArc({ className = "w-40" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 200" className={className} fill="none" aria-hidden="true">
      <path d="M22 78C14 30 54 4 92 10c36 6 56 34 44 64-10 26-40 28-44 62" stroke="#F5861F" strokeWidth="3" strokeLinecap="round" />
      <circle cx="90" cy="178" r="14" stroke="#F5861F" strokeWidth="3" />
    </svg>
  );
}
