const User=require("../models/user.js");
module.exports.renderSignupForm=async (req,res)=>{
    res.render("user/signup.ejs");
}
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,pass}=req.body;
    let newUser=new User({email,username});
    await User.register(newUser,pass);
    
    req.login(newUser, (err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    });
    }catch(e){
        req.flash("err",e.message);
        res.redirect("/signup");
    }}
module.exports.renderLoginForm=async (req,res)=>{
    res.render("user/login.ejs");
}
module.exports.login=async(req,res)=>{
   
    req.flash("suc","Welcome Back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
    
}
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("sucdel", "You are logged out!");
        res.redirect("/listings");
    });
  }  