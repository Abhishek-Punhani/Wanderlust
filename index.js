if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}
const express= require("express");
const app=express();
const path=require("path");
const Listing=require("./models/listing.js");
const ejsMate=require('ejs-mate');
const mongoose = require('mongoose');
const ExpressError=require("./ExpressError.js");
const bodyParser=require('body-parser');
const listingsRoute=require("./routes/listing.js");
const reviewsRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js")
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const methodOverride = require('method-override');
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const User=require("./models/user.js");
const dbUrl=process.env.ATLAS_LINK;
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json());
app.set("view engine","ejs");

app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));


app.engine('ejs', ejsMate);

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=> next(err));
        };
    }


const store=MongoStore.create({
mongoUrl:dbUrl,
crypto:{
    secret:process.env.SECRET,
},
touchAfter:24*3600
})    
const sessionObject={
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 1000*7*24*60*60,
        maxAge:1000*7*24*60*60,
        httpOnly:true
    },
    store
}
app.use(session(sessionObject));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
async function main(){
    await mongoose.connect(dbUrl);
}
main().then((res)=>{
    console.log("Connection successfull");
})
app.use((req,res,next)=>{
    res.locals.suc=req.flash("suc");
    res.locals.sucdel=req.flash("sucdel");
    res.locals.err=req.flash("err");
    res.locals.CurrUser=req.user;
    next();
 }) 

 app.get("/home",asyncWrap(async(req,res)=>{
    const alllistings=await  Listing.find();
      res.render("listings/index.ejs",{alllistings});
  }));



  app.use("/listings" ,listingsRoute);
  app.use("/listings/:id/reviews" ,reviewsRoute);
  app.use("/",userRoute);
     

app.all("*",(req,res,next)=>{
 next(new ExpressError(404,"Page Not Found!"));
})
app.use((err,req,res,next)=>{
let {status=501,message="some error occured"}= err;
res.render("listings/error.ejs",{message})
} );
app.listen(8080,()=>{
    console.log("listening at port 8080");
});