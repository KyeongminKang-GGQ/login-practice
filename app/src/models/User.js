"use strict";

const UserStorage = require(`./UserStorage`);


class User {
    constructor(body) {
        this.body = body;
    }

    async login() {
        const client = this.body;
        console.log(`login request : ${JSON.stringify(client)}`);
        const { email, password } = await UserStorage.getUserInfo(client.email);
        console.log(`find user : ${email}, ${password}`);

        //const { accessToken, refreshToken } = UserStorage.issueToken(email);

        if (email) {
            if (email === client.email && password === client.password) {
                return { success: true, accessToken: accessToken, refreshToken: refreshToken };
            }
            return { success: false,  msg: "비밀번호가 틀렸습니다" };
        }
        return { success: false, msg: "존재하지 않는 아이디입니다." };
    }

    async register() {
        const client = this.body;
        console.log(`register request : ${JSON.stringify(client)}`);
        try {
            const response = await UserStorage.save(client);
            return response;
        } catch (err) {
            return { success: false, msg: err };
        }
    }
}

module.exports = User;