"use strict";

const logoutButton = document.querySelector("#logout"),
    inputId = document.querySelector("#id"),
    deleteButton = document.querySelector("#delete");

const id = localStorage.getItem("id");
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

const newDIV = document.createElement("div");
newDIV.innerHTML = `id: ${id}, <p>accessToken : ${accessToken}<p>refreshToken: ${refreshToken}`;
document.getElementById("container").appendChild(newDIV);

logoutButton.addEventListener("click", logout);
deleteButton.addEventListener("click", deleteUsers);

function deleteUsers() {
    const req = {
        id: inputId.value,
    };

    fetch("auth/v1/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                alert(`회원 삭제 완료`);
            } else {
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error(new Error("회원 삭제 중 에러 발생"));
        });
}

function logout() {
    const req = {
        id: id,
        accessToken: accessToken,
    };

    fetch("auth/v1/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                console.log(`auth/v1/logout logout ${JSON.stringify(res)}`);
                alert(`로그아웃 완료`);
            } else {
                console.log(`auth/v1/logout fail`);
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error(new Error("로그인 중 에러 발생"));
        });
}
