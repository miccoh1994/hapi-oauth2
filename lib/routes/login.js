'use strict';

const Boom = require('@hapi/boom');
const Argon2 = require('argon2');
const { encryptState, decryptState } = require('./helpers/crypto');

module.exports = {
    method: 'POST',
    path: '/login',
    handler: async (req, h) => {

        try {
            const { Users } = req.models();
            const { email, password } = req.payload;
            const { password: hash, ...user } = await Users.query().where({ email }).first();

            if (!hash) {
                return Boom.unauthorized('invalid email');
            }

            const isValid = await Argon2.verify(hash, password);

            if (!isValid) {
                return Boom.unauthorized('invalid password');
            }

            const authState = await decryptState(req.state.auth);

            authState.user = user;

            const newAuthState = await encryptState(authState);

            return h.redirect('/authorize').state('auth', newAuthState);
        }
        catch (err) {
            console.log(err);
        }
    }
};
