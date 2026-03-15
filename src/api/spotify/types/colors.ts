export interface SpotifyColorRgb {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface SpotifyColorHsl {
  h: number;
  s: number;
  l: number;
}

export interface SpotifyColorHsv {
  h: number;
  s: number;
  v: number;
}

export interface SpotifyColorValue {
  rgb: SpotifyColorRgb;
  hsl: SpotifyColorHsl;
  hsv: SpotifyColorHsv;
  a: number;
}

export interface SpotifyContrastSet {
  backgroundBase: SpotifyColorValue;
  backgroundTintedBase: SpotifyColorValue;
  textBase: SpotifyColorValue;
  textBrightAccent: SpotifyColorValue;
  textSubdued: SpotifyColorValue;
}

export interface SpotifyDynamicColors {
  encoreBaseSetTextColor: SpotifyColorValue;
  minContrast: SpotifyContrastSet;
  highContrast: SpotifyContrastSet;
  higherContrast: SpotifyContrastSet;
}
