/**
 * Single source of truth for Content-Security-Policy.
 * Synced to index.html, _headers, and cspMiddleware.js via `npm run build`.
 */
const CSP_POLICY =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline'; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
  "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
  "img-src 'self' data: https://www.dcom.lk; " +
  "media-src 'self'; " +
  "connect-src 'self' https://formsubmit.co; " +
  "frame-src 'none'; " +
  "object-src 'none'; " +
  "base-uri 'self'; " +
  "form-action 'self' https://formsubmit.co; " +
  "upgrade-insecure-requests;";

module.exports = { CSP_POLICY };
