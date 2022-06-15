"use strict";

const userName = document.querySelector("#name"),
    signUpBtn = document.querySelector("button");

signUpBtn.addEventListener("click", register);

console.log("======register======");

const url = new URL(window.location.href);
const urlParams = url.searchParams;
const id = urlParams.get('id');

console.log(id);
console.log(urlParams.get('img'));

var image = new Image();
image.src = urlParams.get('img');
document.getElementById('container').appendChild(image);

function register() {
    if (!userName.value) return alert("이름을 입력해주십시오.")

    const req = {
        name: userName.value
    };

    fetch("auth/v1/oauth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                console.log(`auth/v1/oauth/register success`);
                location.href = "/main";
            } else {
                console.log(`auth/v1/oauth/register fail`);
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error(new Error("OAuth 회원가입 중 에러 발생"));
        });
}