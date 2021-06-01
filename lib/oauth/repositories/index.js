'use strict';

module.exports = (server) => ({
    authCodeRepository: require('./auth-code-repository')(server),
    clientRepository: require('./client-repository')(server),
    tokenRepository: require('./access-token-repository')(server),
    scopesRepository: require('./scope-repository')(server),
    userRepository: require('./user-repository')(server)
});
