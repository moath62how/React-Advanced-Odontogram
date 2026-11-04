// Part of React Advanced Odontogram - https://github.com/ZoliQua/React-Advanced-Odontogram
// Created by Zoltan Dul (https://github.com/ZoliQua) 2025-2026

/**
 * Supported UI languages.
 *
 * | Code | Language |
 * |------|----------|
 * | en   | English  |
 * | ar   | Arabic (RTL — UI mirrors, dental/perio charts pinned LTR) |
 *
 * The strings themselves live one file per language in `./locales/`. Only
 * English is bundled statically; every other language is a separate chunk
 * fetched the first time it is selected (see `./loader.ts`).
 */
export type Language = "en" | "ar";

/** Every supported language, in the order the language menu lists them. */
export const LANGUAGES: readonly Language[] = ["en", "ar"];

/** The language every missing key resolves against, and the one the UI starts in. */
export const FALLBACK_LANGUAGE: Language = "en";
