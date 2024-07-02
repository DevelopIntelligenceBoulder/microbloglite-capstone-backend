const { rateLimit } = require('express-rate-limit');
const md5 = require('md5');

// Client uniqueness is determined by token (if present) or an MD5 hash of the IP and User-Agent.
// The latter is intended to distinguish clients on the same local network in most cases, to
// protect on-site classes from unnecessary disruption. There is a minor risk that someone may
// circumvent our rate limiter (on endpoints which do not require a token) by overriding their 
// User-Agent. But this mitigation should be sufficient unless we get specifically targeted.
const fingerprinter = (req, _res) => req.get('Authorization') || md5(req.ip + req.get('User-Agent'));

const [maxRequestsPerWindow, windowInMinutes] = [100, 2] // Max 100 requests every 2 minutes
const message = `too many requests: you can only make ${maxRequestsPerWindow} requests every ${windowInMinutes} minutes; please wait ${windowInMinutes} minutes before trying again.`

const limiter = rateLimit({
    max: maxRequestsPerWindow,
    windowMs: windowInMinutes * 60 * 1000,
    message: {
        message,
        statusCode: 429,
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: fingerprinter,
});

module.exports = limiter;
