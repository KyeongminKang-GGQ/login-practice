"use strict";

const jwt = require(`jsonwebtoken`);
const db = require("../config/db");

class OAuthStorage {
    static async save(info) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO oauth(id, accessToken, refreshToken, provider) VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE accessToken = ?, refreshToken = ?";
            db.query(
                query,
                [info.id, info.accessToken, info.refreshToken, info.provider, info.accessToken, info.refreshToken],
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

    static async getOAuth(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM oauth WHERE id = ?";
            db.query(
                query,
                [id],
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