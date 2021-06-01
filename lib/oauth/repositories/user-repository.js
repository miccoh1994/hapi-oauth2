'use strict';

module.exports = (server) => {

    const { Users } = server.models();

    //should verify the user has access to client by checking grantTypes and client_id of user, maybe;

    const getUserByCredentials = async (identifier, password, grantType, client) => {
        //maybe need to verify if is user if there is a password present;
        const user = await Users.query().findById(identifier);
        return user;

    };

    const extraAccessTokenFields = (user) => {

        return {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        };
    };

    return {
        getUserByCredentials,
        extraAccessTokenFields
    };

};
