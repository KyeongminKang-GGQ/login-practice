"use strict";

const jwt = require(`jsonwebtoken`);
const db = require("../config/db");

class OAuthStorage {
    static async save(info) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO oauth(id, accessToken, refreshToken, provider) VALUES(?, ?, ?, ?)";
            db.query(
                query,
                [info.id, info.accessToken, info.refreshToken, info.provider],
                (err) => {
                    if (err) reject(`${err}`);
                    else {
                        this.#getOAuth();
                        resolve({ success: true });
                    }
                }
            );
        });
    }

    static #getOAuth() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM oauth";
            db.query(
                query,
                (err, data) => {
                    if (err) reject(err);
                    else {
                        console.log(data);
                        resolve(data);
                    }
                }
            );
        });
    }
}

module.exports = OAuthStorage;