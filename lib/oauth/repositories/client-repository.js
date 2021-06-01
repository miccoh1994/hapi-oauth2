'use strict';

module.exports = (server) => {

    const { Clients } = server.models();

    const getByIdentifier = async (clientId) => {

        try {

            const client = await Clients.query().where({ clientId }).first();

            if (!client) {
                return;
            }

            return {
                ...client,
                id: client.clientId //ensure that client.id is set;
            };
        }
        catch (err) {
            console.error(err);
        }
    };

    // eslint-disable-next-line require-await
    const isClientValid = async (grantType, client, clientSecret) => {

        if (client.secret && client.secret !== clientSecret) {
            return false;
        }

        return client.allowedGrants.includes(grantType);

    };

    return {
        getByIdentifier,
        isClientValid
    };

};
