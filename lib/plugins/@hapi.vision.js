'use strict';

const Handlebars = require('handlebars');

module.exports = {
    options: {
        engines: { html: Handlebars },
        relativeTo: __dirname,
        path: `${__dirname}/../views`
    }
};
