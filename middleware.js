const Listing=require("./models/listing");
const Review=require("./models/review");
const { listingSchema } = require("./schema");
module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.redirectUrl = req.originalUrl;
		req.flash("error", "you must be logged in to create listings!");
		return res.redirect("/login");
	}
	return next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
	if(req.session.redirectUrl){
		res.locals.redirectUrl=req.session.redirectUrl;
	}
	return next();
}
module.exports.isOwner=async (req,res,next)=>{
	let {id}=req.params;
	let listing=await Listing.findById(id);
	if(!listing.owner.equals(res.locals.CurrUser._id)){
		req.flash("err","You are owner of this listing!");
		return res.redirect(`/listings/${id}`);
	}
	return next();
}
module.exports.isAuthor=async (req,res,next)=>{
	let {reviewid,id}=req.params;
	let review=await Review.findById(reviewid);
	if(!review.author.equals(res.locals.CurrUser._id)){
		req.flash("err","You are not author of this review!");
		return res.redirect(`/listings/${id}`);
	}
	return next();
}
module.exports.validateListing=(req,res,next)=>{
   
	let {error}=listingSchema.validate(req.body);
if(error){
	let errMsg=error.details.map((el)=>el.message).join(",");
	throw new ExpressError(400,errMsg);
}
else{
	next();
}
}