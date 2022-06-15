"use strict";

const User = require(`../../models/User`);
const UserStorage = require(`../../models/UserStorage`);
const jwt = require("jsonwebtoken");

const output = {
    home: (req, res) => {
        // res.send("here is root");
        res.render("home/index");
    },
    login: (req, res) => {
        res.render("home/login");
    },
    register: (req, res) => {
        res.render("home/register");
    },
    main: (req, res) => {
        res.render("main/main");
    }
}

const process = {
    login: async (req, res) => {
        const user = new User(req.body);

        const response = await user.login();

        return res.json(response);
    },
    register: async (req, res) => {
        const user = new User(req.body);

        const response = await user.register();

        return res.json(response);
    },
    kakaoLogin: async (req, res) => {
        const query = req.query;

        console.log(`query: ${JSON.stringify(query)}`);

        if (!Object.prototype.hasOwnProperty.call(query, "code")) {
            return res.status(400).send("invalid_code");
        }

        const authorizationCode = query.code;
        console.log(`authorizationCode: ${authorizationCode}`);

        // Access Token 요청
    },
    userList: async (req, res) => {
        let token = '';
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            token = req.query.token;
        } else {
            token = null;
        }

        console.log('requested accessToken: ', token);

        const response = await UserStorage.getUsers(token);
        return res.json(response);
    }
}

module.exports = {
    output,
    process
};