"use client";

import { useEffect, useRef, useState } from "react";
import {
  decodeNote,
  encodeNote,
  truncateToFit,
  URL_MAX_THRESHOLD,
  URL_WARN_THRESHOLD,
} from "@/lib/url-codec";

const HASH_DEBOUNCE_MS = 150;

type NoteState = { text: string; encodedLen: number };

export function useUrlNote() {
  const [{ text: note, encodedLen }, setNoteState] = useState<NoteState>({
    text: "",
    encodedLen: 0,
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // One-time mount initialization from URL hash — not a cascading render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNoteState({ text: decodeNote(hash), encodedLen: hash.length });
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function scheduleHashWrite(encoded: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      window.location.hash = encoded;
    }, HASH_DEBOUNCE_MS);
  }

  function setNote(text: string) {
    const overhead =
      window.location.origin.length + window.location.pathname.length + 1;
    let encoded = encodeNote(text);

    if (encoded.length + overhead > URL_MAX_THRESHOLD) {
      if (text.length < note.length) {
        // Deletion: always allow, user is reducing URL length
        setNoteState({ text, encodedLen: encoded.length });
        scheduleHashWrite(encoded);
        return;
      }
      if (text.length - note.length <= 1) {
        // Single char typed at limit: silently reject
        return;
      }
      // Paste exceeding limit: truncate to fit
      text = truncateToFit(text, overhead, URL_MAX_THRESHOLD);
      encoded = encodeNote(text);
    }

    setNoteState({ text, encodedLen: encoded.length });
    scheduleHashWrite(encoded);
  }

  const urlOverhead =
    typeof window !== "undefined"
      ? window.location.origin.length + window.location.pathname.length + 1
      : 0;
  const urlLength = urlOverhead + encodedLen;

  return {
    note,
    setNote,
    isNearLimit: urlLength > URL_WARN_THRESHOLD,
    isAtLimit: urlLength > URL_MAX_THRESHOLD,
  };
}
