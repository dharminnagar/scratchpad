'use client'

import { useSyncExternalStore } from 'react'
import {
  decodeNote,
  encodeNote,
  URL_MAX_THRESHOLD,
  URL_WARN_THRESHOLD,
} from '@/lib/url-codec'

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function getSnapshot() {
  return window.location.hash.slice(1)
}

function getServerSnapshot() {
  return ''
}

function computeUrlLength(encoded: string): number {
  if (typeof window === 'undefined') return 0
  return (
    window.location.origin.length +
    window.location.pathname.length +
    1 + // '#'
    encoded.length
  )
}

export function useUrlNote() {
  const encoded = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const note = encoded ? decodeNote(encoded) : ''

  function setNote(text: string) {
    window.location.hash = text ? encodeNote(text) : ''
  }

  const urlLength = computeUrlLength(encoded)

  return {
    note,
    setNote,
    urlLength,
    isNearLimit: urlLength > URL_WARN_THRESHOLD,
    isAtLimit: urlLength > URL_MAX_THRESHOLD,
  }
}
