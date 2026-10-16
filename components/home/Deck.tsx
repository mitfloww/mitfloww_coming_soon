"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

/* ==========================================================================
   Colourful 3D cards: five audiences in the hero, and two "back faces"
   (hire / assets) that the travelling cards flip to in the next section.
   Illustrations are inline SVG with lit gradients, so they stay crisp and
   need no image downloads.
   ========================================================================== */

type ArtProps = { u: string };

function Shadow({ u, cx = 80 }: ArtProps & { cx?: number }) {
  return (
    <>
      <defs>
        <radialGradient id={`${u}sh`}>
          <stop offset="0" stopColor="#000" stopOpacity=".32" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy="142" rx="50" ry="8" fill={`url(#${u}sh)`} />
    </>
  );
}

/** Phone with a reel and a glossy heart: content creators. */
function ArtCreators({ u }: ArtProps) {
  return (
    <svg viewBox="0 0 160 150" aria-hidden="true">
      <defs>
        <linearGradient id={`${u}body`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#dcd8ff" /></linearGradient>
        <linearGradient id={`${u}side`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a99cf5" /><stop offset="1" stopColor="#5b46d6" /></linearGradient>
        <linearGradient id={`${u}scr`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff9ad0" /><stop offset="1" stopColor="#7c4dff" /></linearGradient>
        <radialGradient id={`${u}heart`} cx=".35" cy=".3" r=".85"><stop offset="0" stopColor="#ffd6e6" /><stop offset=".5" stopColor="#ff4f8f" /><stop offset="1" stopColor="#c8104f" /></radialGradient>
      </defs>
      <Shadow u={u} cx={78} />
      <rect x="51" y="24" width="62" height="110" rx="16" fill={`url(#${u}side)`} />
      <rect x="44" y="17" width="62" height="110" rx="16" fill={`url(#${u}body)`} />
      <rect x="50" y="27" width="50" height="82" rx="10" fill={`url(#${u}scr)`} />
      <path d="M68 55 Q68 52 71 54 L85 64 Q88 67 85 69 L71 79 Q68 81 68 78 Z" fill="#fff" />
      <rect x="64" y="115" width="22" height="4" rx="2" fill="#c7c2f2" />
      <path d="M122 52 C110 44 103 38 103 30 C103 23 108 18 114 18 C118 18 121 21 122 24 C123 21 126 18 130 18 C136 18 141 23 141 30 C141 38 134 44 122 52 Z" fill={`url(#${u}heart)`} />
      <ellipse cx="112" cy="26" rx="5" ry="3" fill="#fff" opacity=".75" transform="rotate(-35 112 26)" />
    </svg>
  );
}

/** Pencil, sphere and cube: designers. */
function ArtDesigners({ u }: ArtProps) {
  return (
    <svg viewBox="0 0 160 150" aria-hidden="true">
      <defs>
        <radialGradient id={`${u}sph`} cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#fff" /><stop offset=".45" stopColor="#b9a8ff" /><stop offset="1" stopColor="#5b3fe0" /></radialGradient>
        <linearGradient id={`${u}pen`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe680" /><stop offset=".55" stopColor="#ffbf1f" /><stop offset="1" stopColor="#e88a00" /></linearGradient>
      </defs>
      <Shadow u={u} cx={84} />
      <polygon points="104,92 128,80 152,92 128,104" fill="#fff6e8" />
      <polygon points="104,92 128,104 128,132 104,120" fill="#ffd27a" />
      <polygon points="128,104 152,92 152,120 128,132" fill="#f0a020" />
      <circle cx="46" cy="104" r="26" fill={`url(#${u}sph)`} />
      <ellipse cx="38" cy="93" rx="7" ry="4" fill="#fff" opacity=".7" transform="rotate(-30 38 93)" />
      <g transform="rotate(-38 92 64)">
        <rect x="44" y="54" width="86" height="22" rx="5" fill={`url(#${u}pen)`} />
        <rect x="44" y="54" width="86" height="6" rx="3" fill="#fff" opacity=".35" />
        <rect x="32" y="54" width="14" height="22" rx="5" fill="#ff8aa6" />
        <rect x="44" y="54" width="7" height="22" fill="#d6dbe6" />
        <polygon points="130,54 154,65 130,76" fill="#f6d6ae" />
        <polygon points="146,61.3 154,65 146,68.7" fill="#2a2f45" />
      </g>
    </svg>
  );
}

/** Clapperboard and glossy play button: video editors. */
function ArtVideo({ u }: ArtProps) {
  return (
    <svg viewBox="0 0 160 150" aria-hidden="true">
      <defs>
        <linearGradient id={`${u}clap`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a4060" /><stop offset="1" stopColor="#141726" /></linearGradient>
        <radialGradient id={`${u}play`} cx=".35" cy=".3" r=".85"><stop offset="0" stopColor="#fff" /><stop offset=".45" stopColor="#ffb3be" /><stop offset="1" stopColor="#ff3d5a" /></radialGradient>
      </defs>
      <Shadow u={u} cx={76} />
      <rect x="26" y="66" width="86" height="60" rx="11" fill={`url(#${u}clap)`} />
      <rect x="26" y="66" width="86" height="8" rx="4" fill="#fff" opacity=".12" />
      <g transform="rotate(-12 26 64)">
        <rect x="24" y="48" width="90" height="17" rx="5" fill="#f4f6ff" />
        <polygon points="36,48 48,48 40,65 28,65" fill="#20243a" />
        <polygon points="60,48 72,48 64,65 52,65" fill="#20243a" />
        <polygon points="84,48 96,48 88,65 76,65" fill="#20243a" />
      </g>
      <rect x="38" y="86" width="40" height="5" rx="2.5" fill="#fff" opacity=".35" />
      <rect x="38" y="98" width="28" height="5" rx="2.5" fill="#fff" opacity=".2" />
      <circle cx="116" cy="100" r="28" fill={`url(#${u}play)`} />
      <path d="M108 87 Q108 84 111 86 L127 97 Q130 100 127 102 L111 113 Q108 115 108 112 Z" fill="#fff" />
      <ellipse cx="104" cy="85" rx="7" ry="4" fill="#fff" opacity=".7" transform="rotate(-35 104 85)" />
    </svg>
  );
}

/** Camera with a glass lens: photographers. */
function ArtCamera({ u }: ArtProps) {
  return (
    <svg viewBox="0 0 160 150" aria-hidden="true">
      <defs>
        <linearGradient id={`${u}cam`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#474d61" /><stop offset="1" stopColor="#15171f" /></linearGradient>
        <linearGradient id={`${u}ring`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8f97ad" /><stop offset="1" stopColor="#2a2e3a" /></linearGradient>
        <radialGradient id={`${u}glass`} cx=".38" cy=".32" r=".8"><stop offset="0" stopColor="#bfe8ff" /><stop offset=".4" stopColor="#2f7df0" /><stop offset="1" stopColor="#081a45" /></radialGradient>
      </defs>
      <Shadow u={u} />
      <rect x="54" y="40" width="42" height="20" rx="7" fill={`url(#${u}cam)`} />
      <rect x="110" y="46" width="16" height="9" rx="3" fill="#2a2f40" />
      <rect x="24" y="52" width="112" height="76" rx="18" fill={`url(#${u}cam)`} />
      <rect x="24" y="52" width="112" height="10" rx="5" fill="#fff" opacity=".1" />
      <rect x="108" y="62" width="18" height="9" rx="3" fill="#ffe27a" />
      <circle cx="80" cy="92" r="31" fill="#0c0e14" />
      <circle cx="80" cy="92" r="27" fill={`url(#${u}ring)`} />
      <circle cx="80" cy="92" r="19" fill={`url(#${u}glass)`} />
      <ellipse cx="73" cy="84" rx="6" ry="3.5" fill="#fff" opacity=".8" transform="rotate(-35 73 84)" />
      <circle cx="88" cy="100" r="2.5" fill="#fff" opacity=".45" />
    </svg>
  );
}

/** Extruded code brackets: developers. */
function ArtCode({ u }: ArtProps) {
  return (
    <svg viewBox="0 0 160 150" aria-hidden="true">
      <defs>
        <linearGradient id={`${u}code`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#c9d0ff" /></linearGradient>
        <radialGradient id={`${u}dot`} cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#fff" /><stop offset=".5" stopColor="#7ff0c2" /><stop offset="1" stopColor="#14a873" /></radialGradient>
      </defs>
      <Shadow u={u} />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="15">
        <g stroke="#221c7a" opacity=".55" transform="translate(5 6)">
          <path d="M56 54 L32 80 L56 106" /><path d="M104 54 L128 80 L104 106" /><path d="M90 48 L70 112" />
        </g>
        <g stroke={`url(#${u}code)`}>
          <path d="M56 54 L32 80 L56 106" /><path d="M104 54 L128 80 L104 106" /><path d="M90 48 L70 112" />
        </g>
      </g>
      <circle cx="128" cy="34" r="11" fill={`url(#${u}dot)`} />
      <circle cx="34" cy="36" r="6" fill={`url(#${u}dot)`} opacity=".9" />
    </svg>
  );
}

/** Profile with a check badge: hire a freelancer. */
function ArtHire({ u }: ArtProps) {
  return (
    <svg viewBox="0 0 160 150" aria-hidden="true">
      <defs>
        <radialGradient id={`${u}head`} cx=".38" cy=".32" r=".8"><stop offset="0" stopColor="#ffe9d6" /><stop offset="1" stopColor="#f0a06a" /></radialGradient>
        <linearGradient id={`${u}torso`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#bcd6ff" /></linearGradient>
        <radialGradient id={`${u}badge`} cx=".35" cy=".3" r=".85"><stop offset="0" stopColor="#c8ffe1" /><stop offset=".5" stopColor="#34d07f" /><stop offset="1" stopColor="#0f8f4f" /></radialGradient>
      </defs>
      <Shadow u={u} />
      <path d="M40 136 C40 104 58 92 80 92 C102 92 120 104 120 136 Z" fill={`url(#${u}torso)`} />
      <circle cx="80" cy="62" r="24" fill={`url(#${u}head)`} />
      <ellipse cx="72" cy="52" rx="7" ry="4" fill="#fff" opacity=".6" transform="rotate(-30 72 52)" />
      <circle cx="116" cy="98" r="17" fill={`url(#${u}badge)`} />
      <path d="M108 98 L114 104 L125 92" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 40 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#fff" opacity=".9" />
    </svg>
  );
}

/** Isometric package with sparkles: assets. */
function ArtAssets({ u }: ArtProps) {
  return (
    <svg viewBox="0 0 160 150" aria-hidden="true">
      <Shadow u={u} />
      <polygon points="80,38 124,60 80,82 36,60" fill="#fff4dc" />
      <polygon points="36,60 80,82 80,132 36,110" fill="#ffffff" opacity=".92" />
      <polygon points="80,82 124,60 124,110 80,132" fill="#ffe0a6" />
      <polygon points="58,49 102,71 102,80 58,58" fill="#ff9d2e" opacity=".85" />
      <polygon points="80,82 102,71 102,121 80,132" fill="#ffc66b" opacity=".55" />
      <path d="M128 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#fff" />
      <path d="M30 34 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill="#fff" opacity=".85" />
    </svg>
  );
}

export type FaceKind = "creators" | "designers" | "video" | "photo" | "dev" | "hire" | "assets";

const ART: Record<FaceKind, (p: ArtProps) => ReactNode> = {
  creators: ArtCreators,
  designers: ArtDesigners,
  video: ArtVideo,
  photo: ArtCamera,
  dev: ArtCode,
  hire: ArtHire,
  assets: ArtAssets,
};

/** One card face: colourful gradient, title, subtitle and illustration. */
export function DeckFace({ kind, title, sub, back = false }: { kind: FaceKind; title: string; sub: string; back?: boolean }) {
  const u = useId().replace(/[^a-zA-Z0-9]/g, "");
  const Art = ART[kind];
  return (
    <div className={`deck-face deck-face--${kind}${back ? " deck-face--back" : ""}`}>
      <span className="deck-face__title">{title}</span>
      <span className="deck-face__sub">{sub}</span>
      <span className="deck-face__art">
        <Art u={u} />
      </span>
    </div>
  );
}

/*
 * Fan layout, measured from the reference (shared with the scroll animation in
 * Intro). Index -2..2, left to right; x and y are in card widths.
 */
const FAN_X = [-1.6, -0.9, 0, 0.9, 1.6];
const FAN_Y = [0.36, 0.17, 0, 0.17, 0.36];
const FAN_RZ = [-6, -3, 0, 3, 6];
const FAN_RY = [14, 7, 0, -7, -14];
const FAN_S = [0.93, 0.96, 1, 0.96, 0.93];
export const FAN = [-2, -1, 0, 1, 2].map((i, n) => ({
  i,
  x: FAN_X[n],
  y: FAN_Y[n],
  rz: FAN_RZ[n],
  ry: FAN_RY[n],
  s: FAN_S[n],
}));

const FRONTS: FaceKind[] = ["creators", "designers", "video", "photo", "dev"];

/** The five fanned cards under the hero title. */
export function Deck() {
  const { m } = useI18n();
  const d = m.home.deck;
  return (
    <div className="deck" aria-hidden="true">
      {FAN.map((f, n) => {
        const front = FRONTS[n];
        const card = d.cards[n];
        const flipTo: FaceKind | null = n === 1 ? "hire" : n === 3 ? "assets" : null;
        const style = {
          "--x": `calc(var(--cw) * ${f.x})`,
          "--y": `calc(var(--cw) * ${f.y})`,
          "--rz": `${f.rz}deg`,
          "--ry": `${f.ry}deg`,
          "--s": f.s,
          "--z": 10 - Math.abs(f.i),
          "--k": n,
          "--d": `${120 + Math.abs(f.i) * 170 + (f.i > 0 ? 70 : 0)}ms`,
          "--from": f.i < 0 ? "calc(var(--cw) * -0.55)" : f.i > 0 ? "calc(var(--cw) * 0.55)" : "0px",
          "--from-y": f.i === 0 ? "calc(var(--cw) * 0.3)" : "calc(var(--cw) * 0.1)",
        } as CSSProperties;
        return (
          <div key={front} className={`deck-card${f.i > 0 ? " deck-card--right" : ""}`} data-deck-card={n} style={style}>
            <div className="deck-card__in">
              <DeckFace kind={front} title={card.title} sub={card.sub} />
              {flipTo ? <DeckFace kind={flipTo} title={d[flipTo].title} sub={d[flipTo].sub} back /> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Static version of a back face, shown above a CTA when cards don't travel (mobile, tablet). */
export function PathsCard({ kind }: { kind: "hire" | "assets" }) {
  const { m } = useI18n();
  const d = m.home.deck[kind];
  return (
    <div className={`paths__card paths__card--${kind}`} aria-hidden="true">
      <DeckFace kind={kind} title={d.title} sub={d.sub} />
    </div>
  );
}
