"use strict";

// 모듈
const express = require("express");
const app = express();

const PORT = 3000;

// 라우팅
const home = require("./routes/home");

// 앱 세팅
app.set("views", "./views");

// 뷰 엔진 해석
app.set("view engine", "ejs");

// Rounter와 Controller 분리
// app.get("/", (req, res) => {
//     // res.send("here is root");
//     res.render("home/index");
// });

// app.get("/login", (req, res) => {
//     res.render("home/login");
// });

// 미들웨어 등록
app.use("/", home);

module.exports = app;

// app.listen(PORT, () => {
//     console.log("server start");
// });