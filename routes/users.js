const express = require("express");
const route = express.Router();
const bcrypt = require("bcryptjs")
const User = require("../models/users");
const passport = require("passport");



route.get("/login", (req, res) => res.render("login"));

route.get("/register", (req, res) => res.render("registration"));

// Handle Registration
route.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "all fields must be filled in" });
  }

  if (password !== password2) {
    errors.push({ msg: "password doesn't match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "password should be atleat 6 characters" });
  }

  if (errors.length > 0) {
    res.render("registration", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          errors.push({ msg: "email already taken" })
          res.render("registration", {
            errors,
            name,
            email,
            password,
            password2,
          })
        } else {
          const newUser = new User({
            name,
            email,
            password
          })
          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err
              newUser.password = hash
              newUser.save()
                .then((user) => {
                  req.flash("success_msg", "you are registered and can log in")
                  res.redirect("/users/login")
                })
                .catch(err => console.log(err))
            })
          })


        }
      })
  }
});

route.post("/login", (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

route.get("/logout", (req, res) => {
  req.logout()
  req.flash("success_msg", "You are now logged out")
  res.redirect("/users/login")
})

module.exports = route;

