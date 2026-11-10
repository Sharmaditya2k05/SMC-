import { DrawPath, PopIn } from "./motion";

/**
 * Hero backdrop: a coordinate plane on which a cubic plots itself, with its
 * tangent at one point – "one concept at a time".
 */
export function HeroPlot() {
  return (
    <svg viewBox="0 0 560 620" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="hp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="var(--grid)" strokeWidth="1" />
        </pattern>
        <marker id="hp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="var(--muted)" />
        </marker>
      </defs>
      <rect width="560" height="620" fill="url(#hp-grid)" />
      {/* axes */}
      <path d="M20 500H540" stroke="var(--muted)" strokeWidth="1" opacity=".55" markerEnd="url(#hp-arrow)" />
      <path d="M60 600V20" stroke="var(--muted)" strokeWidth="1" opacity=".55" markerEnd="url(#hp-arrow)" />
      {[140, 220, 300, 380, 460].map((x) => (
        <path key={x} d={`M${x} 496v8`} stroke="var(--muted)" opacity=".55" />
      ))}
      {[420, 340, 260, 180, 100].map((y) => (
        <path key={y} d={`M56 ${y}h8`} stroke="var(--muted)" opacity=".55" />
      ))}
      <text x="528" y="524" fontSize="15" fill="var(--muted)" fontFamily="var(--font-serif)" fontStyle="italic">x</text>
      <text x="72" y="32" fontSize="15" fill="var(--muted)" fontFamily="var(--font-serif)" fontStyle="italic">y</text>
      {/* the curve and its tangent */}
      <DrawPath d="M20 560 C 150 560, 170 120, 300 150 S 430 470, 548 60" stroke="var(--blue)" width={2.25} delay={0.5} />
      <DrawPath d="M392 430 L 540 96" stroke="var(--gold-ink)" width={1.5} delay={2.1} dash="5 6" />
      <PopIn delay={2.2}>
        <circle cx="478" cy="236" r="6" fill="var(--gold)" stroke="var(--bg)" strokeWidth="2" />
      </PopIn>
      <PopIn delay={2.5}>
        <text x="408" y="222" fontSize="17" fill="var(--gold-ink)" fontFamily="var(--font-serif)" fontStyle="italic">f′(a)</text>
      </PopIn>
    </svg>
  );
}

/** Shown in the portrait frame until the teacher's photograph is added. */
export function ConstructionArt({ label = "S.M.C" }: { label?: string }) {
  return (
    <svg viewBox="0 0 400 500" className="h-full w-full bg-[#101C35]" role="img" aria-label="Geometric construction with the S.M.C monogram">
      <defs>
        <pattern id="ca-grid" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M25 0H0V25" fill="none" stroke="rgba(248,246,240,.055)" />
        </pattern>
      </defs>
      <rect width="400" height="500" fill="url(#ca-grid)" />
      <g fill="none" stroke="#D4B477" strokeWidth="1">
        <circle cx="155" cy="220" r="90" opacity=".85" />
        <circle cx="245" cy="220" r="90" opacity=".85" />
        <path d="M155 220H245L200 142.06z" stroke="#F8F6F0" opacity=".9" />
        <path d="M200 142.06V297.94" strokeDasharray="4 5" opacity=".6" />
        <path d="M40 220H360" strokeDasharray="2 6" opacity=".4" />
        <circle cx="200" cy="194" r="26" stroke="#8FB0F0" opacity=".8" />
      </g>
      <g fill="#D4B477">
        <circle cx="155" cy="220" r="3" /><circle cx="245" cy="220" r="3" /><circle cx="200" cy="142.06" r="3" /><circle cx="200" cy="297.94" r="3" />
      </g>
      <g fontFamily="var(--font-serif)" fontStyle="italic" fontSize="14" fill="rgba(248,246,240,.7)">
        <text x="138" y="240">A</text><text x="252" y="240">B</text><text x="206" y="134">C</text>
      </g>
      <text x="200" y="400" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="52" fill="#F8F6F0" letterSpacing="2">{label}</text>
      <text x="200" y="432" textAnchor="middle" fontFamily="var(--font-display)" fontSize="12.5" fill="rgba(248,246,240,.6)" letterSpacing="1.5">Siddhu Mathematics Classes</text>
    </svg>
  );
}

/** Small line drawings for the four "what makes S.M.C different" cards. */
export function Glyph({ kind }: { kind: "clarity" | "structure" | "practice" | "attention" }) {
  const common = { fill: "none", stroke: "var(--blue)", strokeWidth: 1.5, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 96 64" className="h-16 w-24" aria-hidden="true">
      <path d="M4 56H92M12 60V4" stroke="var(--line)" strokeWidth="1" />
      {kind === "clarity" && (
        <>
          <path d="M12 52C36 52 44 12 88 10" {...common} />
          <path d="M30 50L74 8" stroke="var(--gold-ink)" strokeWidth="1.25" strokeDasharray="3 4" />
          <circle cx="52" cy="29" r="3.5" fill="var(--gold)" />
        </>
      )}
      {kind === "structure" && (
        <>
          <path d="M12 48H32V36H52V24H72V12H90" {...common} />
          {[22, 42, 62, 81].map((x, i) => (
            <circle key={x} cx={x} cy={48 - i * 12} r="2.5" fill="var(--gold)" />
          ))}
        </>
      )}
      {kind === "practice" && (
        <>
          <path d="M12 50C22 20 30 20 38 38S54 52 62 30S78 14 90 22" {...common} />
          <path d="M12 38H90" stroke="var(--gold-ink)" strokeWidth="1" strokeDasharray="2 5" />
          {[38, 62].map((x) => (
            <circle key={x} cx={x} cy={x === 38 ? 38 : 30} r="2.5" fill="var(--gold)" />
          ))}
        </>
      )}
      {kind === "attention" && (
        <>
          {[0, 1, 2, 3, 4].flatMap((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => <circle key={`${r}-${c}`} cx={20 + c * 11} cy={8 + r * 10} r="1.4" fill="var(--muted)" opacity=".5" />))}
          <circle cx="53" cy="28" r="9" {...common} />
          <circle cx="53" cy="28" r="3.5" fill="var(--gold)" />
        </>
      )}
    </svg>
  );
}

/** Four-stage progression diagram for the methodology page. */
export function ProgressionCurve() {
  const pts = [
    { x: 90, y: 250, n: "01" },
    { x: 330, y: 190, n: "02" },
    { x: 570, y: 120, n: "03" },
    { x: 810, y: 50, n: "04" },
  ];
  return (
    <svg viewBox="0 0 900 300" className="w-full" aria-hidden="true">
      <defs>
        <pattern id="pc-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0H0V30" fill="none" stroke="var(--grid)" />
        </pattern>
      </defs>
      <rect width="900" height="300" fill="url(#pc-grid)" />
      <path d="M30 280H880M30 280V20" stroke="var(--muted)" opacity=".5" />
      <DrawPath d="M30 268 C 120 262, 200 230, 330 190 S 520 150, 570 120 S 740 60, 870 36" stroke="var(--blue)" width={2.25} />
      {pts.map((p, i) => (
        <PopIn key={p.n} delay={0.4 + i * 0.35}>
          <path d={`M${p.x} ${p.y}V280`} stroke="var(--gold-ink)" strokeDasharray="3 5" opacity=".7" />
          <circle cx={p.x} cy={p.y} r="7" fill="var(--gold)" stroke="var(--bg)" strokeWidth="2.5" />
          <text x={p.x + 12} y={p.y - 12} fontFamily="var(--font-serif)" fontSize="20" fill="var(--ink)">{p.n}</text>
        </PopIn>
      ))}
      <text x="866" y="270" textAnchor="end" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="14" fill="var(--muted)">practice →</text>
      <text x="40" y="34" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="14" fill="var(--muted)">understanding ↑</text>
    </svg>
  );
}
