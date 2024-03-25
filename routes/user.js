const express=require("express");
const router=express.Router();
const User=require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { route } = require("./listings.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js")

//signup
router.get("/signup",userController.rendersignupFrom);


router.post("/signup",wrapAsync(userController.signup))

//login
router.get("/login",saveredirectUrl,userController.renderLoginFrom);

router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login)

//logout
router.get("/logout",userController.logout);

module.exports=router; 