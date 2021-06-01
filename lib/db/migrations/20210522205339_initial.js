'use strict';

exports.up = async (knex) => {

    await knex.schema.createTable('users', (table) => {

        table.string('id').primary().notNullable();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
    });

    await knex.schema.createTable('oauth_auth_codes', (table) => {

        table.string('id').primary().notNullable();
        table.string('clientId').notNullable();
        table.string('code').notNullable().unique().index();
        table.string('codeChallenge');
        table.string('codeChallengeMethod');
        table.string('expiresAt');
        table.string('redirectUri');
        table.string('scopes');
        table.string('userId').notNullable();

    });

    await knex.schema.createTable('oauth_auth_clients', (table) => {

        table.string('clientId').primary().notNullable().unique().index();
        table.string('allowedGrants').notNullable();
        table.string('clientSecret').unique();
        table.string('name').notNullable().unique();
        table.string('redirectUris');
        table.string('scopes');
    });

    await knex.schema.createTable('oauth_auth_scopes', (table) => {

        table.string('id').primary().notNullable();
        table.string('name').notNullable().index();
    });

    await knex.schema.createTable('oauth_auth_tokens', (table) => {

        table.string('id').primary().notNullable();
        table.string('clientId');
        table.string('accessToken').notNullable().index();
        table.string('accessTokenExpiresAt').notNullable();
        table.string('refreshToken');
        table.string('refreshTokenExpiresAt');
        table.string('scopes');
        table.string('userId');
    });
};

exports.down = async (knex) => {

    await knex.schema.dropTable('users');
    await knex.schema.dropTable('oauth_auth_codes');
    await knex.schema.dropTable('oauth_auth_clients');
    await knex.schema.dropTable('oauth_auth_scopes');
    await knex.schema.dropTable('oauth_auth_tokens');

};
