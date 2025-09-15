// Client-side encryption utilities for sensitive data like event_log
const ENCRYPTION_KEY_NAME = "harmony-navigator-key"

// Generate or retrieve encryption key
async function getEncryptionKey(): Promise<CryptoKey> {
  // Try to get existing key from IndexedDB
  const existingKey = localStorage.getItem(ENCRYPTION_KEY_NAME)

  if (existingKey) {
    const keyData = JSON.parse(existingKey)
    return await crypto.subtle.importKey("raw", new Uint8Array(keyData), { name: "AES-GCM" }, false, [
      "encrypt",
      "decrypt",
    ])
  }

  // Generate new key
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])

  // Store key
  const exportedKey = await crypto.subtle.exportKey("raw", key)
  localStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(Array.from(new Uint8Array(exportedKey))))

  return key
}

export async function encryptText(text: string): Promise<string> {
  if (!text) return text

  const key = await getEncryptionKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encodedText = new TextEncoder().encode(text)

  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedText)

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)

  // Convert to base64
  return btoa(String.fromCharCode(...combined))
}

export async function decryptText(encryptedText: string): Promise<string> {
  if (!encryptedText) return encryptedText

  try {
    const key = await getEncryptionKey()

    // Convert from base64
    const combined = new Uint8Array(
      atob(encryptedText)
        .split("")
        .map((char) => char.charCodeAt(0)),
    )

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)

    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted)

    return new TextDecoder().decode(decrypted)
  } catch (error) {
    console.error("Decryption failed:", error)
    return encryptedText // Return original if decryption fails
  }
}
