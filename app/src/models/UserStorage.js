"use strict";

const jwt = require(`jsonwebtoken`);
const db = require("../config/db");
const OAuthStorage = require("./OAuthStorage");

// For Test >> TODO: REDIS
const logoutTokens = [];

class UserStorage {
  static async #removeTokenById(id) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE users SET refreshToken = NULL WHERE id = ?";
      db.query(query, [id], (err) => {
        if (err) reject(`${err}`);
        else {
          this.#getUsers();
          resolve({ success: true });
        }
      });
    });
  }

  /**
   * 전체 User 조회
   * @returns 
   */
  static #getUsers() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users";
      db.query(query, (err, data) => {
        if (err) reject(err);
        else {
          console.log(data);
          resolve(data);
        }
      });
    });
  }

  /**
   * Email 로 가입 정보 저장 (Email 가입)
   * @param {*} userInfo 
   * @returns 
   */
  static async #saveByEmail(userInfo) {
    console.log(`saveByEmail: `, userInfo);
    const users = await this.getUserInfoByEmail(userInfo.email);
    if (users != undefined) throw "이미 존재하는 이메일입니다";

    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO users(id, email, name, password) VALUES(?, ?, ?, ?)";
      db.query(
        query,
        [userInfo.email, userInfo.email, userInfo.name, userInfo.password],
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

  /**
   * ID로 가입 정보 저장 (OAuth 가입)
   * @param {*} userInfo 
   * @returns 
   */
  static async #saveById(userInfo) {
    console.log(`saveById: `, userInfo);
    const users = await this.getUserInfoById(userInfo.id);
    if (users != undefined) throw "이미 존재하는 id입니다";

    return new Promise((resolve, reject) => {
      const query = "INSERT INTO users(id, name) VALUES(?, ?)";
      db.query(query, [userInfo.id, userInfo.name], (err) => {
        if (err) reject(`${err}`);
        else {
          this.#getUsers();
          resolve({ success: true });
        }
      });
    });
  }

  /**
   * 회원 데이터베이스 삭제
   * @returns 
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM users WHERE id = ?";
      db.query(query, [id], (err, data) => {
        if (err) reject(`${err}`);
        else resolve({ success: true });
      });
    });
  }

  /**
   * ID로 User 정보 조회 (OAuth 연동의 경우 사용)
   * @param {} id 
   * @returns 
   */
  static getUserInfoById(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE id = ?";
      db.query(query, [id], (err, data) => {
        if (err) reject(`${err}`);
        else resolve(data[0]);
      });
    });
  }

  /**
   * Email로 User 정보 조회 (Email 가입의 경우 사용)
   * @param {} email 
   * @returns 
   */
  static getUserInfoByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE email = ?";
      db.query(query, [email], (err, data) => {
        if (err) reject(`${err}`);
        else resolve(data[0]);
      });
    });
  }

  /**
   * 회원 가입
   * @param {*} userInfo 
   * @returns 
   */
  static async save(userInfo) {
    if (userInfo.id != undefined) {
      await this.#saveById(userInfo);

      const { accessToken, refreshToken } = await this.issueToken(userInfo.id);

      return {
        success: true,
        id: userInfo.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } else {
      return await this.#saveByEmail(userInfo);
    }
  }

  /**
   * 로그인 시 AccessToken, RefreshToken 발급 후 DB 저장
   * @param {*} id 
   * @param {*} refreshToken 
   * @returns 
   */
  static async saveRefreshToken(id, refreshToken) {
    const users = await this.getUserInfoById(id);
    if (users == undefined) throw "존재하지 않는 유저입니다";

    return new Promise((resolve, reject) => {
      const query = "UPDATE users SET refreshToken = ? WHERE id = ?";
      db.query(query, [refreshToken, `${id}`], (err) => {
        if (err) reject(`${err}`);
        else {
          this.#getUsers();
          resolve({ success: true });
        }
      });
    });
  }

  static async getUsers(accessToken) {
    console.log(`getUsers: ${accessToken}`);
    try {
      const payload = jwt.verify(accessToken, process.env.SECRET_KEY);
      console.log("토큰 인증 성공", payload);

      // 로그아웃 확인
      if (logoutTokens.includes(accessToken)) {
        return { success: false, msg: "이미 로그아웃 된 token입니다." };
      }

      const response = await this.#getUsers();
      return { success: true, response: response };
    } catch (err) {
      console.log("토큰 인증 에러", err);
      return { success: false, msg: err };
    }
  }

  static async issueToken(id) {
    console.log(`issueToken: ${id}`);

    const user = await this.getUserInfoById(id);

    console.log(user);

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "5m",
      audience: user.name,
      subject: user.id,
      issuer: "GGQ",
    });

    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "14d",
    });

    console.log(`accessToken: ${id}, ${accessToken}`);
    console.log(`refreshToken: ${id}, ${refreshToken}`);

    await this.saveRefreshToken(id, refreshToken);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  static async removeToken(id, accessToken) {
    console.log(`removeToken: ${id}`);

    const user = await this.getUserInfoById(id);

    if (user != undefined) {
      await this.#removeTokenById(id);
      // 로그아웃 토큰 저장
      logoutTokens.push(accessToken);
      console.log(`logoutTokens: `, logoutTokens);
    }

    return { success: true, msg: "로그아웃 > 토큰 삭제" };
  }
}

module.exports = UserStorage;
