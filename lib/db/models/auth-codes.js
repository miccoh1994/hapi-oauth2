'use strict';

const Joi = require('joi');
const Schwifty = require('@hapipal/schwifty');
const { v4 } = require('uuid');

// A user model only with an id and name
module.exports = class AuthCodes extends Schwifty.Model {

    static get tableName() {

        return 'oauth_auth_codes';

    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.string().guid({
                version: 'uuidv4'
            }).default(() => v4()),
            clientId: Joi.string().required(),
            code: Joi.string().required(),
            codeChallenge: Joi.string(),
            codeChallengeMethod: Joi.string(),
            expiresAt: Joi.date().required(),
            redirectUri: Joi.string(),
            scopes: Joi.array().items(Joi.string()),
            userId: Joi.string()
        });

    }
};
