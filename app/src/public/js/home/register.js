"use strict";

const email = document.querySelector("#email"),
  userName = document.querySelector("#name"),
  password = document.querySelector("#password"),
  confirmPassword = document.querySelector("#confirm-password"),
  signUpBtn = document.querySelector("button");

signUpBtn.addEventListener("click", register);

function register() {
  if (!email.value) return alert("아이디를 입력해주십시오.");

  if (password.value != confirmPassword.value)
    return alert("비밀번호가 일치하지 않습니다");

  if (!password.value) return alert("비밀번호를 입력해주십시오.");

  if (!userName.value) return alert("이름을 입력해주십시오.");

  const req = {
    email: email.value,
    name: userName.value,
    password: password.value,
  };

  fetch("auth/v1/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        console.log(`auth/v1/register success`);
        location.href = "/login";
      } else {
        console.log(`auth/v1/register fail`);
        alert(res.msg);
      }
    })
    .catch((err) => {
      console.error(new Error("회원가입 중 에러 발생"));
    });
}
