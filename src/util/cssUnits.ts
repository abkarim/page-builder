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
  ZeroWidth: "ch",
  LineHeight: "lh",
  RootLineHeight: "rlh",
};

export const VIEWPORT_UNITS = {
  ViewportWidth: "vw",
  ViewportHeight: "vh",
  ViewportMin: "vmin",
  ViewportMax: "vmax",
  SmallViewportWidth: "svw", // Modern additions
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
