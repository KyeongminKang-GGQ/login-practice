// 서버를 띄워주는 코드
"use strict";

const app = require("../app");
const PORT = 3000;

app.listen(PORT, () => {
    console.log("server start");
});