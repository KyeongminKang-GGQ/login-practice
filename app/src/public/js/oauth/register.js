"use strict";

const userName = document.querySelector("#name"),
  signUpBtn = document.querySelector("button");

signUpBtn.addEventListener("click", register);

const url = new URL(window.location.href);

console.log("======register======");

const id = localStorage.getItem("id");
const imageUrl = localStorage.getItem("profile_image");
const provider = localStorage.getItem("provider");
const accessToken = localStorage.getItem("oauth_accessToken");
const refreshToken = localStorage.getItem("oauth_refreshToken");

var image = new Image();
image.src = imageUrl;

const newDIV = document.createElement("div");
newDIV.innerHTML = `ID : ${id}<p>OAuth Provider: ${provider}<p>OAuth AccessToken: ${accessToken}<p>OAuth RefreshToken: ${refreshToken}<p> Profile Image: <p>`;
document.getElementById("container").appendChild(newDIV);
document.getElementById("container").appendChild(image);

function register() {
  if (!userName.value) return alert("이름을 입력해주십시오.");

  const req = {
    id: id,
    provider: provider,
    name: userName.value,
  };

  fetch(`${url.origin}/auth/v1/oauth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        console.log(`auth/v1/oauth/register success ${JSON.stringify(res)}`);
        localStorage.setItem("id", res.id);
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        location.href = "/main";
      } else {
        console.log(`auth/v1/oauth/register fail`, res);
        alert(res.msg);
      }
    })
    .catch((err) => {
      console.error(new Error("OAuth 회원가입 중 에러 발생"));
    });
}
