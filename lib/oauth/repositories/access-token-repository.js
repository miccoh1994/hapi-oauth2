'use strict';

const { DateInterval } = require('@jmondi/oauth2-server');
const { generate: generateToken } = require('rand-token');

const registerRepository = (server) => {

    const { Tokens } = server.models();

    const revoke = async ({ accessToken }) => {

        await Tokens.query().delete().where({ accessToken });
        return;

    };

    // eslint-disable-next-line require-await
    const issueToken = async (client, scopes, user) => {

        return {
            accessToken: generateToken(16),
            accessTokenExpiresAt: new DateInterval('1h').getEndDate(),
            client,
            user,
            scopes
        };
    };

    // eslint-disable-next-line require-await
    const issueRefreshToken = async (accessToken) => {

        accessToken.refreshToken = generateToken(16);
        accessToken.refreshTokenExpiresAt = new DateInterval('2h').getEndDate();
        return accessToken;
    };

    const persist = async (token) => {

        const { client: { clientId }, accessToken, user: { id: userId }, ...rest } = token;

        await Tokens.query().insert({
            clientId,
            accessToken,
            userId,
            ...rest
        });
        return;
    };

    // eslint-disable-next-line require-await
    const isRefreshTokenRevoked = async ({ refreshTokenExpiresAt }) => {

        return Date.now() > (refreshTokenExpiresAt.getTime() ?? 0);
    };

    const getByRefreshToken = async (refreshToken) => {

        return await Tokens.query().where({ refreshToken }).first();
    };

    return {
        revoke,
        issueToken,
        issueRefreshToken,
        persist,
        isRefreshTokenRevoked,
        getByRefreshToken
    };
};

module.exports = registerRepository;
