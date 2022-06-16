"use strict";

const User = require(`../../models/User`);
const UserStorage = require(`../../models/UserStorage`);
const OAuthStorage = require(`../../models/OAuthStorage`);
const jwt = require("jsonwebtoken");
const request = require("async-request");

const output = {
    home: (req, res) => {
        // res.send("here is root");
        res.render("home/index");
    },
    login: (req, res) => {
        res.render("home/login");
    },
    register: (req, res) => {
        res.render("home/register");
    },
    main: (req, res) => {
        res.render("main/main");
    },
};

const callback = {
    refresh: async (req, res) => {
        // 토큰 리프레시
        const id = req.body.id;

        // oauth token인지 확인
        const oauth = await OAuthStorage.getOAuth(id);
        console.log(`refresh oauth requested: `, oauth);

        if (oauth == undefined) {
            // email 가입 유저 -> 수동으로 refresh 한다
            const result = await UserStorage.issueToken(id);
            return res.json(result);
        } else {
            const id = oauth.id;
            let oauth_accessToken = '';
            let oauth_refreshToken = '';

            // oauth 가입 유저 -> 서버로 요청 후 refresh 한다
            if (oauth.provider === 'KaKao') {
                const response = await request("https://kauth.kakao.com/oauth/token", {
                    method: "POST",
                    data: {
                        grant_type: "refresh_token",
                        client_id: process.env.KAKAO_CLIENT_ID,
                        refresh_token: oauth.refreshToken,
                    },
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                    },
                });

                console.log(`========== kakao ==========`);

                const body = JSON.parse(response.body);
                oauth_accessToken = body.access_token;
                oauth_refreshToken = body.refresh_token;

                console.log(body);
                console.log(`accessToken : `, oauth_accessToken);
                console.log(`refreshToken : `, oauth_refreshToken);

            } else {
                const response = await request(`https://www.googleapis.com/oauth2/v4/token`, {
                    method: "POST",
                    data: {
                        grant_type: "refresh_token",
                        client_id: process.env.GOOGLE_CLIENT_ID,
                        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET_KEY,
                        refresh_token: oauth.refreshToken,
                        access_type: "offline"
                    },
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                    }
                });

                console.log(`========== google ==========`);

                const body = JSON.parse(response.body);
                oauth_accessToken = body.access_token;
                oauth_refreshToken = body.refresh_token;

                console.log(body);
                console.log(`accessToken : `, oauth_accessToken);
                console.log(`refreshToken : `, oauth_refreshToken);
            }

            const { accessToken, refreshToken } = await UserStorage.issueToken(id);

            return res.json(
                {
                    success: true,
                    id: id,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    oauth_accessToken: oauth_accessToken,
                    oauth_refreshToken: oauth_refreshToken,
                  }
            );
        }
    },
    delete: async (req, res) => {
        await UserStorage.delete(req.body.id);
        await OAuthStorage.delete(req.body.id);

        return res.json({ success: true });
    },
    logout: async (req, res) => {
        // 로그아웃 토큰 저장
        const id = req.body.id;
        const accessToken = req.body.accessToken;

        const response = await UserStorage.removeToken(id, accessToken);

        return res.json(response);
    },
    login: async (req, res) => {
        const user = new User(req.body);

        const response = await user.login();

        console.log(response);

        return res.json(response);
    },
    register: async (req, res) => {
        const user = new User(req.body);

        const response = await user.register();

        console.log(`email register : `, response);

        return res.json(response);
    },
    userList: async (req, res) => {
        let token = "";
        if (
            req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.query && req.query.token) {
            token = req.query.token;
        } else {
            token = null;
        }

        console.log("requested accessToken: ", token);

        const response = await UserStorage.getUsers(token);
        return res.json(response);
    },
};

module.exports = {
    output,
    callback,
};
