"use strict";

class UserStorage {
    // For Test
    static #users = {
        id: ["test1", "test2", "test3"],
        password: ["123", "1234", "12345"],
        name: ["테스트", "김철수", "이영희"],
    };

    static getUsers(...fields) {
        const users = this.#users;
        const newUsers = fields.reduce((newUsers, field) => {
            console.log(`reduce : ${newUsers}, ${field}`);
            if (users.hasOwnProperty(field)) {
                newUsers[field] = users[field];
            }
            return newUsers;
        }, {});
        console.log(`userList: ${newUsers}`);
        return newUsers;
    }
}

module.exports = UserStorage;