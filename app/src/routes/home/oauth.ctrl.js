"use strict";

const UserStorage = require(`../../models/UserStorage`);
const OAuthStorage = require(`../../models/OAuthStorage`);
const jwt = require("jsonwebtoken");
const request = require("async-request");
const OAuth = require("../../models/OAuth");

const output = {
    register: (req, res) => {
        res.render("oauth/register");
    }
}

const process = {
    register: async (req, res) => {
        
    },
    kakaoLogin: async (req, res) => {
        const query = req.query;

        console.log(`query: ${JSON.stringify(query)}`);

        if (!Object.prototype.hasOwnProperty.call(query, "code")) {
            return res.status(400).send("invalid_code");
        }

        const authorizationCode = query.code;
        console.log(`authorizationCode: ${authorizationCode}`);

        // Access Token 요청
        const response = await request("https://kauth.kakao.com/oauth/token", {
            method: "POST",
            data: {
                grant_type: "authorization_code",
                client_id: "c56eab53aa9812c1efe939e48b8d12db",
                redirect_uri: "http://localhost:3000/kakao/test",
                code: authorizationCode,
            },
            headers: {
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
        });

        console.log(`========== kakao ==========`);

        const body = JSON.parse(response.body);

        console.log(body);
        console.log(`accessToken : `, body.access_token);
        console.log(`refreshToken : `, body.refresh_token);

        // 사용자 정보 가져오기
        const infoResponse = await request("https://kapi.kakao.com/v2/user/me", {
            method: "GET",
            headers: {
                "Contetn-type": "application/x-www-form-urlencoded;charset=utf-8",
                "Authorization": `Bearer ${body.access_token}`
            },
        });

        const kakaoInfo = JSON.parse(infoResponse.body);
        console.log(kakaoInfo);

        const user = await UserStorage.getUserInfoById(kakaoInfo.id);

        const oauth = new OAuth(
            {
                id: kakaoInfo.id,
                refreshToken: body.refresh_token,
                accessToken: body.access_token,
                provider: 'KaKao',
            }
        );
        await oauth.save();

        //location.href = "/oauth/register";
        res.redirect(`/oauth/register?id=${kakaoInfo.id}&img=${kakaoInfo.properties.profile_image}`);
        //res.status(200).send(`<div><p>이름 : ${kakaoInfo.properties.nickname}</p><img src="${kakaoInfo.properties.profile_image}"></img><p>${kakaoInfo}</p></div>`);
    }
}

module.exports = {
    output,
    process
};