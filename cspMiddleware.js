/**
 * CSP Middleware for Express / Node.js
 *
 * To use this in your Express app:
 * const cspMiddleware = require('./cspMiddleware');
 * app.use(cspMiddleware);
 */
const { CSP_POLICY } = require('./csp-policy');

function cspMiddleware(req, res, next) {
  res.setHeader('Content-Security-Policy', CSP_POLICY);
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
}

module.exports = cspMiddleware;
