"use strict";

const id = document.querySelector("#id"),
    userName = document.querySelector("#name"),
    password = document.querySelector("#password"),
    confirmPassword = document.querySelector("#confirm-password"),
    signUpBtn = document.querySelector("button");

signUpBtn.addEventListener("click", signUp);

function signUp() {
    if (!id.value) return alert("아이디를 입력해주십시오.")

    if (password.value != confirmPassword.value) 
        return alert("비밀번호가 일치하지 않습니다");

    const req = {
        id: id.value,
        name: userName.value,
        password: password.value,
    };

    fetch("auth/v1/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            location.href = "/login";
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error(new Error("회원가입 중 에러 발생"));
    });
}