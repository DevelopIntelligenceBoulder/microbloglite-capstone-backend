const sanitizeHtml = require('sanitize-html');

// The configurations below are documented in /README.md so PLEASE KEEP IT UPDATED!


/////////////////////////////////////////////////////////////////////////////////
// RESTRICTIVE SANITIZER
const restrictiveOptions = {
    allowedTags: [],
    allowedAttributes: {},
};

const restrictiveSanitizer = string => sanitizeHtml(string, restrictiveOptions);


/////////////////////////////////////////////////////////////////////////////////
// PERMISSIVE SANITIZER
const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
    'img', 
    'iframe',
]);

const allowedAttributes = Object.assign(structuredClone(sanitizeHtml.defaults.allowedAttributes), {
    '*': ['alt', 'aria-*', 'class', 'data-*', 'lang', 'rel', 'title', 'translate'],
    iframe: [
        {
            // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#sandbox
            name: 'sandbox',
            multiple: true,
            values: [ 
                'allow-top-navigation-by-user-activation',
                // Apple Music wants us to allow all these, but we say, "Away with thee!"
                // 'allow-forms',
                // 'allow-popups',
                // 'allow-scripts',
                // 'allow-storage-access-by-user-activation',
                // 'allow-same-origin',
            ],
        },
        'allow', // This is handled specially using a custom tag transform below.
        'allowfullscreen', 
        'frameBorder', 
        'loading', 
        'src',
        'title',
    ],
});

// See https://github.com/apostrophecms/sanitize-html?tab=readme-ov-file#iframe-filters
const allowedIframeHostnames = [
    'www.youtube.com', 
    'open.spotify.com', 
    'embed.music.apple.com', 
    'player.vimeo.com',
    'widget.deezer.com',
];

// These values have been selected from the `allow` permission policies which are currently 
// included in the official embed scripts provided by the sites listed in the 
// `allowedIframeHostnames` array defined below as of late January 2024.
// The notable EXCLUSION from this list is the `autoplay` permission... We don't want 
// everyone to be auto-rickrolled again!
// See https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy#iframe_syntax
const allowedIframePermissionDirectives = [
    'accelerometer', 
    'clipboard-write', 
    'encrypted-media', 
    'fullscreen',
    'gyroscope', 
    'picture-in-picture', 
    'web-share', 
];

// We are filtering the above directives ourselves because the sanitize-html library naively 
// splits the attibute value only on a space, overlooking the semantic distinction between
// whitespaces and semicolons as delimiters in the Permissions Policy.
// See https://github.com/apostrophecms/sanitize-html/blob/c52a9f088e61719f7c51deca8c8ea0b91485a703/index.js#L322
const transformTags = {
    iframe(tagName, attribs) {
        if (!attribs.allow) return { tagName, attribs };

        const filteredDirectives = attribs.allow
            .split(/;\s*/)  // split on a semicolon followed by zero or more whitespace characters
            .filter(policy => {
                policy = policy.trimStart();
                return allowedIframePermissionDirectives
                    .some(directive => policy.startsWith(directive));
            });
        
        return {
            tagName: tagName,
            attribs: {
                ...attribs,
                allow: filteredDirectives.join('; '),
            }
        };
    },
};

const permissiveOptions = {
    allowedTags,
    allowedAttributes,
    allowedIframeHostnames,
    allowIframeRelativeUrls: true,
    transformTags,
};

const permissiveSanitizer = string => sanitizeHtml(string, permissiveOptions);

module.exports = {
    permissiveSanitizer,
    restrictiveSanitizer,
};
