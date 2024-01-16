const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const path=require("path");
module.exports.newReview=async(req,res)=>{
  
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.reviews);
    newReview.author=req.user._id;
    listing.review.push(newReview);
    newReview.save();
    listing.save();
    
    req.flash("suc","Review added successfully!");
    res.redirect(`/listings/${req.params.id}`);
}
module.exports.destroyReview=async(req,res)=>{
      
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull :{review:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    
req.flash("sucdel","Review deleted successfully!");
    res.redirect(`/listings/${id}`)
    }