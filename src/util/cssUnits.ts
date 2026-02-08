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

export function getSizeUnitFromCSSValue(
  value: string,
  defaultUnit: string = "px",
): {
  size: number;
  unit: string;
} {
  const match = value.match(/^(-?\d*\.?\d+)(.*)$/);

  if (!match) {
    return { size: 0, unit: defaultUnit };
  }

  let unit = match[2];
  if (unit === "undefined" || !unit) unit = defaultUnit;

  return {
    size: parseFloat(match[1]),
    unit: unit.trim(), // .trim() handles cases like "10 px"
  };
}

type SideValues = {
  top: string;
  right: string;
  bottom: string;
  left: string;
};

export function getBoxSides(value: string): SideValues {
  const parsed = value.trim().split(/\s+/);
  let t, r, b, l;

  switch (parsed.length) {
    case 1:
      [t, r, b, l] = [parsed[0], parsed[0], parsed[0], parsed[0]];
      break;
    case 2:
      [t, r, b, l] = [parsed[0], parsed[1], parsed[0], parsed[1]];
      break;
    case 3:
      [t, r, b, l] = [parsed[0], parsed[1], parsed[2], parsed[1]];
      break;
    case 4:
    default:
      [t, r, b, l] = [parsed[0], parsed[1], parsed[2], parsed[3]];
      break;
  }

  const data = { top: t, right: r, bottom: b, left: l };
  return data;
}

export function stringifyBoxSides(sides: SideValues): string {
  const { top: t, right: r, bottom: b, left: l } = sides;

  if (t === r && r === b && b === l) return t;
  if (t === b && r === l) return `${t} ${r}`;
  if (r === l) return `${t} ${r} ${b}`;

  return `${t} ${r} ${b} ${l}`;
}
