/**
 * CSP Middleware for Express / Node.js
 * 
 * To use this in your Express app:
 * const cspMiddleware = require('./cspMiddleware');
 * app.use(cspMiddleware);
 */
function cspMiddleware(req, res, next) {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
        "img-src 'self' data: https://www.dcom.lk; " +
        "media-src 'self'; " +
        "connect-src 'self' https://formsubmit.co; " +
        "frame-src 'none'; " +
        "object-src 'none';"
    );
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
    next();
}

module.exports = cspMiddleware;
