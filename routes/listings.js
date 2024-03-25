const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const ExpressErorr=require("../utils/expressErorr.js");
const {listingSchema}=require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {islogedIn, isOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const{storage}=require("../cloudConfig.js")
const upload = multer({ storage });

// Validatereview

const validateListing=(req,res,next)=>{
  let{err}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.meesage).join(",");
    throw new ExpressErorr(404,errMsg);
  }else{
    next();
  }
}
// index route
router.get("/",wrapAsync(listingController.index));
  //new route
  router.get("/new",islogedIn,wrapAsync(listingController.newListing));
  //show route
  router.get("/:id",wrapAsync(listingController.showListing));

// //create route
router.post("/",islogedIn,upload.single("listing[image]"),wrapAsync(async(req,res)=>{
  let result=listingSchema.validate(req.body);
  // console.log(result);
  if(result.error){
    throw new ExpressErorr(404,result.error);
  }
  // let url=req.file.path;
  // let filename=req.file.filename;
  // console.log(url ,"..",filename);
const newListing= new Listing(req.body.listing);
newListing.owner=req.user._id;
await newListing.save();
req.flash("success","new Listing created!");
res.redirect("/listings");
}));

// //create route
// router.post("/",islogedIn,validateListing,wrapAsync(listingController.createListing));
  
  // edit route
  router.get("/:id/edit",islogedIn,isOwner,wrapAsync(listingController.editListing));
  
  // update route
  router.put("/:id",islogedIn,isOwner,wrapAsync(listingController.updateListing));
  
  //delete route
  router.delete("/:id",islogedIn,isOwner,wrapAsync(listingController.destroyeListing));

  module.exports=router;