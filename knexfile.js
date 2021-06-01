'use strict';

const Path = require('path');
const Hoek = require('@hapi/hoek');
const Manifest = require('./test/server/manifest');
const Plugin = require('./lib/plugins/@hapipal.schwifty');

// Take schwifty registration's knex option
// but specify the plugin's migrations directory

module.exports = Hoek.applyToDefaults(
    {
        migrations: {
            directory: Path.relative(process.cwd(), Plugin.options.migrationsDir)
        },
        seeds: {
            directory: Path.relative(process.cwd(), `${Plugin.options.migrationsDir}/../seeds`)
        }
    },
    Manifest
        .get('/register/plugins', process.env)
        .find(({ plugin }) => plugin === '@hapipal/schwifty')
        .options.knex
);
