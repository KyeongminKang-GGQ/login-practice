"use strict";

const listButton = document.querySelector("#list"),
  refreshButton = document.querySelector("#refresh");

listButton.addEventListener("click", getUserList);
refreshButton.addEventListener("click", refresh);

function refresh() {
  const id = localStorage.getItem("id");
  const refreshToken = localStorage.getItem("refreshToken");
  console.log(`id: `, id);
  console.log(`refreshToken: `, refreshToken);

  const req = {
    id: id,
    refreshToken: refreshToken,
  };

  fetch("/auth/v1/refresh-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        alert(`토큰 갱신 성공`);
        console.log(`/auth/v1/refresh-token success ${JSON.stringify(res)}`);
        localStorage.setItem("id", res.id);
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        localStorage.setItem("oauth_accessToken", res.oauth_accessToken);
        localStorage.setItem("oauth_refreshToken", res.oauth_refreshToken);
      } else {
        alert(`토큰 갱신 에러 : ${res.msg}`);
      }
    })
    .catch((err) => {
      console.error(new Error("목록 받아오는 중 에러 발생"));
    });
}

function getUserList() {
  const id = localStorage.getItem("id");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  console.log(`id: `, id);
  console.log(`accessToken: `, accessToken);
  console.log(`refreshToken: `, refreshToken);

  fetch("/users/v1/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        alert(`토큰 인증 성공`);
        const response = res.response;
        for (let i in response) {
          let tr = document.createElement("tr");
          let value = response[i];
          let keys = Object.getOwnPropertyNames(value);

          for (let j = 0; j < keys.length; j++) {
            let td = document.createElement("td");
            td.innerHTML = value[keys[j]] || "NULL";
            tr.appendChild(td);
          }
          document.querySelector("tbody").appendChild(tr);
        }
      } else {
        alert(`토큰 인증 에러 : ${res.msg}`);
        localStorage.removeItem("id");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        location.href = "/login";
      }
    })
    .catch((err) => {
      console.error(new Error("목록 받아오는 중 에러 발생"));
    });
}
