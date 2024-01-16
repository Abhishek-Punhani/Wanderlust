const Listing=require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../ExpressError.js");
module.exports.index=async(req,res)=>{
    const alllistings=await  Listing.find();
      res.render("listings/index.ejs",{alllistings});
  }
  module.exports.renderNewForm=(req,res)=>{ 
    res.render("listings/new.ejs");
 }
 module.exports.show=async(req,res)=>{
    
    let {id}=req.params;
    const list = await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
  
    
    res.render("listings/show.ejs",{list});
    }
module.exports.renderEditForm=async(req,res,next)=>{
   
    let {id}=req.params;
    const editlist = await Listing.findById(id);
    if(!editlist){
        req.flash("err","Listing Not Found!!");
        res.redirect("/listing");
    }
    let originalImageUrl=editlist.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
res.render("listings/edit.ejs",{editlist,originalImageUrl});
}
module.exports.new=async(req,res)=>{
 
    const  newList = req.body.listings;
    
    const url =req.file.path;
    const filename=req.file.filename;
    newList.image={
        filename :filename,
        url : url
    }
    
    let result=listingSchema.validate(newList);
    
    if(result.error){
   
        throw new ExpressError(400,result.error);

    }
    newList.owner=res.locals.CurrUser;
    const newlistings= new Listing(newList);

    await newlistings.save();
    req.flash("suc","New listing created successfully!");
    res.redirect("/listings");
    }

    module.exports.update=async (req,res,next)=>{
      
        const {id} =req.params;
        const edt=req.body.listings;
        let editlist=await Listing.findByIdAndUpdate(id,{...req.body.listings});
       
       if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        editlist.image={
            filename :filename,
            url : url
        }
    }
        let result=listingSchema.validate(edt);
       
    if(result.error){
        throw new ExpressError(400,result.error);
    }
       await editlist.save();
        req.flash("suc","Listing updated successfully!");
        res.redirect("/listings");


    }
    module.exports.delete=async (req,res,next)=>{
  
        let {id}=req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("sucdel","Listing deleted successfully!");
        res.redirect("/listings");
        }