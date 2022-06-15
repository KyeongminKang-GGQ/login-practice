"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require(`${__dirname}/home.ctrl`);
const oauthCtrl = require(`${__dirname}/oauth.ctrl`);

router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/register", ctrl.output.register);

router.post("/auth/v1/login", ctrl.process.login);
router.post("/auth/v1/register", ctrl.process.register);

router.get("/main", ctrl.output.main);
router.get("/users/v1/list", ctrl.process.userList);

router.get("/oauth/register", oauthCtrl.output.register);
router.post("/auth/v1/oauth/register", oauthCtrl.process.register);
router.get("/kakao/test", oauthCtrl.process.kakaoLogin);

module.exports = router;