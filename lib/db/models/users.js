'use strict';

const Joi = require('joi');
const Schwifty = require('@hapipal/schwifty');
const { v4 } = require('uuid');

// A user model only with an id and name
module.exports = class Users extends Schwifty.Model {

    static get tableName() {

        return 'users';

    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.string().guid({
                version: 'uuidv4'
            }).default(() => v4()),
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string()
                .pattern(
                    RegExp(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}/
                    )
                )
                .required()

        });

    }
};
