// Carousel themes — palette and typography applied to generated LinkedIn PDFs.
// jsPDF only ships helvetica, times, and courier, so fontFamily is constrained to those.

export type RGB = readonly [number, number, number];

export type CarouselTheme = {
  id: string;
  name: string;
  description: string;
  // Palette
  background: RGB;   // slide background fill
  bar: RGB;          // top/bottom bar fill (usually a near-tint of background)
  accent: RGB;       // left stripe, rule, dot, brand wordmark
  titleText: RGB;    // headline color
  bodyText: RGB;     // body paragraph color
  mutedText: RGB;    // slide counter + bottom text
  // Typography
  fontFamily: "helvetica" | "times" | "courier";
  // Whether this is a user-defined theme (persisted to localStorage)
  custom?: boolean;
};

// ─── Built-in themes (7) ─────────────────────────────────────────────────────
export const BUILT_IN_THEMES: CarouselTheme[] = [
  {
    id: "ozigi",
    name: "Ozigi",
    description: "Deep navy with a bold red accent — the Ozigi house style.",
    background: [8, 18, 36],
    bar: [15, 28, 52],
    accent: [220, 48, 24],
    titleText: [248, 250, 252],
    bodyText: [176, 196, 216],
    mutedText: [80, 104, 132],
    fontFamily: "helvetica",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Near-black with a vivid violet glow.",
    background: [15, 12, 35],
    bar: [24, 20, 52],
    accent: [124, 58, 237],
    titleText: [250, 250, 255],
    bodyText: [196, 181, 253],
    mutedText: [107, 89, 160],
    fontFamily: "helvetica",
  },
  {
    id: "paper",
    name: "Paper",
    description: "Warm cream with serif type — clean editorial.",
    background: [252, 249, 243],
    bar: [240, 234, 221],
    accent: [185, 28, 28],
    titleText: [15, 23, 42],
    bodyText: [55, 65, 81],
    mutedText: [148, 157, 170],
    fontFamily: "times",
  },
  {
    id: "ember",
    name: "Ember",
    description: "Deep espresso background with a warm amber accent.",
    background: [22, 14, 8],
    bar: [36, 22, 12],
    accent: [251, 146, 60],
    titleText: [255, 247, 237],
    bodyText: [224, 180, 140],
    mutedText: [120, 80, 45],
    fontFamily: "helvetica",
  },
  {
    id: "forest",
    name: "Forest",
    description: "Rich dark green with a bright emerald accent.",
    background: [8, 28, 18],
    bar: [12, 42, 26],
    accent: [52, 211, 153],
    titleText: [240, 253, 244],
    bodyText: [166, 220, 192],
    mutedText: [60, 130, 90],
    fontFamily: "helvetica",
  },
  {
    id: "mono",
    name: "Mono",
    description: "Pure white with black type and bold geometry.",
    background: [255, 255, 255],
    bar: [240, 240, 240],
    accent: [0, 0, 0],
    titleText: [0, 0, 0],
    bodyText: [60, 60, 60],
    mutedText: [150, 150, 150],
    fontFamily: "courier",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Deep ocean navy with an electric cyan accent.",
    background: [6, 20, 48],
    bar: [10, 32, 72],
    accent: [6, 182, 212],
    titleText: [240, 253, 255],
    bodyText: [147, 210, 220],
    mutedText: [71, 132, 148],
    fontFamily: "helvetica",
  },
];

// ─── Custom theme persistence (localStorage) ─────────────────────────────────
const CUSTOM_KEY = "ozigi.carousel.customThemes";

export function loadCustomThemes(): CarouselTheme[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CarouselTheme[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomThemes(themes: CarouselTheme[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(themes));
  } catch {
    // quota / disabled storage — ignore silently
  }
}

// ─── Hex ⇄ RGB helpers for the custom-theme form ─────────────────────────────
export function hexToRgb(hex: string): RGB | null {
  const clean = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ] as RGB;
}

export function rgbToHex(rgb: RGB): string {
  return (
    "#" +
    rgb
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function rgbToCss(rgb: RGB, alpha?: number): string {
  if (alpha != null) return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
