'use strict';

const { OAuthResponse } = require('@jmondi/oauth2-server');
const { OAuthRequest, handleError, handleResponse, Crypto } = require('./helpers');
const { decryptState } = require('./helpers/crypto');

module.exports = [
    {
        method: 'GET',
        path: '/authorize',
        handler: async (req, h) => {

            const { oauth } = req;
            try {

                let authRequest;

                //if there is no state we need to redirect the user to login and set the state;
                if (!req.state.auth) {
                    const request = OAuthRequest(req); //new is specified in the helper function;
                    authRequest = await oauth.validateAuthorizationRequest(request);
                    const oauthState = await Crypto.encryptState(authRequest);
                    h.state('auth', oauthState);
                    return h.redirect('/login');
                }

                authRequest = await decryptState(req.state.auth);




                // At this point you should redirect the user to an authorization page.
                // This form will ask the user to approve the client and the scopes requested.

                // Once the user has approved or denied the client update the status
                // (true = approved, false = denied)
                authRequest.isAuthorizationApproved = true;
                const oauthResponse = await oauth.completeAuthorizationRequest(authRequest);

                return handleResponse(oauthResponse, h);

            }
            catch (e) {
                console.log(e);
                return handleError(e, h);
            }

        }
    },
    {
        method: 'POST',
        path: '/token',
        handler: async (req, h) => {

            const { oauth } = req;
            const res = h.response();
            const response = new OAuthResponse(res);
            const request = OAuthRequest(req);
            try {
                const oauthResponse = await oauth.respondToAccessTokenRequest(request, response);
                return handleResponse(oauthResponse, h);
            }
            catch (e) {
                console.log(e);
                handleError(e, h);
            }
        }
    }];
