"use strict";

const button = document.querySelector("button");

const id = localStorage.getItem("id");
const accessToken = localStorage.getItem("accessToken");

const newDIV = document.createElement('div');
newDIV.innerHTML = `id: ${id}, <p>accessToken : ${accessToken}`;
document.getElementById('container').appendChild(newDIV);

button.addEventListener("click", logout);

function logout() {
    const req = {
        id: id, 
        accessToken: accessToken,
    };

    fetch("auth/v1/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                console.log(`auth/v1/logout logout ${JSON.stringify(res)}`);
                alert(`로그아웃 완료`);
                document.getElementById('container').removeChild(newDIV);
            } else {
                console.log(`auth/v1/logout fail`);
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error(new Error("로그인 중 에러 발생"));
        });
}