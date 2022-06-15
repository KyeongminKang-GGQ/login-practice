"use strict";

const email = document.querySelector("#email"),
    password = document.querySelector("#password"),
    loginBtn = document.querySelector("button");

loginBtn.addEventListener("click", login);

function login() {
    const req = {
        email: email.value,
        password: password.value
    };

    fetch("auth/v1/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            console.log(`auth/v1/login success`);
            location.href = "/";
        } else {
            console.log(`auth/v1/login fail`);
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error(new Error("로그인 중 에러 발생"));
    });
}