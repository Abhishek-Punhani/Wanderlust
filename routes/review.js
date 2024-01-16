const express =require("express");
const router=express.Router({mergeParams:true});
const {listingSchema,reviewSchema}=require("../schema.js");
const path=require("path");
const flash=require("connect-flash");
const ExpressError=require("../ExpressError.js");
const User=require("../models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const {isLoggedIn,isAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js")

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=> next(err));
        };
    }
    const validateReview=(req,res,next)=>{
   
        let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
    }
    router.use(passport.initialize());
    router.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    router.post("/",isLoggedIn,validateReview,asyncWrap(reviewController.newReview ));
    router.delete("/:reviewid",isAuthor,isLoggedIn,asyncWrap(reviewController.destroyReview));
    module.exports=router;