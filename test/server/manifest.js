'use strict';

const Path = require('path');
const Dotenv = require('dotenv');
const Confidence = require('@hapipal/confidence');
const Toys = require('@hapipal/toys');
const Schwifty = require('@hapipal/schwifty');

Dotenv.config();
console.log(process.env.OAUTH_CRYPTO_SECRET);
module.exports = new Confidence.Store({
    server: {
        host: 'localhost',
        port: {
            $param: 'PORT',
            $coerce: 'number',
            $default: '8800'
        },
        debug: {
            $filter: 'NODE_ENV',
            $default: {
                log: ['error', 'start'],
                request: ['error']
            },
            production: {
                request: ['implementation']
            }
        }
    },
    register: {
        plugins: [
            {
                plugin: '@hapipal/schwifty',
                options: {
                    $filter: 'NODE_ENV',
                    $default: {},
                    $base: {
                        migrateOnStart: true,
                        knex: {
                            client: 'sqlite3',
                            useNullAsDefault: true,
                            connection: {
                                filename: Path.relative(process.cwd(), `test.db`)
                            },
                            migrations: {
                                stub: Schwifty.migrationsStubPath
                            }
                        }
                    },
                    testpostgres: {
                        migrateOnStart: true,
                        knex: {
                            client: 'pg',
                            useNullAsDefault: true,
                            connection: {
                                host: '127.0.0.1',
                                user: 'directus',
                                password: 'directus',
                                database: 'directus'
                            }
                        }
                    }
                }
            },
            {
                plugin: '../../lib',
                options: {
                    jwtSecret: process.env.OAUTH_JWT_SECRET
                }
            },
            {
                plugin: {
                    $filter: 'NODE_ENV',
                    $default: '@hapipal/hpal-debug',
                    production: Toys.noop
                }
            }
        ]
    }
});
