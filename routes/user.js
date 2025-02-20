const express = require("express");
const router = express.Router();
const expresserr = require("../utils/expresserr");
const wrapasync = require("../utils/wrapasync");
const User = require("../models/user");
const passport = require("passport");
const { saveoriginalurl } = require("../middleware");
const usercantroller = require("../controller/user")

router.route("/signup")
.get( usercantroller.signupform)
.post( wrapasync(usercantroller.signupuser))

router.route("/login")
.get( usercantroller.loginform)
.post( saveoriginalurl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), usercantroller.loginuser)

router.get("/logout", usercantroller.logoutuser);


module.exports = router;
