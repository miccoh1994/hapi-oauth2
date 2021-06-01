'use strict';

const Argon2 = require('argon2');

module.exports = [{
    method: 'POST',
    path: '/ouath2/register',
    handler: async (req, h) => {

        const { Users } = req.models();
        const user = req.payload;
        const hash = await Argon2.hash(user.password);

        const newUser = await Users.query().insertAndFetch({
            ...user,
            password: hash
        });

        return newUser;

    }
},
{
    method: 'GET',
    path: '/users',
    handler: async (req, h) => {

        const { Users } = req.models();

        const newUser = await Users.query().select();

        return newUser;

    }
}
];
