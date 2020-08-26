const express = require("express");
const route = express.Router();

route.get("/", (req, res) => res.render("welcome"));
route.get("/dashboard", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("dashboard", { name: req.user.name })
    } else {
        req.flash("error_msg", "authenticate first to see the dash board")
        res.redirect("/users/login")
    }

});


module.exports = route;
