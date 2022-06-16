"use strict";

const userInfo = localStorage.getItem("userInfo");

const newDIV = document.createElement('div');
if (userInfo === undefined) {
    newDIV.innerHTML = `로그인 정보 없음`;
} else {
    newDIV.innerHTML = `로그인 정보 : ${userInfo}`;
}

document.getElementById('container').appendChild(newDIV);