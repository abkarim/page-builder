export const ABSOLUTE_UNITS = {
  Pixels: "px",
  Centimeters: "cm",
  Millimeters: "mm",
  QuarterMillimeters: "Q",
  Inches: "in",
  Picas: "pc",
  Points: "pt",
};

export const FONT_RELATIVE_UNITS = {
  ParentFontSize: "em",
  RootFontSize: "rem",
  XHeight: "ex",
  CharacterWidth: "ch",
  LineHeight: "lh",
  RootLineHeight: "rlh",
};

export const VIEWPORT_UNITS = {
  ViewportWidth: "vw",
  ViewportHeight: "vh",
  ViewportMin: "vmin",
  ViewportMax: "vmax",
  SmallViewportWidth: "svw",
  LargeViewportWidth: "lvw",
  DynamicViewportWidth: "dvw",
};

export const OTHER_UNITS = {
  Percentage: "%",
};

export const CSS_UNITS = {
  ...ABSOLUTE_UNITS,
  ...FONT_RELATIVE_UNITS,
  ...VIEWPORT_UNITS,
  ...OTHER_UNITS,
};

export function getSizeUnitFromCSSValue(value: string): {
  size: number;
  unit: string;
} {
  const match = value.match(/^(-?\d*\.?\d+)(.*)$/);

  if (!match) {
    return { size: 0, unit: "" };
  }

  return {
    size: parseFloat(match[1]),
    unit: match[2].trim(), // .trim() handles cases like "10 px"
  };
}
