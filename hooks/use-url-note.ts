'use client'

import { useEffect, useRef, useState } from 'react'
import {
  decodeNote,
  encodeNote,
  truncateToFit,
  URL_MAX_THRESHOLD,
  URL_WARN_THRESHOLD,
} from '@/lib/url-codec'

const HASH_DEBOUNCE_MS = 150

export function useUrlNote() {
  const [note, setNoteState] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Initialize from URL hash once on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNoteState(decodeNote(hash))
    }
  }, [])

  function scheduleHashWrite(text: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      window.location.hash = text ? encodeNote(text) : ''
    }, HASH_DEBOUNCE_MS)
  }

  function setNote(text: string) {
    const overhead = window.location.origin.length + window.location.pathname.length + 1
    const newEncodedLen = encodeNote(text).length

    if (newEncodedLen + overhead > URL_MAX_THRESHOLD) {
      if (text.length < note.length) {
        // Deletion: always allow, user is reducing URL length
        setNoteState(text)
        scheduleHashWrite(text)
        return
      }
      if (text.length - note.length <= 1) {
        // Single char typed at limit: silently reject
        return
      }
      // Paste exceeding limit: truncate to fit
      text = truncateToFit(text, overhead, URL_MAX_THRESHOLD)
    }

    setNoteState(text)
    scheduleHashWrite(text)
  }

  const encodedLen = note ? encodeNote(note).length : 0
  const urlOverhead =
    typeof window !== 'undefined'
      ? window.location.origin.length + window.location.pathname.length + 1
      : 0
  const urlLength = urlOverhead + encodedLen

  return {
    note,
    setNote,
    urlLength,
    isNearLimit: urlLength > URL_WARN_THRESHOLD,
    isAtLimit: urlLength > URL_MAX_THRESHOLD,
  }
}
