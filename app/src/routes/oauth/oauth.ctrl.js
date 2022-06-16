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

const process = {
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
    console.log(`authorizationCode: ${authorizationCode}`);

    if (req.body.provider == "KaKao") {
      return res.json(await loginToKaKao(authorizationCode, req.body.provider));
    }

    return res.json(await loginToGoogle(authorizationCode, req.body.provider));
  },
};

async function loginToGoogle(authorizationCode, provider) {
  console.log("loginToGoogle", authorizationCode);

  // Access Token 요청
  const response = await request(`https://www.googleapis.com/oauth2/v4/token`, {
    method: "POST",
    data: {
      grant_type: "authorization_code",
      client_id:
        "61660663640-3mtk3ple6f9dv2tuohq7fj5imm6vfs00.apps.googleusercontent.com",
      redirect_uri: "http://localhost:3000/google/test",
      client_secret: "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",
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

  return await getUserInfoIfExists(
    googleInfo.id,
    accessToken,
    refreshToken,
    googleInfo.picture,
    provider
  );
}

async function loginToKaKao(authorizationCode, provider) {
  console.log("loginToKaKao", authorizationCode);

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
      Authorization: `Bearer ${body.access_token}`,
    },
  });

  const kakaoInfo = JSON.parse(infoResponse.body);
  console.log(kakaoInfo);

  return await getUserInfoIfExists(
    kakaoInfo.id,
    body.access_token,
    body.refersh_token,
    kakaoInfo.properties.profile_image,
    provider
  );
}

async function getUserInfoIfExists(
  id,
  accessToken,
  refreshToken,
  imageUrl,
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
        profile_image: imageUrl,
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
  process,
};
