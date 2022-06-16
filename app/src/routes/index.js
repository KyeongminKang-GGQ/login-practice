"use strict";

const express = require("express");
const router = express.Router();

const homeCtrl = require(`${__dirname}/home/home.ctrl`);
const oAuthCtrl = require(`${__dirname}/oauth/oauth.ctrl`);

// Home 라우터 생성
router.get("/", homeCtrl.output.home);
router.get("/login", homeCtrl.output.login);
router.get("/register", homeCtrl.output.register);

router.post("/auth/v1/login", homeCtrl.process.login);
router.post("/auth/v1/register", homeCtrl.process.register);
router.post("/auth/v1/logout", homeCtrl.process.logout);

router.get("/main", homeCtrl.output.main);
router.get("/users/v1/list", homeCtrl.process.userList);

// OAuth 컨트롤 라우터 생성
router.get("/oauth/register", oAuthCtrl.output.register);
router.get("/kakao/test", oAuthCtrl.output.kakaoCallback);
router.get("/google/test", oAuthCtrl.output.googleCallback);

router.post("/auth/v1/oauth/register", oAuthCtrl.process.register);
router.post("/auth/v1/oauth/login", oAuthCtrl.process.login);

module.exports = router;
