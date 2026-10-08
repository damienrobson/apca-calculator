/* eslint-disable no-useless-assignment */
import {
  calculateApcaLuminance,
  normBG,
  normTXT,
  scaleBoW,
  loThreshold,
  loOffset,
  revBG,
  revTXT,
  scaleWoB,
} from "./helpers";

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
    // Apply soft-toe noise cutoff: force to 0 if under threshold, otherwise subtract noise offset
    Lc = SAPC < loThreshold ? 0 : SAPC - loOffset;
  }

  // Case 2: Reverse Polarity (Dark background, Light text)
  else {
    // Calculate raw SAPC contrast using dark-mode power exponents and scale
    const SAPC = (bgY ** revBG - txtY ** revTXT) * scaleWoB;
    // Apply soft-toe noise cutoff: force to 0 if under negative threshold, otherwise add noise offset
    Lc = SAPC > -loThreshold ? 0 : SAPC + loOffset;
  }

  // Multiply by 100 to convert to standard Lc scale (-108 to +106)
  return Lc * 100;
};
