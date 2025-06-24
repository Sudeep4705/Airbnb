const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {isloggedIn,saveredirectUrl} =require("../middleware.js")
const controllerUsers =require("../controllers/users.js")

// signup form // signup post
router.route("/signup")
.get(controllerUsers.signupform)
.post(wrapAsync (controllerUsers.signup));

// login form // login db
router.route("/login")
.get(controllerUsers.loginform)
.post(saveredirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),controllerUsers.login)

// logout
router.get("/logout",isloggedIn,controllerUsers.logout)
module.exports = router