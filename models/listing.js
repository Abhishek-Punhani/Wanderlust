const mongoose = require('mongoose');
const Schema =mongoose.Schema;
const Review=require("./review.js");
const listingSchema=new Schema({
   
    title :{
        type : String,
        required :true
    },
    description :{
        type : String,
        required :true
    },
    image :{
       filename:{
       type:String,
       default:"listingimage"
       },url:String,_id:false},
      
    
    country :{
        type : String,
        required :true
    },
    price : {
        type :Number,
        min:0
        
    },
    location :{
        type : String,
        required :true
    },
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default: mongoose.Types.ObjectId
    //   },

    review:[{
        type:Schema.Types.ObjectId,
        ref:"Review"}],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
listingSchema.post("findOneAndDelete", async(listing)=>{
if(listing){
    await Review.deleteMany({_id:{$in : listing.review}});
}});
const listing= new mongoose.model("Listing",listingSchema);
module.exports=listing;