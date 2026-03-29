/** Curated color + font bundles for site_settings (keys stored in DB). */

export const DEFAULT_COLOR_SCHEME = 'tomato_sage';
export const DEFAULT_FONT_PAIR = 'baskerville_raleway';

export const COLOR_SCHEME_KEYS = [
  'tomato_sage',
  'ocean_blue',
  'warm_spice',
  'forest_moss',
  'midnight_plum',
] as const;

export type ColorSchemeKey = (typeof COLOR_SCHEME_KEYS)[number];

export const FONT_PAIR_KEYS = [
  'baskerville_raleway',
  'lora_open_sans',
  'playfair_lato',
  'merriweather_source_sans',
  'fraunces_work_sans',
] as const;

export type FontPairKey = (typeof FONT_PAIR_KEYS)[number];

/** Full :root / .dark variable maps (matches globals.css shape). */
const BASE_LIGHT: Record<string, string> = {
  '--background': '#faf9f5',
  '--foreground': '#141414',
  '--card': '#ffffff',
  '--card-foreground': '#141414',
  '--popover': '#ffffff',
  '--popover-foreground': '#141414',
  '--primary': 'oklch(0.5 0.17 28)',
  '--primary-foreground': '#fffaf5',
  '--secondary': '#f0efe8',
  '--secondary-foreground': '#141414',
  '--muted': '#ebe8df',
  '--muted-foreground': '#5c5c5c',
  '--accent': '#535e50',
  '--accent-foreground': '#f8f7f2',
  '--destructive': 'oklch(0.52 0.2 25)',
  '--destructive-foreground': '#fff',
  '--border': '#e0ddd4',
  '--input': '#e8e5dc',
  '--ring': 'oklch(0.5 0.17 28)',
  '--chart-1': 'oklch(0.5 0.17 28)',
  '--chart-2': 'oklch(0.48 0.06 145)',
  '--chart-3': 'oklch(0.72 0.12 85)',
  '--chart-4': 'oklch(0.6 0.14 35)',
  '--chart-5': 'oklch(0.45 0.08 250)',
  '--radius': '0.75rem',
  '--sidebar': '#f5f4ee',
  '--sidebar-foreground': '#141414',
  '--sidebar-primary': 'oklch(0.5 0.17 28)',
  '--sidebar-primary-foreground': '#fffaf5',
  '--sidebar-accent': '#ebe8df',
  '--sidebar-accent-foreground': '#141414',
  '--sidebar-border': '#e0ddd4',
  '--sidebar-ring': 'oklch(0.5 0.17 28)',
};

const BASE_DARK: Record<string, string> = {
  '--background': 'oklch(0.16 0.02 50)',
  '--foreground': 'oklch(0.96 0.01 90)',
  '--card': 'oklch(0.2 0.02 50)',
  '--card-foreground': 'oklch(0.96 0.01 90)',
  '--popover': 'oklch(0.2 0.02 50)',
  '--popover-foreground': 'oklch(0.96 0.01 90)',
  '--primary': 'oklch(0.62 0.17 28)',
  '--primary-foreground': 'oklch(0.15 0.02 50)',
  '--secondary': 'oklch(0.26 0.02 50)',
  '--secondary-foreground': 'oklch(0.96 0.01 90)',
  '--muted': 'oklch(0.26 0.02 50)',
  '--muted-foreground': 'oklch(0.68 0.02 80)',
  '--accent': 'oklch(0.55 0.06 145)',
  '--accent-foreground': 'oklch(0.98 0.01 90)',
  '--destructive': 'oklch(0.45 0.18 25)',
  '--destructive-foreground': 'oklch(0.96 0.01 90)',
  '--border': 'oklch(0.3 0.02 50)',
  '--input': 'oklch(0.3 0.02 50)',
  '--ring': 'oklch(0.62 0.17 28)',
  '--chart-1': 'oklch(0.62 0.17 28)',
  '--chart-2': 'oklch(0.55 0.06 145)',
  '--chart-3': 'oklch(0.72 0.12 85)',
  '--chart-4': 'oklch(0.7 0.14 35)',
  '--chart-5': 'oklch(0.55 0.08 250)',
  '--sidebar': 'oklch(0.2 0.02 50)',
  '--sidebar-foreground': 'oklch(0.96 0.01 90)',
  '--sidebar-primary': 'oklch(0.62 0.17 28)',
  '--sidebar-primary-foreground': 'oklch(0.96 0.01 90)',
  '--sidebar-accent': 'oklch(0.26 0.02 50)',
  '--sidebar-accent-foreground': 'oklch(0.96 0.01 90)',
  '--sidebar-border': 'oklch(0.3 0.02 50)',
  '--sidebar-ring': 'oklch(0.62 0.17 28)',
};

function mergeLight(patch: Record<string, string>): Record<string, string> {
  return { ...BASE_LIGHT, ...patch };
}

function mergeDark(patch: Record<string, string>): Record<string, string> {
  return { ...BASE_DARK, ...patch };
}

const COLOR_SCHEMES: Record<ColorSchemeKey, { light: Record<string, string>; dark: Record<string, string> }> = {
  tomato_sage: {
    light: { ...BASE_LIGHT },
    dark: { ...BASE_DARK },
  },
  ocean_blue: {
    light: mergeLight({
      '--primary': 'oklch(0.48 0.12 240)',
      '--ring': 'oklch(0.48 0.12 240)',
      '--accent': 'oklch(0.42 0.08 200)',
      '--chart-1': 'oklch(0.48 0.12 240)',
      '--sidebar-primary': 'oklch(0.48 0.12 240)',
      '--sidebar-ring': 'oklch(0.48 0.12 240)',
    }),
    dark: mergeDark({
      '--primary': 'oklch(0.62 0.12 240)',
      '--ring': 'oklch(0.62 0.12 240)',
      '--accent': 'oklch(0.58 0.08 200)',
      '--chart-1': 'oklch(0.62 0.12 240)',
      '--sidebar-primary': 'oklch(0.62 0.12 240)',
      '--sidebar-ring': 'oklch(0.62 0.12 240)',
    }),
  },
  warm_spice: {
    light: mergeLight({
      '--primary': 'oklch(0.52 0.16 55)',
      '--ring': 'oklch(0.52 0.16 55)',
      '--accent': 'oklch(0.4 0.07 55)',
      '--chart-1': 'oklch(0.52 0.16 55)',
      '--sidebar-primary': 'oklch(0.52 0.16 55)',
      '--sidebar-ring': 'oklch(0.52 0.16 55)',
    }),
    dark: mergeDark({
      '--primary': 'oklch(0.68 0.14 55)',
      '--ring': 'oklch(0.68 0.14 55)',
      '--accent': 'oklch(0.55 0.08 55)',
      '--chart-1': 'oklch(0.68 0.14 55)',
      '--sidebar-primary': 'oklch(0.68 0.14 55)',
      '--sidebar-ring': 'oklch(0.68 0.14 55)',
    }),
  },
  forest_moss: {
    light: mergeLight({
      '--primary': 'oklch(0.42 0.12 145)',
      '--ring': 'oklch(0.42 0.12 145)',
      '--accent': 'oklch(0.38 0.06 145)',
      '--chart-1': 'oklch(0.42 0.12 145)',
      '--sidebar-primary': 'oklch(0.42 0.12 145)',
      '--sidebar-ring': 'oklch(0.42 0.12 145)',
    }),
    dark: mergeDark({
      '--primary': 'oklch(0.58 0.12 145)',
      '--ring': 'oklch(0.58 0.12 145)',
      '--accent': 'oklch(0.52 0.08 145)',
      '--chart-1': 'oklch(0.58 0.12 145)',
      '--sidebar-primary': 'oklch(0.58 0.12 145)',
      '--sidebar-ring': 'oklch(0.58 0.12 145)',
    }),
  },
  midnight_plum: {
    light: mergeLight({
      '--primary': 'oklch(0.42 0.14 310)',
      '--ring': 'oklch(0.42 0.14 310)',
      '--accent': 'oklch(0.38 0.1 280)',
      '--chart-1': 'oklch(0.42 0.14 310)',
      '--sidebar-primary': 'oklch(0.42 0.14 310)',
      '--sidebar-ring': 'oklch(0.42 0.14 310)',
    }),
    dark: mergeDark({
      '--primary': 'oklch(0.62 0.14 310)',
      '--ring': 'oklch(0.62 0.14 310)',
      '--accent': 'oklch(0.55 0.1 280)',
      '--chart-1': 'oklch(0.62 0.14 310)',
      '--sidebar-primary': 'oklch(0.62 0.14 310)',
      '--sidebar-ring': 'oklch(0.62 0.14 310)',
    }),
  },
};

export const FONT_PAIRS: Record<
  FontPairKey,
  { serif: string; sans: string; googleHref: string }
> = {
  baskerville_raleway: {
    serif: "'Libre Baskerville', Georgia, 'Times New Roman', serif",
    sans: "'Raleway', ui-sans-serif, system-ui, sans-serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Raleway:wght@400;600&display=swap',
  },
  lora_open_sans: {
    serif: "'Lora', Georgia, serif",
    sans: "'Open Sans', ui-sans-serif, system-ui, sans-serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Open+Sans:wght@400;600&display=swap',
  },
  playfair_lato: {
    serif: "'Playfair Display', Georgia, serif",
    sans: "'Lato', ui-sans-serif, system-ui, sans-serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap',
  },
  merriweather_source_sans: {
    serif: "'Merriweather', Georgia, serif",
    sans: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;600&display=swap',
  },
  fraunces_work_sans: {
    serif: "'Fraunces', Georgia, serif",
    sans: "'Work Sans', ui-sans-serif, system-ui, sans-serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Work+Sans:wght@400;600&display=swap',
  },
};

function serializeBlock(selector: string, vars: Record<string, string>): string {
  let s = `${selector}{`;
  for (const [k, v] of Object.entries(vars)) {
    s += `${k}:${v};`;
  }
  return `${s}}`;
}

export function normalizeColorSchemeKey(raw: string | null | undefined): ColorSchemeKey {
  const t = String(raw || '').trim();
  return (COLOR_SCHEME_KEYS as readonly string[]).includes(t)
    ? (t as ColorSchemeKey)
    : DEFAULT_COLOR_SCHEME;
}

export function normalizeFontPairKey(raw: string | null | undefined): FontPairKey {
  const t = String(raw || '').trim();
  return (FONT_PAIR_KEYS as readonly string[]).includes(t) ? (t as FontPairKey) : DEFAULT_FONT_PAIR;
}

export function buildThemeStyleTag(
  colorKey: ColorSchemeKey,
  fontKey: FontPairKey
): { css: string; googleHref: string } {
  const scheme = COLOR_SCHEMES[colorKey];
  const fonts = FONT_PAIRS[fontKey];
  const light = { ...scheme.light, '--site-font-serif': fonts.serif, '--site-font-sans': fonts.sans };
  const dark = { ...scheme.dark, '--site-font-serif': fonts.serif, '--site-font-sans': fonts.sans };

  const css = `${serializeBlock(':root', light)}${serializeBlock('.dark', dark)}`;
  return { css, googleHref: fonts.googleHref };
}
