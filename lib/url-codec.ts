export const URL_WARN_THRESHOLD = 6000
export const URL_MAX_THRESHOLD = 8000

export function encodeNote(text: string): string {
  return btoa(encodeURIComponent(text))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function decodeNote(encoded: string): string {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    return decodeURIComponent(atob(base64))
  } catch {
    return ''
  }
}
