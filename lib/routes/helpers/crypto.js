'use strict';

const Iron = require('@hapi/iron');

const Package = require('../../../package.json');


const getPassword = () => {

    const password = process.env.OAUTH_CRYPTO_SECRET;

    if (!password) {
        throw new Error(`${Package.name}: OAUTH_CRYPTO_SECRET environmental variable is not set`);
    }

    if (password.length < 32) {
        throw new Error(`${Package.name}: OAUTH_CRYPTO_SECRET must be at least 32 characters`);
    }

    return password;
};

const encryptState = async (state) => {

    const password = getPassword();

    try {

        const sealed = await Iron.seal(state, password, Iron.defaults);
        return sealed;
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }

};

const decryptState = async (state) => {

    const password = getPassword();

    try {
        const unsealed = await Iron.unseal(state, password, Iron.defaults);
        return unsealed;
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
};

module.exports = {
    encryptState,
    decryptState
};
