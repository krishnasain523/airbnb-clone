const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
const flash = require("connect-flash");
app.set("view engine", "ejs");
const Path = require("path");
app.set("views", Path.join(__dirname, "views"));

app.use(session({ secret: "secretcode", resave: false, saveUninitialized: true }));
app.use(flash());
app.get("/", (req, res) => {
    res.send("session run");
})
app.use("/register", (req, res, next) => {
    let { name } = req.query;
    if (name === "krishna") {
        req.flash("err", "user not rgister");
    }
    else {
        req.flash("success", "user rgistered successfully");
    }

    next();
})
app.get("/register", (req, res) => {
    let { name } = req.query;
    req.session.name = name
    // res.send(req.session.name)
    console.log(req.session.name);
    res.redirect("/helo");
})
app.get("/helo", (req, res) => {
    res.locals.msg = req.flash("success");
    res.locals.err = req.flash("err");

    res.render("page.ejs", { name: req.session.name })
})

app.listen(port, () => {
    console.log(`the port is listning on port${port}`);
})
