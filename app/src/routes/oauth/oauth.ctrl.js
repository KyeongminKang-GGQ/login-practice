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
    },
    googleCallback: (req, res) => {
        res.render("oauth/google");
    },
};

const callback = {
    register: async (req, res) => {
        console.log(`oauth register: ${JSON.stringify(req.body)}`);

        const user = new User(req.body);

        const response = await user.register();

        console.log(`oauth register : `, response);

        return res.json(response);
    },
    login: async (req, res) => {        
        console.log(`oauth login: ${JSON.stringify(req.body)}`);

        const authorizationCode = req.body.authorizationCode;
        const clientId = req.body.clientId;
        const redirectUri = req.body.redirectUri;    
        const clientSecret = req.body.clientSecret;    
        console.log(`authorizationCode: ${authorizationCode}`);
        console.log(`clientId: ${clientId}`);
        console.log(`redirectUri: ${redirectUri}`);
        console.log(`clientSecret: ${clientSecret}`);

        if (req.body.provider == "KaKao") {
            return res.json(await loginToKaKao(clientId, redirectUri, authorizationCode, req.body.provider));
        }

        return res.json(await loginToGoogle(clientId, redirectUri, clientSecret, authorizationCode, req.body.provider));
    },
};

async function loginToGoogle(clientId, redirectUri, clientSecret, authorizationCode, provider) {
    console.log("loginToGoogle", authorizationCode);

    // Access Token 요청
    const response = await request(`https://www.googleapis.com/oauth2/v4/token`, {
        method: "POST",
        data: {
            grant_type: "authorization_code",
            client_id: clientId,
            redirect_uri: redirectUri,
            client_secret: clientSecret,
            code: authorizationCode,
        },
        headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
    });

    console.log(`========== google ==========`);

    const body = JSON.parse(response.body);

    console.log(body);
    const accessToken = body.access_token;
    const refreshToken = body.refresh_token;
    console.log(`accessToken : `, accessToken);
    console.log(`refreshToken : `, refreshToken);

    if (accessToken == undefined) {
        return {
            success: false,
            returnCode: "AUTH0001",
            returnMessage: body.error_description,
            info: body
        };
    }

    const infoResponse = await request(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
        {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        }
    );

    const googleInfo = JSON.parse(infoResponse.body);
    console.log(googleInfo);

    if (googleInfo.id == undefined) {
        return {
            success: false,
            returnCode: "AUTH0001",
            returnMessage: googleInfo.error.message,
            info: googleInfo
        };
    }

    return await getUserInfoIfExists(
        googleInfo.id,
        accessToken,
        refreshToken,
        provider
    );
}

async function loginToKaKao(clientId, redirectUri, authorizationCode, provider) {
    console.log("loginToKaKao", authorizationCode);

    // Access Token 요청
    const response = await request("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        data: {
            grant_type: "authorization_code",
            client_id: clientId,
            redirect_uri: redirectUri,
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

    if (body.access_token == undefined) {
        return {
            success: false,
            returnCode: "AUTH0001",
            returnMessage: body.error_description,
            info: body
        };
    }

    console.log(`refreshToken : `, body.refresh_token);

    // 사용자 정보 가져오기
    const infoResponse = await request("https://kapi.kakao.com/v2/user/me", {
        method: "GET",
        headers: {
            "Contetn-type": "application/x-www-form-urlencoded;charset=utf-8",
            Authorization: `Bearer ${body.access_token}`,
        },
    });

    const kakaoInfo = JSON.parse(infoResponse.body);
    console.log(kakaoInfo);

    if (kakaoInfo.id == undefined) {
        return {
            success: false,
            returnCode: "AUTH0001",
            returnMessage: kakaoInfo.msg,
            info: kakaoInfo
        };
    }

    return await getUserInfoIfExists(
        kakaoInfo.id,
        body.access_token,
        body.refresh_token,
        provider
    );
}

async function getUserInfoIfExists(
    id,
    accessToken,
    refreshToken,
    provider
) {
    const user = await UserStorage.getUserInfoById(id);

    if (user == undefined) {
        const oauth = new OAuth({
            id: id,
            refreshToken: refreshToken,
            accessToken: accessToken,
            provider: provider,
        });
        await oauth.save();

        return {
            success: false,
            returnCode: "AUTH0000",
            returnMessage: "회원이 아닙니다. 가입하세요.",
            info: {
                provider: provider,
                id: id,
                refreshToken: refreshToken,
                accessToken: accessToken,
            },
        };
    }

    // Mapping Token 생성
    return await new User({
        id: id,
    }).oauthLogin();
}

module.exports = {
    output,
    callback,
};
