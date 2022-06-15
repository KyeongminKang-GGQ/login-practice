"use strict";

const fs = require("fs").promises;
const path = require("path");
const jsonPath = path.join(__dirname, "../databases/users.json");
const jwt = require(`jsonwebtoken`);
const db = require("../config/db");

class UserStorage {
    static #getUserEmail() {
        return new Promise((resolve, reject) => {
            const query = "SELECT email FROM users";
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

    static #getUsers() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users";
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
            const query = "SELECT * FROM users WHERE email = ?";
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
        if (users != undefined) throw "이미 존재하는 아이디입니다"

        return new Promise((resolve, reject) => {
            const query = "INSERT INTO users(email, name, password) VALUES(?, ?, ?)";
            db.query(
                query,
                [userInfo.email, userInfo.name, userInfo.password],
                (err) => {
                    if (err) reject(`${err}`);
                    else {
                        this.#getUsers();
                        resolve({ success: true });
                    }
                }
            );
        });
    }

    static async saveRefreshToken(email, refreshToken) {
        const users = await this.getUserInfo(email);
        if (users == undefined) throw "존재하지 않는 유저입니다"

        return new Promise((resolve, reject) => {
            const query = "UPDATE users SET refreshToken = ? WHERE email = ?";
            db.query(
                query,
                [refreshToken, email],
                (err) => {
                    if (err) reject(`${err}`);
                    else {
                        this.#getUsers();
                        resolve({ success: true });
                    }
                }
            );
        });
    }

    static async getUsers(accessToken) {
        console.log(`getUsers: ${accessToken}`);
        try {
            const payload = jwt.verify(accessToken, process.env.SECRET_KEY);
            console.log('토큰 인증 성공', payload);
            const response = await this.#getUserEmail();
            return { success: true, response: response };
        } catch (err) {
            console.log('토큰 인증 에러', err);
            return { success: false, msg: err };
        }
    }

    static async issueToken(email) {
        console.log(`issueToken ${email}`);

        const user = await this.getUserInfo(email);

        console.log(user);

        const payload = {
            email: user.email,
            name: user.name
        }

        const accessToken = jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
                expiresIn: "15m",
                audience: user.name,
                subject: user.name,
                issuer: "GGQ"
            }
        );

        const refreshToken = jwt.sign(
            {},
            process.env.SECRET_KEY,
            {
                expiresIn: '14d'
            }
        )

        console.log(`accessToken: ${email}, ${accessToken}`);
        console.log(`refreshToken: ${email}, ${refreshToken}`);

        await this.saveRefreshToken(email, refreshToken);

        return { accessToken: accessToken, refreshToken: refreshToken };
    }
}

module.exports = UserStorage;