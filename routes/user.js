const express =require("express");
const router=express.Router();
const passport=require("passport");
const flash=require("connect-flash");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");
function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=> next(err));
        };
    }
  
router.route("/signup")
.get(asyncWrap(userController.renderSignupForm))
.post(asyncWrap(userController.signup));


router.route("/login")
.get(asyncWrap(userController.renderLoginForm))
.post(saveRedirectUrl,passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}),asyncWrap(userController.login));

router.get("/logout",(userController.logout))
module.exports=router;