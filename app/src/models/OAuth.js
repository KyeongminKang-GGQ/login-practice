"use strict";

const OAuthStorage = require(`./OAuthStorage`);

class OAuth {
    constructor(body) {
        this.body = body;
    }

    async save() {
        const client = this.body;
        console.log(`save oauth : ${JSON.stringify(client)}`);
        try {
            const response = await OAuthStorage.save(client);
            return response;
        } catch (err) {
            return { success: false, msg: err };
        }
    }
}

module.exports = OAuth;