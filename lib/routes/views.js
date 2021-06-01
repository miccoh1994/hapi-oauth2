'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/login',
        handler: (req, h) => {

            return h.view('login');
        }
    }
];
