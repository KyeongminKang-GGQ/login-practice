"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require(`${__dirname}/home.ctrl`);

router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/register", ctrl.output.register);

router.post("/auth/v1/login", ctrl.process.login);
router.post("/auth/v1/register", ctrl.process.register);
router.get("/kakao/test", ctrl.process.kakaoLogin);

router.get("/main", ctrl.output.main);
router.get("/users/v1/list", ctrl.process.userList);

module.exports = router;