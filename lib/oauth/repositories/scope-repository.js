'use strict';

module.exports = (server) => {

    const { Scopes } = server.models();

    const getAllByIdentifiers = async (scopeNames) => {

        const scope = await Scopes.query().whereIn('name', scopeNames);
        return scope;
    };

    const finalize = (scopes) => {

        return scopes;
    };

    return {
        getAllByIdentifiers,
        finalize
    };
};
