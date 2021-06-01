'use strict';

const Joi = require('joi');
const Schwifty = require('@hapipal/schwifty');

// A user model only with an id and name
module.exports = class Clients extends Schwifty.Model {

    static get tableName() {

        return 'oauth_auth_clients';

    }

    static get joiSchema() {

        return Joi.object({
            clientId: Joi.string(),
            clientSecret: Joi.string(),
            allowedGrants: Joi.array().items(Joi.string()),
            name: Joi.string().required(),
            redirectUris: Joi.array().items(Joi.string()),
            scopes: Joi.array().items(Joi.string())
        });

    }
};
