"use strict";

const home = (req, res) => {
    // res.send("here is root");
    res.render("home/index");
};

const login = (req, res) => {
    res.render("home/login");
};

module.exports = {
    home: home, 
    login: login
};