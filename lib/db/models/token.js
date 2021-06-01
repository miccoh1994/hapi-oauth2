'use strict';

const Joi = require('joi');
const Schwifty = require('@hapipal/schwifty');
const { v4 } = require('uuid');

// A user model only with an id and name
module.exports = class Tokens extends Schwifty.Model {

    static get tableName() {

        return 'oauth_auth_tokens';

    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.string().guid({
                version: 'uuidv4'
            }).default(() => v4()),
            clientId: Joi.string().required(),
            accessToken: Joi.string().required(),
            accessTokenExpiresAt: Joi.date().required(),
            refreshToken: Joi.string(),
            refreshTokenExpiresAt: Joi.date(),
            scopes: Joi.array().items(Joi.string()),
            userId: Joi.string().required()
        });

    }
};
