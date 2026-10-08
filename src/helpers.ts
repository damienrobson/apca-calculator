/* eslint-disable no-useless-assignment */
// APCA Exponent: Standard Tone Response Curve (TRC) exponent simulating human display gamma (~2.4)
export const mainTRC = 2.4;

// sRGB Spectral Luminous Efficiency Coefficients based on CIE Y (standard sRGB primaries)
export const R_COEFFICIENT = 0.2126729; // Red weight in overall luminance perception
export const G_COEFFICIENT = 0.7151522; // Green weight in overall luminance perception (human eye is most sensitive to green)
export const B_COEFFICIENT = 0.072175; // Blue weight in overall luminance perception

// Soft-clamp exponents for light-background/dark-text (Black-on-White mode)
export const normBG = 0.56; // Background luminance exponent for normal contrast polarity
export const normTXT = 0.57; // Text luminance exponent for normal contrast polarity

// Soft-clamp exponents for dark-background/light-text (White-on-Black mode)
export const revTXT = 0.62; // Text luminance exponent for reverse contrast polarity
export const revBG = 0.65; // Background luminance exponent for reverse contrast polarity

// Dark-flare compensation constants for low-luminance values
export const blkThreshold = 0.022; // Luminance threshold below which dark flare compensation kicks in
export const blkClamp = 1.414; // Power curve used to boost near-black values to model screen glare/flare

// Scaling factors for light-mode vs dark-mode APCA contrast values
export const scaleBoW = 1.14; // Scaling factor for Black-on-White (normal polarity)
export const scaleWoB = 1.14; // Scaling factor for White-on-Black (reverse polarity)

// Soft-toe noise threshold (prevents tiny luminance differences from yielding false contrast)
// "Soft-toe" refers to the gentle cut-off applied to low-contrast scenarios
export const loThreshold = 0.1; // Minimum raw SAPC threshold required to register meaningful contrast
export const loOffset = 0.027; // Baseline offset applied to smooth out low-contrast thresholds

// Type definition restricting font weight to standard numerical CSS weights
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

// Interface describing the comprehensive APCA validation outcome
export interface ApcaValidationResult {
  lc: number; // Signed Lightness Contrast value (ranges from roughly -108 to +106)
  isAccessible: boolean; // True if the contrast meets or exceeds the threshold for the given font size/weight
  minRequiredLc: number; // The minimum required Lc value for the specific font settings provided
  recommendedRole: string; // Human-readable recommendation for intended use cases based on Lc
}

/**
 * Calculates the perceptually adjusted APCA luminance (Y) from a 6-character hex color.
 */
export const calculateApcaLuminance = (hexColor: string): number => {
  // Strip the leading hash symbol if present
  const hex = hexColor.replace("#", "");

  // Extract integer values (0-255) for R, G, and B components using bit slicing
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Linearize RGB values by normalizing to 0-1 and applying the Tone Response Curve (TRC) power
  const rLin = (r / 255) ** mainTRC;
  const gLin = (g / 255) ** mainTRC;
  const bLin = (b / 255) ** mainTRC;

  // Calculate initial spectral luminance Y using spectral weighted coefficients
  let Y = rLin * R_COEFFICIENT + gLin * G_COEFFICIENT + bLin * B_COEFFICIENT;

  // Apply flare compensation if luminance falls below the black threshold
  if (Y < blkThreshold) {
    Y += (blkThreshold - Y) ** blkClamp;
  }

  // Return final calculated luminance value
  return Y;
};

/**
 * Evaluates the required minimum Lightness Contrast (|Lc|) based on font size and weight.
 */
export const getMinimumLcForFont = (
  fontSizePx: number,
  fontWeight: FontWeight,
): number => {
  // Very large display text (36px+ or 24px+ Bold): Low contrast required (Lc 45)
  if (fontSizePx >= 36 || (fontSizePx >= 24 && fontWeight >= 700)) {
    return 45; // Large bold / display headers
  }

  // Subtitles / Medium-large text (24px+ or 18px+ Bold): Moderate contrast required (Lc 60)
  if (fontSizePx >= 24 || (fontSizePx >= 18 && fontWeight >= 700)) {
    return 60; // Subtitles / Large body text
  }

  // Standard body text (16px+ or 14px+ Bold): High contrast required (Lc 75)
  if (fontSizePx >= 16 || (fontSizePx >= 14 && fontWeight >= 700)) {
    return 75; // Standard body text
  }

  // Small or fine text (12px+ Medium weight): Maximum legibility contrast required (Lc 90)
  if (fontSizePx >= 12 && fontWeight >= 500) {
    return 90; // Small text / captions (high legibility required)
  }

  // Default fallback for very small or light-weight text: Maximum contrast required (Lc 90)
  return 90;
};

/**
 * Computes the APCA Lightness Contrast (Lc) value between text and background colors.
 * Returns a signed value: positive means dark text on light background; negative means light text on dark background.
 */
export const calcAPCA = (txtColor: string, bgColor: string): number => {
  // Compute luminance for text color
  const txtY = calculateApcaLuminance(txtColor);

  // Compute luminance for background color
  const bgY = calculateApcaLuminance(bgColor);

  // Return 0 contrast if luminance difference is within sub-visual noise floor
  if (Math.abs(bgY - txtY) < 0.0005) {
    return 0;
  }

  // Initialize Lightness Contrast accumulator
  let Lc = 0;

  // Case 1: Normal Polarity (Light background, Dark text)
  if (bgY > txtY) {
    // Calculate raw SAPC contrast using light-mode power exponents and scale
    const SAPC = (bgY ** normBG - txtY ** normTXT) * scaleBoW;
    // Apply soft-toe noise cut-off: force to 0 if under threshold, otherwise subtract noise offset
    Lc = SAPC < loThreshold ? 0 : SAPC - loOffset;
  }
  // Case 2: Reverse Polarity (Dark background, Light text)
  else {
    // Calculate raw SAPC contrast using dark-mode power exponents and scale
    const SAPC = (bgY ** revBG - txtY ** revTXT) * scaleWoB;
    // Apply soft-toe noise cut-off: force to 0 if under negative threshold, otherwise add noise offset
    Lc = SAPC > -loThreshold ? 0 : SAPC + loOffset;
  }

  // Multiply by 100 to convert to standard Lc scale (-108 to +106)
  return Lc * 100;
};

/**
 * Validates text accessibility for a given text color, background color, font size, and font weight.
 */
export function isApcaAccessible(
  txtColor: string,
  bgColor: string,
  fontSizePx: number = 16,
  fontWeight: FontWeight = 400,
): ApcaValidationResult {
  // Calculate signed Lc score between text and background
  const lc = calcAPCA(txtColor, bgColor);

  // Extract absolute magnitude of Lc for threshold comparison
  const absLc = Math.abs(lc);

  // Determine minimum Lc required for the target font size and weight combination
  const minRequiredLc = getMinimumLcForFont(fontSizePx, fontWeight);

  // Assign recommended UI role according to calculated absolute Lc value tiers
  let recommendedRole = "Forbidden / Non-readable";
  if (absLc >= 90) recommendedRole = "Preferred for body text and small text";
  else if (absLc >= 75)
    recommendedRole = "Minimum for standard body text (16px+)";
  else if (absLc >= 60)
    recommendedRole = "Large text / Subtitles (24px+ or 18px bold)";
  else if (absLc >= 45)
    recommendedRole = "Large display headlines (36px+ or 24px bold)";
  else if (absLc >= 30) recommendedRole = "Non-text UI elements / Icons only";

  // Return comprehensive validation results object
  return {
    lc,
    isAccessible: absLc >= minRequiredLc,
    minRequiredLc,
    recommendedRole,
  };
}
