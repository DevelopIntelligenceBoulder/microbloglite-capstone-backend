const sanitizeHtml = require('sanitize-html');

//The configurations below are documented in /README.md so PLEASE KEEP IT UPDATED!

const allowedTags = sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe']);
const allowedAttributes = Object.assign(structuredClone(sanitizeHtml.defaults.allowedAttributes), {
    '*': ['alt', 'aria-*', 'class', 'data-*', 'lang', 'rel', 'title', 'translate'],
    iframe: [
        {
            name: 'allow',
            multiple: true,
            values: [
                //These values have been selected from the `allow` permission policies
                //which are currently included in the official embed scripts provided by
                //the sites listed in the `allowedIframeHostnames` array defined below
                //as of late January 2024. The notable EXCLUSION from this list is the
                //`autoplay` permission. We don't want everyone to be auto-rickrolled again!
                'accelerometer', 
                'clipboard-write', 
                'encrypted-media', 
                'gyroscope', 
                'picture-in-picture', 
                'web-share', 
                'fullscreen',
            ],
        },
        'allowfullscreen', 
        'frameBorder', 
        'loading', 
        'sandbox', 
        'src',
    ],
});
const allowedIframeHostnames = [
    'www.youtube.com', 
    'open.spotify.com', 
    'embed.music.apple.com', 
    'player.vimeo.com',
];

const permissiveOptions = {
    allowedTags,
    allowedAttributes,
    allowedIframeHostnames,
    allowIframeRelativeUrls: true,
};

const restrictiveOptions = {
    allowedTags: [],
    allowedAttributes: {},
};

const permissiveSanitizer = string => sanitizeHtml(string, permissiveOptions);
const restrictiveSanitizer = string => sanitizeHtml(string, restrictiveOptions);

module.exports = {
    permissiveSanitizer,
    restrictiveSanitizer,
};
