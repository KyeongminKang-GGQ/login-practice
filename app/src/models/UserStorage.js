"use strict";

class UserStorage {
    // For Test
    static #users = {
        id: ["test1", "test2", "test3"],
        password: ["123", "1234", "12345"],
        name: ["테스트", "김철수", "이영희"],
    };

    static getUserInfo(id) {
        const users = this.#users;
        const idx = users.id.indexOf(id);
        const userInfo = Object.keys(users).reduce((newUser, info) => {
            newUser[info] = users[info][idx];
            return newUser;
        }, {});

        return userInfo;
    }

    static save(userInfo) {
        const users = this.#users;
        users.id.push(userInfo.id);
        users.name.push(userInfo.name);
        users.password.push(userInfo.password);
        console.log(`users : ${users}`);
        return { success: true };
    }
}

module.exports = UserStorage;