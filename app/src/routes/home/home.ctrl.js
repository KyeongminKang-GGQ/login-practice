"use strict";

// For test
const users = {
    id: ["test1", "test2", "test3"],
    password: ["123", "1234", "12345"],
}

const output = {
    home: (req, res) => {
        // res.send("here is root");
        res.render("home/index");
    },
    login: (req, res) => {
        res.render("home/login");
    }
}

const process = {
    login: (req, res) => {
        console.log(req.body);

        const id = req.body.id,
        password = req.body.password;

        if (users.id.includes(id)) {
            const idx = users.id.indexOf(id);
            if (users.password[idx] === password) {
                return res.json({
                    success: true,
                });
            }
        }

        return res.json({
            success: false,
            msg: "Fail to login",
        })
    }
}

module.exports = {
    output,
    process
};