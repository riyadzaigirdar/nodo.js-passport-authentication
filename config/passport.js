const bcrypt = require("bcryptjs")
const User = require("../models/users")
const LocalStragety = require("passport-local").Strategy

module.exports = function (passport) {
    passport.use(new LocalStragety({
        usernameField: "email"
    }, (email, password, done) => {
        User.findOne({ email: email }, (err, user) => {
            if (err) throw err
            if (!user) {
                return done(null, false, { message: "Email is incorrect" })
            }
            bcrypt.compare(password, user.password, (err, isMatched) => {
                if (err) throw err
                if (!isMatched) {
                    return done(null, false, { message: "password is incorrect" })
                }

                return done(null, user)
            })
        })

    }))
    passport.serializeUser((user, done) => {

        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {

            done(err, user);
        });
    });

}