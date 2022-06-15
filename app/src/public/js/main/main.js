"use strict";

const button = document.querySelector("button");

button.addEventListener("click", getUserList);

function getUserList() {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    console.log(accessToken);
    console.log(refreshToken);

    fetch("/users/v1/list", {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "Authorization": `Bearer ${accessToken}`
        }
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                alert(`토큰 인증 성공 : ${JSON.stringify(res.response)}`);
            } else {
                alert(`토큰 인증 에러 : ${res.msg}`);
            }
        })
        .catch((err) => {
            console.error(new Error("목록 받아오는 중 에러 발생"));
        });
}