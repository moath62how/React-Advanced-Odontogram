// Part of React Advanced Odontogram - https://github.com/ZoliQua/React-Advanced-Odontogram
// Created by Zoltan Dul (https://github.com/ZoliQua) 2025-2026
//
// Language-aware PDF font loader. Picks the right embedded Unicode font for the
// active UI language and returns a descriptor the export path uses: the jsPDF
// family name, a registration fn, and a per-string text transform (Arabic
// shaping; identity otherwise). Each font module is loaded via a dynamic import
// so only the font for the language actually being exported is pulled in — the
// fonts stay code-split out of the main bundle (they are still bundled in the
// package = fully offline, never fetched from the network).
import type { FontRegistrable } from "./roboto";
import { shapeArabic } from "./arabicShaper";
import type { Language } from "../i18n/languages";

export interface PdfFont {
  /** jsPDF family name to pass to `doc.setFont(family, style)`. */
  family: string;
  /** Register the font's VFS + styles on a jsPDF doc; false if unsupported. */
  register: (doc: FontRegistrable) => boolean;
  /** Per-string transform applied before `doc.text` (Arabic shaping; else identity). */
  transform: (s: string) => string;
}

/** Load + describe the PDF font for `lang` (the active UI language code). */
export async function loadPdfFont(lang: Language): Promise<PdfFont> {
  if (lang === "ar") {
    const { registerArabicFont, PDF_FONT_ARABIC } = await import("./notoArabic");
    return { family: PDF_FONT_ARABIC, register: registerArabicFont, transform: shapeArabic };
  }
  // English uses the Latin font.
  const { registerRobotoFont, PDF_FONT_FAMILY } = await import("./roboto");
  return { family: PDF_FONT_FAMILY, register: registerRobotoFont, transform: (s) => s };
}
