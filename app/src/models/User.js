"use strict";

const UserStorage = require(`./UserStorage`);

class User {
  constructor(body) {
    this.body = body;
  }

  async oauthLogin() {
    console.log(`oauthLogin request : ${JSON.stringify(this.body)}`);
    try {
      const { accessToken, refreshToken } = await UserStorage.issueToken(
        this.body.id
      );

      console.log("oauthLogin request finish");

      return {
        success: true,
        id: this.body.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (err) {
      return { success: false, msg: err };
    }
  }

  async login() {
    const client = this.body;
    console.log(`login request : ${JSON.stringify(client)}`);
    try {
      const { id, email, password } = await UserStorage.getUserInfoByEmail(
        client.email
      );
      console.log(`find user : ${email}, ${password}`);

      const { accessToken, refreshToken } = await UserStorage.issueToken(id);

      if (email) {
        if (email === client.email && password === client.password) {
          return {
            success: true,
            id: id,
            accessToken: accessToken,
            refreshToken: refreshToken,
          };
        }
        return { success: false, msg: "비밀번호가 틀렸습니다" };
      }
      return { success: false, msg: "존재하지 않는 아이디입니다." };
    } catch (err) {
      return { success: false, msg: err };
    }
  }

  async register() {
    const client = this.body;
    console.log(`register request : ${JSON.stringify(client)}`);
    try {
      const response = await UserStorage.save(client);
      return response;
    } catch (err) {
      console.log(err);
      return { success: false, msg: err };
    }
  }
}

module.exports = User;
