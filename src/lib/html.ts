// Escape text before it is interpolated into HTML: the owner's notification
// email and the owner's confirm/release pages. Visitors type some of these
// values (name, message), so nothing goes into the markup raw.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
