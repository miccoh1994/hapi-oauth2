'use strict';

// Load modules

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Server = require('./server');
const Package = require('../package.json');
const Querystring = require('querystring');
const { queryString } = require('object-query-string');
const { decode } = require('jsonwebtoken');
// Test shortcuts

const { describe, it, beforeEach } = exports.lab = Lab.script();
const { expect } = Code;

const REGEX_ACCESS_TOKEN = /[A-Za-z0-9\-\._~\+\/]+=*/g;

describe('Deployment', () => {

    it('registers the main plugin.', async () => {

        const server = await Server.deployment();

        expect(server.registrations[Package.name]).to.exist();
    });

});

describe('auth code grant', () => {

    let client;

    let server;

    beforeEach(async () => {

        client = {
            name: 'test client',
            clientId: '7c1dc096-0173-4daa-9077-7f3c58efadbb',
            clientSecret: undefined,
            redirectUris: ['https://www.example.com'],
            allowedGrants: ['authorization_code'],
            scopes: []
        };

        server = await Server.deployment();

    });

    it('completes auth_code grant with pkce s256', async () => {

        const codeVerifier = 'qqVDyvlSezXc64NY5Rx3BbL_aT7c2xEBgoJP9domepFZLEjo9ln8EA'; // base64urlencode(crypto.randomBytes(40));
        const codeChallenge = 'ODQwZGM4YzZlNzMyMjQyZDAxYjE5MWZkY2RkNjJmMTllMmI0NzI0ZDlkMGJlYjFlMmMxOWY2ZDI1ZDdjMjMwYg'; // base64urlencode(crypto.createHash('sha256').update(codeVerifier).digest('hex'))
        const query = queryString({
            response_type: 'code',
            client_id: client.clientId,
            redirect_uri: 'https://www.example.com',
            scope: '',
            state: 'state-is-a-secret',
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        });
        console.log(query);
        let authorizationResponse = await server.inject({
            url: `/authorize?${query}`
        });

        expect(authorizationResponse.statusCode).to.equal(302);


        let cookie = authorizationResponse.headers['set-cookie'][0].split(';')[0] + ';';

        const loginResponse = await server.inject({
            method: 'POST',
            url: '/login',
            headers: {
                cookie
            },
            payload: {
                email: 'test@example.com',
                password: 'testPassword'
            }
        });

        cookie = loginResponse.headers['set-cookie'][0].split(';')[0] + ';';


        authorizationResponse = await server.inject({
            method: 'GET',
            url: '/authorize',
            headers: {
                cookie
            }
        });

        const authorizationResponseQuery = Querystring.parse(authorizationResponse.headers.location.replace('https://www.example.com?', ''));
        const decodeCode = decode(String(authorizationResponseQuery.code));
        const state = authorizationResponseQuery.state;

        expect(authorizationResponse.statusCode).to.equal(302);
        expect(authorizationResponse.headers.location).to.match(new RegExp('https://www.example.com'));
        expect(decodeCode.client_id).to.equal(client.clientId);
        expect(decodeCode.expire_time).to.above(Date.now() / 1000);
        expect(state).to.equal('state-is-a-secret'); //change this to check header;


        const tokenResponse = await server.inject({
            method: 'POST',
            url: '/token',
            payload: {
                grant_type: 'authorization_code',
                code: authorizationResponseQuery.code,
                redirect_uri: 'https://www.example.com',
                client_id: client.clientId,
                code_verifier: codeVerifier
            }
        });

        expect(tokenResponse.statusCode).to.equal(200);
        expect(tokenResponse.result.token_type).to.equal('Bearer');
        expect(tokenResponse.result.access_token).to.match(REGEX_ACCESS_TOKEN);
        expect(tokenResponse.result.refresh_token).to.match(REGEX_ACCESS_TOKEN);
    });
});
