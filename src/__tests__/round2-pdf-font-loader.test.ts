// Part of React Advanced Odontogram - https://github.com/ZoliQua/React-Advanced-Odontogram
// Created by Zoltan Dul (https://github.com/ZoliQua) 2025-2026

// Round 2 (phase 2): the language-aware PDF font loader picks the right embedded
// font per supported UI language (Latin, Arabic) and returns a
// descriptor with the jsPDF family, a registrar, and a text transform. Fonts are
// dynamically imported, so this also exercises that the chunks resolve.
import { describe, it, expect } from "vitest";
import { loadPdfFont } from "../fonts/loader";

function fakeDoc() {
  const fonts: string[] = [];
  return {
    fonts,
    addFileToVFS: () => {},
    addFont: (_f: string, family: string) => { fonts.push(family); },
  };
}

describe("Round 2: PDF font loader", () => {
  it("selects the Arabic font + shaping transform for ar", async () => {
    const f = await loadPdfFont("ar");
    expect(f.family).toBe("NotoArabic");
    // The transform shapes Arabic (changes the string), unlike the identity ones.
    expect(f.transform("بيت")).not.toBe("بيت");
    const doc = fakeDoc();
    expect(f.register(doc)).toBe(true);
    expect(doc.fonts).toContain("NotoArabic");
  });

  it("selects Roboto + identity transform for English", async () => {
    const f = await loadPdfFont("en");
    expect(f.family).toBe("Roboto");
    expect(f.transform("hello")).toBe("hello");
  });
});
