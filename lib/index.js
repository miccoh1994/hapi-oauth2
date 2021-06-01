'use strict';

const HauteCouture = require('@hapipal/haute-couture');

const OauthServer = require('./oauth');

const internals = {};

exports.plugin = {
    name: 'hapi-oauth2',
    pkg: require('../package.json'),
    async register(server, options) {

        await HauteCouture.compose(server, options);
        server.ext('onPreStart',internals.initOauth, { after: '@hapipal/schwifty', bind: options });
    }
};

internals.initOauth = (server, options) => {

    const oauth = OauthServer(server, options);
    server.decorate('server', 'oauth', oauth);
    server.decorate('request', 'oauth', oauth);

};

exports.models = {};
