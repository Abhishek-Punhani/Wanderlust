const express =require("express");
const router=express.Router();
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=> next(err));
        };
    }



    
router.route("/")
.get(asyncWrap(listingController.index))
.post(isLoggedIn,upload.single("url"),asyncWrap(listingController.new));

router.get("/new",isLoggedIn,asyncWrap(listingController.renderNewForm));

router.route("/:id")
.get(asyncWrap(listingController.show))
.patch(isOwner,isLoggedIn,upload.single("url"),asyncWrap(listingController.update))
.delete(isOwner,isLoggedIn,asyncWrap(listingController.delete));


router.get("/:id/edit",isLoggedIn,asyncWrap(listingController.renderEditForm));

module.exports=router;
