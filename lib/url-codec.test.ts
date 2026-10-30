import { describe, expect, test } from "bun:test";

import { decodeNote, encodeNote, truncateToFit } from "./url-codec";

function pseudoRandomText(length: number): string {
  let seed = 1;
  return Array.from({ length }, () => {
    seed = (seed * 48271) % 2147483647;
    return String.fromCharCode(33 + (seed % 94));
  }).join("");
}

function legacyEncode(text: string): string {
  return btoa(encodeURIComponent(text)).replace(/\+/g, "-").replace(/\//g, "_");
}

describe("encodeNote", () => {
  test("prefixes compressed notes", () => {
    expect(encodeNote("hello")).toStartWith("z:");
  });

  test("produces URL-safe output", () => {
    expect(encodeNote(pseudoRandomText(2000)).slice(2)).toMatch(
      /^[A-Za-z0-9+\-$]*$/
    );
  });
});

describe("decodeNote", () => {
  test.each([
    ["empty text", ""],
    ["plain text", "hello world"],
    ["multiline markdown", "# Title\n\n- one\n- two\n"],
    ["unicode and emoji", "नमस्ते 👋 café"],
  ])("round-trips %s", (_label: string, text: string) => {
    expect(decodeNote(encodeNote(text))).toBe(text);
  });

  test("reads legacy base64 links without the compression prefix", () => {
    expect(decodeNote(legacyEncode("old note ✓"))).toBe("old note ✓");
  });

  test("returns an empty string for undecodable input", () => {
    expect(decodeNote("%%%not-base64%%%")).toBe("");
  });
});

describe("truncateToFit", () => {
  const urlOverhead = 40;

  test("returns text unchanged when it already fits", () => {
    expect(truncateToFit("short note", urlOverhead, 1000)).toBe("short note");
  });

  test("shortens text to a prefix whose encoded URL fits", () => {
    const text = pseudoRandomText(5000);
    const maxUrlLength = 1000;

    const truncated = truncateToFit(text, urlOverhead, maxUrlLength);

    expect(truncated.length).toBeGreaterThan(0);
    expect(truncated.length).toBeLessThan(text.length);
    expect(text.startsWith(truncated)).toBe(true);
    expect(encodeNote(truncated).length + urlOverhead).toBeLessThanOrEqual(
      maxUrlLength
    );
  });

  test("returns an empty string when nothing fits", () => {
    expect(truncateToFit("hello", 100, 10)).toBe("");
  });
});
