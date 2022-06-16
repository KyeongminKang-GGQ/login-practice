"use strict";

console.log("======kakao======");

const url = new URL(window.location.href);
const urlParams = url.searchParams;
const authorizationCode = urlParams.get('code');

console.log(url);
console.log("authorizationCode : ", authorizationCode);

const req = {
    authorizationCode: authorizationCode
}

fetch(`${url.origin}/auth/v1/oauth/login`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(req)
})
    .then((res) => res.json())
    .then((res) => {
        console.log(res);
        if (res.success) {
            console.log(`auth/v1/oauth/login success`);
            
        } else {
            console.log(`auth/v1/oauth/login fail ${res.returnCode}`);
            console.log(res.info);
            alert(res.returnMessage);
            if (res.returnCode === 'AUTH0000') {
                localStorage.setItem("provider", res.info.provider);
                localStorage.setItem("id", res.info.id);
                localStorage.setItem("profile_image", res.info.profile_image);
                location.href = "/oauth/register";
            } 
        }
    })
    .catch((err) => {
        console.error(new Error("OAuth 회원가입 중 에러 발생"));
    });