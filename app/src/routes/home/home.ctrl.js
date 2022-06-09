"use strict";

const UserStorage = require("../../models/UserStorage");

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

        
        const users = UserStorage.getUsers("id", "password");

        const response = {};
        if (users.id.includes(id)) {
            const idx = users.id.indexOf(id);
            if (users.password[idx] === password) {
                response.success = true;
                return res.json(response);
            }
        }

        response.success = false;
        response.msg = "Fail to login";

        return res.json(response);
    }
}

module.exports = {
    output,
    process
};