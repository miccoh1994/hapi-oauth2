'use strict';

const Argon2 = require('argon2');

exports.seed = async (knex) => {

    const password = await Argon2.hash('testPassword');

    const user = {
        id: '0a6c1e29-da2c-4fc8-ad2e-1747676036c3',
        first_name: 'Test',
        email: 'test@example.com',
        last_name: 'User',
        password
    };

    knex('users').del().then( () => {

        return knex('users').insert(user).catch((e) => {

            console.log(e);
        });
    });
};
