'use strict';

const { OAuthException } = require('@jmondi/oauth2-server');


const handleError = (e, h) => {

    // @todo clean up error handling
    if (e instanceof OAuthException) {
        const { status, message } = e;
        const res = h.response({ status, message });
        return res.code(e.status);
    }

    throw e;
};

module.exports = handleError;
