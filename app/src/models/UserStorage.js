"use strict";

const fs = require("fs").promises;
const path = require("path");
const jsonPath = path.join(__dirname, "../databases/users.json");

class UserStorage {
    static #getUserInfo(data, email) {
        const users = JSON.parse(data);
        const idx = users.email.indexOf(email);
        const userInfo = Object.keys(users).reduce((newUser, info) => {
            newUser[info] = users[info][idx];
            return newUser;
        }, {});
        return userInfo;
    }

    static #getUsers(data, isAll, fields) {
        const users = JSON.parse(data);
        if (isAll) return users;
        const newUsers = fields.reduce((newUsers, field) => {
            if (users.hasOwnProperty(field)) {
                newUsers[field] = users[field];
            }
            return newUsers;
        }, {});
        return newUsers;
    }

    static getUsers(isAll, ...fields) {
        return fs.readFile(jsonPath)
            .then((data) => {
               return this.#getUsers(data, isAll, fields);
            })
            .catch(console.error);
    }

    static getUserInfo(email) {
        return fs.readFile(jsonPath)
            .then((data) => {
               return this.#getUserInfo(data, email);
            })
            .catch(console.error);
    }

    static async save(userInfo) {
        const users = await this.getUsers(true);
        console.log(`save ${JSON.stringify(users)}`);
        if (users.email.includes(userInfo.email)) throw "이미 존재하는 아이디입니다";
        users.email.push(userInfo.email);
        users.name.push(userInfo.name);
        users.password.push(userInfo.password);
        
        fs.writeFile(jsonPath, JSON.stringify(users));      
        return { success: true };
    }
}

module.exports = UserStorage;