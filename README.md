# APCA Contrast Calculator

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://apca-calculator.netlify.app/)

A web-based tool for calculating perceptual colour contrast using the **Accessible Perceptual Contrast Algorithm (APCA)**, the candidate contrast methodology proposed for the Web Content Accessibility Guidelines (WCAG 3).

**Live Demo:** [apca-calculator.netlify.app](https://apca-calculator.netlify.app/)

---

## Overview

Traditional accessibility tools rely on the WCAG 2.x contrast formula, which calculates a simple mathematical ratio based solely on luminance. However, human vision perceives contrast dynamically depending on polarity (light mode vs. dark mode), font size, weight, and context.

The **APCA Contrast Calculator** evaluates colour combinations through a perceptual model to provide a more accurate representation of actual human legibility.

### Key Features

- **Perceptual Contrast Scoring ($L_c$):** Displays lightness contrast scores tailored to human perception rather than flat numerical ratios.
- **Font & Weight Sensitivity:** Evaluate readability across different font sizes and weight variations.
- **Polarity Support:** Accurately evaluates both dark text on light backgrounds and light text on dark backgrounds.
- **Fast & Responsive:** Clean, intuitive UI built for quick workflow integration by designers and developers.

---

## APCA vs. WCAG 2.1 At a Glance

| Feature                | WCAG 2.1 Contrast                      | APCA ($L_c$)                                              |
| :--------------------- | :------------------------------------- | :-------------------------------------------------------- |
| **Model**              | Static Luminance Ratio (e.g., `4.5:1`) | Perceptual Lightness Contrast ($L_c$)                     |
| **Polarity Aware**     | No (Swapping colours gives same ratio) | Yes ($L_c 0$ to $106$, and negative values for dark mode) |
| **Typography Context** | Binary (Normal vs. Large)              | Continuous scale based on font size & weight              |
| **Dark Mode Accuracy** | Poor (Prone to haloing/glare issues)   | High (Models visual perception accurately)                |

---

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript / TypeScript
- **Core Algorithm:** APCA / SAPC (Spatial Perceptual Contrast)
- **Hosting & Deployment:** [Netlify](https://www.netlify.com/)

---

## References & Further Reading

- [Myndex / APCA Official Documentation](https://git.apcacontrast.com/documentation/)
- [W3C WCAG 3.0 Draft Guidelines](https://www.w3.org/TR/wcag-3.0/)

## License

Distributed under the MIT License.
