'use strict';

const Joi = require('joi');
const Schwifty = require('@hapipal/schwifty');
const { v4 } = require('uuid');

// A user model only with an id and name
module.exports = class Scopes extends Schwifty.Model {

    static get tableName() {

        return 'oauth_auth_scopes';

    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.string().guid({
                version: 'uuidv4'
            }).default(() => v4()),
            name: Joi.string().required()
        });

    }
};
