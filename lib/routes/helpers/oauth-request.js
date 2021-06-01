'use strict';

const { OAuthRequest: Request } = require('@jmondi/oauth2-server');

const OAuthRequest = (req) => {

    const { method, payload, ...other } = req;

    return new Request({
        method: method.toUpperCase(),
        body: payload,
        ...other
    });
};

module.exports = OAuthRequest;
