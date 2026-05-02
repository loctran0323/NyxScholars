/* eslint-disable react/no-unknown-property */
/**
 * Scenes — bespoke SVG illustrations, one per story beat.
 *
 * Each scene is a distinct composition: different palette weighting,
 * different dominant motif, different focal point. They share the brand
 * palette but never repeat the same arrangement, so the page does not
 * read as repeated stock placeholder art.
 *
 * All scenes are full-frame (preserveAspectRatio="xMidYMid slice") and
 * intended to live as a backdrop layer — typography sits on top of them
 * in the consuming page.
 */

import { cn } from "@/lib/utils";

const C = {
  ink: "#06090f",
  ink2: "#0a0e1a",
  ink3: "#111726",
  surface: "#1a2238",
  ivory: "#ede7d6",
  ivoryDim: "#c9c2ae",
  gold: "#c8a24b",
  goldHi: "#e8cc7e",
  goldDeep: "#8c6f2e",
  moon: "#7dd3fc",
};

type SceneProps = { className?: string };

/* ───────────────────────────────────────────────────────────
 * 01 · NIGHT SKY OBSERVATORY — hero scene.
 * Tall vertical composition: deep night above, distant city
 * silhouette below, a lit observatory dome on a hill, a fat
 * crescent moon sweeping the upper-right.
 * ─────────────────────────────────────────────────────────── */
export function SceneObservatory({ className }: SceneProps) {
  return (
    <svg
      viewBox="0 0 800 1100"
      preserveAspectRatio="xMidYMid slice"
      className={cn("absolute inset-0 w-full h-full", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="obs-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0a1230" />
          <stop offset="35%" stopColor="#0a0e1a" />
          <stop offset="75%" stopColor="#070a14" />
          <stop offset="100%" stopColor="#03050a" />
        </linearGradient>
        <radialGradient id="obs-moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.goldHi} stopOpacity="0.25" />
          <stop offset="60%" stopColor={C.gold} stopOpacity="0.06" />
          <stop offset="100%" stopColor={C.gold} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="obs-moon" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={C.goldHi} />
          <stop offset="55%" stopColor={C.gold} />
          <stop offset="100%" stopColor={C.goldDeep} />
        </linearGradient>
        <linearGradient id="obs-haze" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={C.moon} stopOpacity="0" />
          <stop offset="60%" stopColor={C.moon} stopOpacity="0.05" />
          <stop offset="100%" stopColor={C.moon} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="obs-hill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0d1426" />
          <stop offset="100%" stopColor="#03050a" />
        </linearGradient>
        <linearGradient id="obs-window" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={C.goldHi} stopOpacity="0.9" />
          <stop offset="100%" stopColor={C.gold} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <rect width="800" height="1100" fill="url(#obs-sky)" />

      {/* atmospheric haze band */}
      <rect x="0" y="500" width="800" height="300" fill="url(#obs-haze)" />

      {/* distant nebula wash */}
      <ellipse cx="180" cy="320" rx="280" ry="160" fill={C.moon} opacity="0.04" />
      <ellipse cx="640" cy="240" rx="220" ry="140" fill={C.gold} opacity="0.05" />

      {/* moon glow + moon */}
      <circle cx="630" cy="220" r="200" fill="url(#obs-moon-glow)" />
      <g transform="translate(630 220)">
        <circle r="78" fill="#070a14" />
        <path
          d="M -16 -78 A 78 78 0 1 0 -16 78 A 60 78 0 1 1 -16 -78 Z"
          fill="url(#obs-moon)"
        />
        <circle cx="20" cy="-30" r="3" fill={C.goldDeep} opacity="0.4" />
        <circle cx="32" cy="18" r="4.5" fill={C.goldDeep} opacity="0.35" />
        <circle cx="-6" cy="40" r="2.5" fill={C.goldDeep} opacity="0.45" />
      </g>

      {/* star field — varied sizes, sparse */}
      {[
        [60, 80, 1.4, 0.7], [140, 160, 0.8, 0.5], [220, 60, 1.2, 0.6],
        [300, 200, 0.6, 0.45], [380, 90, 1.6, 0.85], [460, 170, 0.7, 0.4],
        [80, 280, 0.9, 0.5], [200, 380, 1.1, 0.6], [340, 320, 0.6, 0.4],
        [480, 380, 1.3, 0.7], [560, 100, 0.8, 0.45], [720, 360, 0.7, 0.4],
        [90, 460, 1.0, 0.5], [260, 480, 1.4, 0.7], [410, 540, 0.8, 0.4],
        [180, 580, 0.9, 0.5], [550, 540, 1.1, 0.55], [690, 480, 0.7, 0.35],
        [110, 660, 0.8, 0.4], [380, 700, 1.0, 0.5], [620, 660, 0.9, 0.45],
        [50, 380, 0.6, 0.35], [510, 280, 1.5, 0.8],
      ].map(([x, y, r, o], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={C.ivory} opacity={o} />
      ))}

      {/* connecting constellation — Lyra-ish */}
      <g stroke={C.goldHi} strokeWidth="0.5" opacity="0.45" fill="none">
        <line x1="220" y1="60" x2="380" y2="90" />
        <line x1="380" y1="90" x2="510" y2="280" />
        <line x1="510" y1="280" x2="380" y2="90" />
      </g>
      <circle cx="510" cy="280" r="2.8" fill={C.goldHi} />
      <circle cx="380" cy="90" r="2.4" fill={C.goldHi} />
      <circle cx="220" cy="60" r="1.8" fill={C.goldHi} />

      {/* horizon hill silhouette */}
      <path
        d="M 0 880 Q 180 820, 360 850 Q 520 870, 640 810 Q 740 770, 800 800 L 800 1100 L 0 1100 Z"
        fill="url(#obs-hill)"
      />
      <path
        d="M 0 950 Q 220 920, 420 935 Q 620 945, 800 905 L 800 1100 L 0 1100 Z"
        fill="#020409"
      />

      {/* observatory dome on the hill */}
      <g transform="translate(440 770)">
        <ellipse cx="0" cy="32" rx="58" ry="10" fill="#06090f" opacity="0.6" />
        {/* base */}
        <rect x="-44" y="0" width="88" height="34" fill="#0a1020" stroke={C.goldDeep} strokeWidth="0.5" opacity="0.85" />
        {/* dome */}
        <path d="M -44 0 A 44 44 0 0 1 44 0 Z" fill="#0c1326" stroke={C.goldDeep} strokeWidth="0.6" />
        {/* slit + window glow */}
        <rect x="-3" y="-30" width="6" height="34" fill="url(#obs-window)" />
        <line x1="-44" y1="0" x2="44" y2="0" stroke={C.goldDeep} strokeWidth="0.5" opacity="0.6" />
        {/* tiny window on the base */}
        <rect x="-32" y="14" width="6" height="8" fill={C.goldHi} opacity="0.7" />
        <rect x="22" y="14" width="6" height="8" fill={C.goldHi} opacity="0.6" />
      </g>

      {/* ground reflection of moonlight */}
      <ellipse cx="630" cy="900" rx="160" ry="14" fill={C.gold} opacity="0.06" />
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────
 * 02 · TRAJECTORY — a hand-drawn ascending score curve set
 * against a faint grid, climbing from lower-left to upper-right.
 * Stars mark each data point. This is the page's "plot" beat.
 * ─────────────────────────────────────────────────────────── */
export function SceneTrajectory({ className }: SceneProps) {
  return (
    <svg
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      className={cn("absolute inset-0 w-full h-full", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="tr-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0d1226" />
          <stop offset="100%" stopColor="#04060c" />
        </linearGradient>
        <linearGradient id="tr-curve" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={C.moon} stopOpacity="0.85" />
          <stop offset="60%" stopColor={C.goldHi} stopOpacity="0.95" />
          <stop offset="100%" stopColor={C.gold} stopOpacity="1" />
        </linearGradient>
        <linearGradient id="tr-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={C.gold} stopOpacity="0.18" />
          <stop offset="100%" stopColor={C.gold} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="tr-burst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.goldHi} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.goldHi} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1000" height="600" fill="url(#tr-bg)" />

      {/* horizontal grid */}
      {[120, 200, 280, 360, 440, 520].map((y, i) => (
        <line key={i} x1="60" x2="940" y1={y} y2={y} stroke={C.ivory} strokeWidth="0.4" opacity="0.06" />
      ))}
      {/* vertical week ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 60 + (880 / 11) * i;
        return <line key={i} x1={x} x2={x} y1="120" y2="528" stroke={C.ivory} strokeWidth="0.3" opacity="0.04" />;
      })}

      {/* axis labels (typographic, like a real plot) */}
      <g fill={C.ivoryDim} opacity="0.5" fontSize="10" fontFamily="monospace" letterSpacing="2">
        <text x="60" y="100">1600</text>
        <text x="60" y="540" >1100</text>
        <text x="60" y="568" fontSize="9" opacity="0.7">WEEKS  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━&gt;</text>
      </g>

      {/* data points (each a star) */}
      {(() => {
        const pts = [
          [60, 480], [140, 460], [220, 440], [300, 405], [380, 360],
          [460, 330], [540, 300], [620, 260], [700, 220], [780, 175],
          [860, 145], [940, 125],
        ];
        const path = `M ${pts[0][0]} ${pts[0][1]} ` +
          pts.slice(1).map(([x, y], i) => {
            const [px, py] = pts[i];
            const cx1 = px + 40;
            const cx2 = x - 40;
            return `C ${cx1} ${py}, ${cx2} ${y}, ${x} ${y}`;
          }).join(" ");
        const fillPath = `${path} L 940 528 L 60 528 Z`;
        return (
          <>
            <path d={fillPath} fill="url(#tr-fill)" />
            <path d={path} fill="none" stroke="url(#tr-curve)" strokeWidth="2.5" strokeLinecap="round" />
            {pts.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="6" fill="url(#tr-burst)" />
                <path
                  d={`M ${x} ${y - 3.5} L ${x + 0.9} ${y - 0.9} L ${x + 3.5} ${y} L ${x + 0.9} ${y + 0.9} L ${x} ${y + 3.5} L ${x - 0.9} ${y + 0.9} L ${x - 3.5} ${y} L ${x - 0.9} ${y - 0.9} Z`}
                  fill={i === pts.length - 1 ? C.goldHi : C.ivory}
                  opacity={i === pts.length - 1 ? 1 : 0.85}
                />
              </g>
            ))}
            {/* target marker */}
            <line x1="940" y1="60" x2="940" y2="125" stroke={C.gold} strokeWidth="0.6" strokeDasharray="2 3" opacity="0.6" />
            <text x="900" y="55" fill={C.gold} fontSize="10" fontFamily="monospace" letterSpacing="2" opacity="0.85">TARGET 1480</text>
          </>
        );
      })()}

      {/* faint stars in the upper sky */}
      {[
        [120, 70, 0.9], [320, 50, 1.1], [560, 75, 0.8], [780, 40, 1.0],
        [200, 90, 0.6], [440, 60, 0.7], [680, 90, 0.5],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={C.ivory} opacity={0.4} />
      ))}
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────
 * 03 · STAR CHART — a vintage celestial chart, square-ish.
 * Used as a backdrop for the founders intro / brand voice.
 * Concentric ring system, ecliptic curve, named stars.
 * ─────────────────────────────────────────────────────────── */
export function SceneStarChart({ className }: SceneProps) {
  return (
    <svg
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
      className={cn("absolute inset-0 w-full h-full", className)}
      aria-hidden
    >
      <defs>
        <radialGradient id="sc-bg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#101a36" />
          <stop offset="55%" stopColor="#0a0e1a" />
          <stop offset="100%" stopColor="#04060c" />
        </radialGradient>
      </defs>
      <rect width="800" height="800" fill="url(#sc-bg)" />

      {/* concentric celestial rings */}
      {[100, 180, 260, 340].map((r, i) => (
        <circle
          key={i}
          cx="400"
          cy="400"
          r={r}
          fill="none"
          stroke={C.gold}
          strokeWidth="0.4"
          opacity={0.18 + i * 0.04}
        />
      ))}

      {/* ecliptic */}
      <ellipse cx="400" cy="400" rx="320" ry="100" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.35" strokeDasharray="3 4" transform="rotate(-12 400 400)" />

      {/* tick marks around outer ring */}
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const x1 = 400 + Math.cos(a) * 340;
        const y1 = 400 + Math.sin(a) * 340;
        const x2 = 400 + Math.cos(a) * (i % 3 === 0 ? 350 : 346);
        const y2 = 400 + Math.sin(a) * (i % 3 === 0 ? 350 : 346);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.gold} strokeWidth="0.5" opacity="0.5" />;
      })}

      {/* the constellation: Cassiopeia-like W of bright stars */}
      {(() => {
        const stars: [number, number, number, string?][] = [
          [240, 320, 4, "Caph"],
          [330, 380, 5, "Schedar"],
          [400, 320, 4.5, "Navi"],
          [480, 400, 3.8, "Ruchbah"],
          [560, 340, 3.6, "Segin"],
        ];
        return (
          <g>
            <polyline
              points={stars.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke={C.goldHi}
              strokeWidth="0.7"
              opacity="0.55"
            />
            {stars.map(([x, y, r, name], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r={r * 1.8} fill={C.goldHi} opacity="0.18" />
                <circle cx={x} cy={y} r={r * 0.9} fill={C.ivory} />
                {name ? (
                  <text x={x + 10} y={y + 4} fill={C.ivoryDim} fontSize="9" fontFamily="serif" fontStyle="italic" opacity="0.7">
                    {name}
                  </text>
                ) : null}
              </g>
            ))}
          </g>
        );
      })()}

      {/* secondary scattered stars */}
      {[
        [180, 220, 1.4], [620, 220, 1.1], [180, 580, 1.0], [620, 580, 1.5],
        [120, 400, 0.8], [680, 400, 0.9], [400, 140, 1.2], [400, 660, 1.1],
        [280, 540, 0.7], [520, 540, 0.6], [300, 240, 0.9], [500, 220, 0.8],
        [220, 460, 0.6], [580, 480, 0.7], [350, 580, 0.5], [450, 600, 0.5],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={C.ivory} opacity={0.3 + (r as number) * 0.15} />
      ))}

      {/* compass markers */}
      <g fill={C.gold} fontSize="11" fontFamily="serif" fontStyle="italic" opacity="0.65">
        <text x="400" y="55" textAnchor="middle">N</text>
        <text x="400" y="755" textAnchor="middle">S</text>
        <text x="50" y="405">W</text>
        <text x="745" y="405">E</text>
      </g>

      {/* central crescent monogram */}
      <g transform="translate(400 400)" opacity="0.85">
        <circle r="36" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.4" />
        <path
          d="M 12 -22 A 22 22 0 1 0 12 22 A 16 22 0 1 1 12 -22 Z"
          fill={C.goldHi}
          opacity="0.9"
        />
      </g>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────
 * 04 · LANTERN DESK — warm cinematic study scene.
 * Late-night silhouette: a desk in lower foreground, a glowing
 * lantern, an open book casting light on the page, a window with
 * the night beyond. Used for the manifesto / "where the work
 * happens" beats.
 * ─────────────────────────────────────────────────────────── */
export function SceneLanternDesk({ className }: SceneProps) {
  return (
    <svg
      viewBox="0 0 800 1100"
      preserveAspectRatio="xMidYMid slice"
      className={cn("absolute inset-0 w-full h-full", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="ld-room" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0c0f1a" />
          <stop offset="60%" stopColor="#070a12" />
          <stop offset="100%" stopColor="#040608" />
        </linearGradient>
        <linearGradient id="ld-window" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0d1430" />
          <stop offset="100%" stopColor="#04060c" />
        </linearGradient>
        <radialGradient id="ld-lantern" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.goldHi} stopOpacity="0.85" />
          <stop offset="40%" stopColor={C.gold} stopOpacity="0.4" />
          <stop offset="100%" stopColor={C.gold} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ld-page" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.ivory} stopOpacity="0.88" />
          <stop offset="60%" stopColor={C.ivory} stopOpacity="0.18" />
          <stop offset="100%" stopColor={C.ivory} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="1100" fill="url(#ld-room)" />

      {/* window with night sky beyond */}
      <g transform="translate(120 120)">
        <rect x="0" y="0" width="320" height="380" fill="url(#ld-window)" />
        {/* window frame */}
        <rect x="0" y="0" width="320" height="380" fill="none" stroke={C.goldDeep} strokeWidth="1.2" opacity="0.5" />
        <line x1="160" y1="0" x2="160" y2="380" stroke={C.goldDeep} strokeWidth="0.8" opacity="0.4" />
        <line x1="0" y1="190" x2="320" y2="190" stroke={C.goldDeep} strokeWidth="0.8" opacity="0.4" />
        {/* stars beyond */}
        {[
          [40, 60, 1.2], [220, 90, 0.9], [80, 140, 0.7], [260, 50, 1.0],
          [180, 220, 0.8], [60, 260, 0.6], [240, 280, 1.1], [140, 120, 0.5],
          [40, 320, 0.7], [280, 320, 0.6], [200, 340, 0.8], [110, 60, 0.6],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={C.ivory} opacity={0.55} />
        ))}
        {/* small moon in window */}
        <g transform="translate(250 90)">
          <circle r="22" fill="#04060c" />
          <path d="M -4 -22 A 22 22 0 1 0 -4 22 A 17 22 0 1 1 -4 -22 Z" fill={C.goldHi} opacity="0.9" />
        </g>
      </g>

      {/* desk surface */}
      <path
        d="M 0 720 L 800 720 L 800 760 L 0 760 Z"
        fill="#0a0d18"
      />
      <path
        d="M 0 760 L 800 760 L 800 1100 L 0 1100 Z"
        fill="#04060c"
      />
      <line x1="0" y1="720" x2="800" y2="720" stroke={C.goldDeep} strokeWidth="0.6" opacity="0.5" />

      {/* book — open on desk */}
      <g transform="translate(280 600)">
        {/* page light */}
        <ellipse cx="120" cy="140" rx="220" ry="140" fill="url(#ld-page)" />
        {/* book */}
        <path d="M 0 90 L 120 70 L 240 90 L 240 140 L 120 130 L 0 140 Z" fill="#1a1410" stroke={C.goldDeep} strokeWidth="0.6" />
        {/* pages */}
        <path d="M 4 88 L 120 72 L 236 88 L 236 134 L 120 124 L 4 134 Z" fill={C.ivory} opacity="0.85" />
        <line x1="120" y1="72" x2="120" y2="124" stroke={C.goldDeep} strokeWidth="0.5" opacity="0.4" />
        {/* faint text lines on the page */}
        {[80, 88, 96, 104, 112].map((y) => (
          <g key={y}>
            <line x1="14" y1={y} x2="110" y2={y - 1} stroke="#3a3528" strokeWidth="0.5" opacity="0.5" />
            <line x1="130" y1={y - 1} x2="226" y2={y} stroke="#3a3528" strokeWidth="0.5" opacity="0.5" />
          </g>
        ))}
      </g>

      {/* lantern on the right side of the desk */}
      <g transform="translate(600 540)">
        <ellipse cx="0" cy="240" rx="200" ry="130" fill="url(#ld-lantern)" />
        {/* base */}
        <rect x="-22" y="160" width="44" height="14" fill="#1a1410" stroke={C.goldDeep} strokeWidth="0.5" />
        {/* glass */}
        <path d="M -18 60 L -22 160 L 22 160 L 18 60 Z" fill="#0a0d18" stroke={C.gold} strokeWidth="0.6" opacity="0.95" />
        {/* flame glow */}
        <ellipse cx="0" cy="120" rx="14" ry="34" fill={C.goldHi} opacity="0.85" />
        <ellipse cx="0" cy="120" rx="6" ry="22" fill={C.ivory} opacity="0.95" />
        {/* top + handle */}
        <path d="M -18 60 L 18 60 L 14 50 L -14 50 Z" fill="#1a1410" />
        <path d="M -8 50 Q 0 30, 8 50" fill="none" stroke={C.goldDeep} strokeWidth="0.8" />
      </g>

      {/* a stack of papers, smaller, left foreground */}
      <g transform="translate(80 740)">
        <rect x="0" y="0" width="120" height="80" fill={C.ivoryDim} opacity="0.7" />
        <rect x="6" y="-6" width="120" height="80" fill={C.ivory} opacity="0.85" />
        {[12, 22, 32, 42, 54].map((y) => (
          <line key={y} x1="14" y1={y - 6} x2="116" y2={y - 6} stroke="#3a3528" strokeWidth="0.5" opacity="0.45" />
        ))}
      </g>

      {/* cup of tea (hint of warmth) */}
      <g transform="translate(420 700)">
        <ellipse cx="0" cy="14" rx="18" ry="3" fill="#1a1410" />
        <path d="M -16 14 L -14 -14 L 14 -14 L 16 14 Z" fill="#0d1320" stroke={C.goldDeep} strokeWidth="0.5" />
        <ellipse cx="0" cy="-14" rx="14" ry="3" fill="#1a1410" />
        {/* steam */}
        <path d="M -6 -22 Q -3 -32, 0 -28 Q 3 -36, 0 -46" fill="none" stroke={C.ivory} strokeWidth="0.6" opacity="0.35" />
        <path d="M 6 -22 Q 9 -32, 6 -28 Q 9 -38, 6 -48" fill="none" stroke={C.ivory} strokeWidth="0.6" opacity="0.25" />
      </g>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────
 * 05 · CRESCENT FIELD — abstract, geometric, brand-forward.
 * Big crescent silhouette at center-right, surrounded by tiny
 * stars, with a single strong horizontal gradient. Used for the
 * final CTA and brand transitions.
 * ─────────────────────────────────────────────────────────── */
export function SceneCrescentField({ className }: SceneProps) {
  return (
    <svg
      viewBox="0 0 1400 800"
      preserveAspectRatio="xMidYMid slice"
      className={cn("absolute inset-0 w-full h-full", className)}
      aria-hidden
    >
      <defs>
        <radialGradient id="cf-bg" cx="60%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#161e3a" />
          <stop offset="55%" stopColor="#0a0e1a" />
          <stop offset="100%" stopColor="#04060c" />
        </radialGradient>
        <linearGradient id="cf-cresc" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={C.goldHi} />
          <stop offset="55%" stopColor={C.gold} />
          <stop offset="100%" stopColor={C.goldDeep} />
        </linearGradient>
        <radialGradient id="cf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.gold} stopOpacity="0.30" />
          <stop offset="60%" stopColor={C.gold} stopOpacity="0.06" />
          <stop offset="100%" stopColor={C.gold} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1400" height="800" fill="url(#cf-bg)" />

      {/* huge ambient glow behind the crescent */}
      <circle cx="900" cy="400" r="500" fill="url(#cf-glow)" />

      {/* concentric thin rings, off-center */}
      {[180, 230, 290, 360].map((r, i) => (
        <circle key={i} cx="900" cy="400" r={r} fill="none" stroke={C.gold} strokeWidth="0.4" opacity={0.3 - i * 0.05} />
      ))}

      {/* the crescent — massive */}
      <g transform="translate(900 400)">
        <path
          d="M 60 -180 A 180 180 0 1 0 60 180 A 130 180 0 1 1 60 -180 Z"
          fill="url(#cf-cresc)"
        />
        <path
          d="M 60 -180 A 180 180 0 1 0 60 180"
          fill="none"
          stroke={C.goldHi}
          strokeWidth="0.8"
          opacity="0.7"
        />
        {/* inner star */}
        <g transform="translate(-40 0)">
          <path d="M 0 -10 L 2.5 -2.5 L 10 0 L 2.5 2.5 L 0 10 L -2.5 2.5 L -10 0 L -2.5 -2.5 Z" fill={C.goldHi} />
        </g>
      </g>

      {/* dense star field on the left side, sparser on the right */}
      {[
        [80, 120, 1.6, 0.85], [180, 80, 1.0, 0.6], [260, 200, 1.2, 0.65],
        [60, 280, 0.8, 0.45], [340, 100, 1.4, 0.75], [420, 300, 1.0, 0.55],
        [120, 480, 1.1, 0.6], [240, 540, 1.3, 0.7], [380, 620, 0.9, 0.5],
        [180, 360, 0.7, 0.4], [320, 440, 0.8, 0.45], [60, 600, 1.0, 0.55],
        [460, 180, 0.7, 0.4], [500, 520, 1.1, 0.6], [560, 80, 0.6, 0.4],
        [580, 660, 0.9, 0.5], [400, 80, 0.5, 0.35], [200, 720, 0.8, 0.45],
        [620, 380, 0.7, 0.4], [680, 240, 1.0, 0.55],
        [1100, 120, 0.6, 0.4], [1280, 200, 0.8, 0.45], [1340, 580, 0.7, 0.4],
        [1180, 660, 0.9, 0.5], [1340, 320, 0.5, 0.35], [1230, 460, 0.7, 0.4],
      ].map(([x, y, r, o], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={C.ivory} opacity={o} />
      ))}

      {/* a few connecting constellation lines on the left */}
      <g stroke={C.goldHi} strokeWidth="0.4" opacity="0.4" fill="none">
        <line x1="180" y1="80" x2="340" y2="100" />
        <line x1="340" y1="100" x2="260" y2="200" />
        <line x1="120" y1="480" x2="240" y2="540" />
        <line x1="240" y1="540" x2="380" y2="620" />
      </g>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────
 * 06 · PORTRAIT VIGNETTE — tall, atmospheric backdrop suitable
 * for founder placeholder portraits. A draped curtain of
 * gradient + a single off-axis light source + sparse stars.
 * Each instance can be tinted with a different accent so the
 * two founder spreads feel distinct.
 * ─────────────────────────────────────────────────────────── */
export function ScenePortraitVignette({
  tint = "gold",
  className,
}: SceneProps & { tint?: "gold" | "moon" }) {
  const tintColor = tint === "moon" ? C.moon : C.goldHi;
  const tintMid = tint === "moon" ? "#3a6b94" : C.gold;
  return (
    <svg
      viewBox="0 0 600 900"
      preserveAspectRatio="xMidYMid slice"
      className={cn("absolute inset-0 w-full h-full", className)}
      aria-hidden
    >
      <defs>
        <radialGradient id={`pv-${tint}-light`} cx="35%" cy="25%" r="65%">
          <stop offset="0%" stopColor={tintColor} stopOpacity="0.38" />
          <stop offset="55%" stopColor={tintMid} stopOpacity="0.10" />
          <stop offset="100%" stopColor="#06090f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`pv-${tint}-curtain`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0c1326" />
          <stop offset="60%" stopColor="#070a14" />
          <stop offset="100%" stopColor="#03050a" />
        </linearGradient>
      </defs>

      <rect width="600" height="900" fill={`url(#pv-${tint}-curtain)`} />
      {/* draped vertical bands */}
      {[0, 90, 180, 280, 380, 480].map((x) => (
        <path
          key={x}
          d={`M ${x} 0 Q ${x + 30} 200, ${x + 10} 450 Q ${x - 20} 700, ${x + 20} 900 L ${x + 80} 900 L ${x + 80} 0 Z`}
          fill={C.ink}
          opacity="0.18"
        />
      ))}
      {/* the light wash */}
      <rect width="600" height="900" fill={`url(#pv-${tint}-light)`} />

      {/* sparse stars */}
      {[
        [80, 90, 1.0], [240, 60, 0.8], [420, 110, 1.1], [520, 70, 0.6],
        [120, 220, 0.7], [380, 280, 0.8], [80, 380, 0.5], [500, 360, 0.7],
        [220, 500, 0.6], [400, 580, 0.5],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={C.ivory} opacity={0.45} />
      ))}

      {/* small crescent in upper corner — brand watermark */}
      <g transform="translate(500 130)" opacity="0.35">
        <path d="M 12 -22 A 22 22 0 1 0 12 22 A 16 22 0 1 1 12 -22 Z" fill={tintColor} />
      </g>

      {/* deep shadow at bottom for typography contrast */}
      <rect x="0" y="600" width="600" height="300" fill="url(#pv-shadow)" />
      <defs>
        <linearGradient id="pv-shadow" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#03050a" stopOpacity="0" />
          <stop offset="100%" stopColor="#03050a" stopOpacity="0.95" />
        </linearGradient>
      </defs>
    </svg>
  );
}
