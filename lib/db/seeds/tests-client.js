'use strict';

//const { v4 } = require('uuid');

exports.seed = (knex) => {

    const client = {
        clientId: '7c1dc096-0173-4daa-9077-7f3c58efadbb',
        name: 'test client',
        clientSecret: undefined,
        redirectUris: ['https://www.example.com'],
        allowedGrants: ['authorization_code'],
        scopes: []
    };

    return knex('oauth_auth_clients').del().then( () => {

        return knex('oauth_auth_clients').insert(client).catch((e) => {

            console.log(e);
        });
    });
};
