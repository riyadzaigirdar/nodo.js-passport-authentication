require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const flash = require("connect-flash")
const session = require("express-session")

const app = express();

// mongoose
const db = require("./config/keys");

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongo db connected"))
  .catch((err) => console.log(err));

// Body parser Middleware
app.use(bodyparser.urlencoded({ extended: false }));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}))
// flash
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  next()
})



// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
