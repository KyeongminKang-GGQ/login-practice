"use strict";

const email = document.querySelector("#email"),
  password = document.querySelector("#password"),
  loginBtn = document.querySelector("button");

loginBtn.addEventListener("click", login);

function login() {
  const req = {
    email: email.value,
    password: password.value,
  };

  fetch("auth/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        console.log(`auth/v1/login success ${JSON.stringify(res)}`);
        localStorage.setItem("id", res.id);
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        localStorage.removeItem("oauth_accessToken");
        localStorage.removeItem("oauth_refreshToken");
        location.href = "/main";
      } else {
        console.log(`auth/v1/login fail`, res);
        alert(res.msg);
      }
    })
    .catch((err) => {
      console.error(new Error("로그인 중 에러 발생"));
    });
}
