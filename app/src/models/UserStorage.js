"use strict";

const fs = require("fs").promises;
const path = require("path");
const jsonPath = path.join(__dirname, "../databases/users.json");
const jwt = require(`jsonwebtoken`);
const db = require("../config/db");

// TODO env로 변경
const SECRET_KEY = "test_secret_key";

class UserStorage {
    static getUsers() {
        return new Promise((resolve, reject) => {
            const query =  "SELECT * FROM users";
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

    static getUserInfo(email) {
        return new Promise((resolve, reject) => {
            const query =  "SELECT * FROM users WHERE email = ?";
            db.query(
                query,
                [email],
                (err, data) => {
                    if (err) reject(`${err}`);
                    else resolve(data[0]);
                }
            );
        });
    }

    static async save(userInfo) {
        const users = await this.getUserInfo(userInfo.email);
        if (users != undefined)  throw "이미 존재하는 아이디입니다"

        return new Promise((resolve, reject) => {
            const query =  "INSERT INTO users(email, name, password) VALUES(?, ?, ?)";
            db.query(
                query,
                [userInfo.email, userInfo.name, userInfo.password],
                (err) => {
                    if (err) reject(`${err}`);
                    else {
                        this.getUsers();
                        resolve({ success: true });
                    }
                }
            );
        });
    }

    static async issueToken(email) {
        const user = await this.getUserInfo(email);

        const payload = {
            email: user.email,
            name: user.name
        }

        const accessToken = jwt.sign(
            payload,
            SECRET_KEY,
            {
                expiresIn: "15m",
                audience: user.name,
                subject: user.name,
                issuer: "GGQ"
            }
        );

        const refreshToken = jwt.sign(
            {},
            SECRET_KEY,
            {
                expiresIn: '14d'
            }
        )

        console.log(`accessToken: ${email}, ${accessToken}`);
        console.log(`refreshToken: ${email}, ${refreshToken}`);

        user.refreshToken.push(refreshToken);
        return { accessToken: accessToken, refreshToken: refreshToken };
    }
}

module.exports = UserStorage;