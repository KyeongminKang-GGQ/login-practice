"use strict";

// 모듈
const express = require("express");
const bodyParser = require("body-parser");
const app = express();


// 라우팅
const home = require("./src/routes/home");

// 앱 세팅
app.set("views", "./src/views");

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

// 정적 경로 추가
app.use(express.static(`${__dirname}/src/public`));

// bodyParser 미들웨어 등록
app.use(bodyParser.json());
// URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함 될 경우 제대로 인식되지 않는 문제 해결
app.use(bodyParser.urlencoded({ extended: true}));

// 미들웨어 등록
app.use("/", home);

// 서버 실행
module.exports = app;

// app.listen(PORT, () => {
//     console.log("server start");
// });