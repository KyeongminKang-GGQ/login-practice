"use strict";

const express = require("express");
const router = express.Router();

const homeCtrl = require(`${__dirname}/home/home.ctrl`);
const oAuthCtrl = require(`${__dirname}/oauth/oauth.ctrl`);

// Home 라우터 생성
router.get("/", homeCtrl.output.home);
router.get("/login", homeCtrl.output.login);
router.get("/register", homeCtrl.output.register);

router.post("/auth/v1/login", homeCtrl.callback.login);
router.post("/auth/v1/register", homeCtrl.callback.register);
router.post("/auth/v1/logout", homeCtrl.callback.logout);
router.post("/auth/v1/delete", homeCtrl.callback.delete);
router.post("/auth/v1/refresh-token", homeCtrl.callback.refresh);

router.get("/main", homeCtrl.output.main);
router.get("/users/v1/list", homeCtrl.callback.userList);

// OAuth 라우터 생성
router.get("/oauth/register", oAuthCtrl.output.register);
router.get("/kakao/test", oAuthCtrl.output.kakaoCallback);
router.get("/google/test", oAuthCtrl.output.googleCallback);

router.post("/auth/v1/oauth/register", oAuthCtrl.callback.register);
router.post("/auth/v1/oauth/login", oAuthCtrl.callback.login);

module.exports = router;
