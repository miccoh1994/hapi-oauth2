'use strict';



const handleResponse = (response, h) => {

    if (!h) {
        throw new Error('missing response toolkit');
    }

    const objectToArray = (headers) => {

        const arr = [];
        for (const header in headers) {

            arr.push({
                key: header,
                value: headers[header]
            });
        }

        return arr;
    };

    const setHeaders = (res, headers) => {

        objectToArray(headers).map(({ key, value }) => {

            res.header(key, value);
            return;
        });
        return;
    };


    if (response.status === 302) {
        if (!response.headers.location) {
            throw new Error('missing redirect location'); // @todo this
        }

        const res = h.response();

        setHeaders(res, response.headers);

        return res.redirect(response.headers.location);

    }

    const res = h.response(response.body);

    setHeaders(res, response.headers);

    return res.code(response.status);
};

module.exports = handleResponse;
