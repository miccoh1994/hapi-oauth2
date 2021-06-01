'use strict';

const { AuthorizationServer, JwtService } = require('@jmondi/oauth2-server');
const Repositories = require('./repositories');

/**
 * Registers the AuthorizationServer with the Models
 * @param {server} server - hapi server object
 * @returns AuthorizationServer
 */

module.exports = (server, options) => {

    const {
        authCodeRepository,
        clientRepository,
        tokenRepository,
        scopesRepository,
        userRepository
    } = Repositories(server);

    const jwtService = new JwtService(options.jwtSecret);

    const authorizationServer = new AuthorizationServer(
        authCodeRepository,
        clientRepository,
        tokenRepository,
        scopesRepository,
        userRepository,
        jwtService
    );

    authorizationServer.enableGrantType('client_credentials');
    authorizationServer.enableGrantType('authorization_code');
    authorizationServer.enableGrantType('refresh_token');

    return authorizationServer;

};
