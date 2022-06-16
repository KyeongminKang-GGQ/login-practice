"use strict";

const UserStorage = require(`../../models/UserStorage`);
const OAuthStorage = require(`../../models/OAuthStorage`);
const jwt = require("jsonwebtoken");
const request = require("async-request");
const OAuth = require("../../models/OAuth");
const User = require(`../../models/User`);

const output = {
    register: (req, res) => {
        res.render("oauth/register");
    },
    kakaoCallback: (req, res) => {
        res.render("oauth/kakao");
    }
}

const process = {
    register: async (req, res) => {
        console.log(`oauth register: ${JSON.stringify(req.body)}`);

        const user = new User(req.body);

        const response = await user.register();

        console.log(`oauth register : `, response);

        return res.json(response);
    },
    kakaoLogin: async (req, res) => {
        console.log(`kakaoLogin: ${JSON.stringify(req.body)}`);

        const authorizationCode = req.body.authorizationCode;
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

        if (user == undefined) {
            const oauth = new OAuth(
                {
                    id: kakaoInfo.id,
                    refreshToken: body.refresh_token,
                    accessToken: body.access_token,
                    provider: 'KaKao',
                }
            );
            await oauth.save();

            return res.json({
                success: false,
                returnCode: 'AUTH0000',
                returnMessage: '회원이 아닙니다. 가입하세요.',
                info: {
                    provider: 'KaKao',
                    id: kakaoInfo.id,
                    profile_image: kakaoInfo.properties.profile_image
                },
            });
        }

        return res.json({
            success: true,
        })

        //location.href = "/oauth/register";
        //res.redirect(`/oauth/register?id=${kakaoInfo.id}&img=${kakaoInfo.properties.profile_image}`);
        //res.status(200).send(`<div><p>이름 : ${kakaoInfo.properties.nickname}</p><img src="${kakaoInfo.properties.profile_image}"></img><p>${kakaoInfo}</p></div>`);
    }
}

module.exports = {
    output,
    process
};