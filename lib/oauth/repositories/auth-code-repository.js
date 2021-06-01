'use strict';

const { DateInterval } = require('@jmondi/oauth2-server');
const { generate: generateToken } = require('rand-token');

module.exports = (server) => {

    const { AuthCodes } = server.models();

    const getByIdentifier = async (authCodeCode) => {

        return await AuthCodes.query().where({ code: authCodeCode });
    };

    // eslint-disable-next-line require-await
    const issueAuthCode = async (client, user, scopes) => {

        return {
            code: generateToken(16),
            user,
            client,
            redirectUri: '', //?
            codeChallenge: undefined,
            codeChallengeMethod: undefined,
            expiresAt: new DateInterval('1h').getEndDate(),
            scopes
        };
    };

    const persist = async ({ client: { clientId }, code, codeChallenge, codeChallengeMethod, expiresAt, redirectUri, scopes, user }) => {

        await AuthCodes.query().insert({
            clientId,
            code,
            codeChallenge,
            codeChallengeMethod,
            expiresAt,
            redirectUri,
            scopes,
            userId: user.id
        });
        return;
    };

    const isRevoked = async (authCodeCode) => {

        const authCode = await getByIdentifier(authCodeCode);
        return Date.now() > new Date(authCode.expiresAt).getTime();
    };

    const revoke = async (authCodeCode) => {

        await AuthCodes.query().delete().where({ code: authCodeCode });
    };

    return {
        issueAuthCode,
        persist,
        revoke,
        isRevoked,
        getByIdentifier
    };
};
