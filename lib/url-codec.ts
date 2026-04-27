import LZString from "lz-string";

export const URL_WARN_THRESHOLD = 6000;
export const URL_MAX_THRESHOLD = 8000;

export function encodeNote(text: string): string {
  return "z:" + LZString.compressToEncodedURIComponent(text);
}

export function decodeNote(encoded: string): string {
  try {
    if (encoded.startsWith("z:")) {
      return LZString.decompressFromEncodedURIComponent(encoded.slice(2)) ?? "";
    }
    // Fallback: plain base64 for URLs shared before compression was added
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    return decodeURIComponent(atob(base64));
  } catch {
    return "";
  }
}

// Binary search for the longest text prefix whose encoded URL length fits within maxUrlLength.
export function truncateToFit(
  text: string,
  urlOverhead: number,
  maxUrlLength: number
): string {
  if (encodeNote(text).length + urlOverhead <= maxUrlLength) return text;
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (encodeNote(text.slice(0, mid)).length + urlOverhead <= maxUrlLength) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return text.slice(0, lo);
}
