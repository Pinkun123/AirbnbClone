const Listing=require("../models/listing.js");

// index route
module.exports.index=(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

// newlisting
module.exports.newListing=async(req,res)=>{
    res.render("listings/new.ejs");
};

// showlisting
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner");
    // if(!listing){
    //   req.flash("erorr","This Listing is not exist!");
    //   res.redirect("/listings");
    // }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

//createlisting
// module.exports.createListing=async(req,res)=>{
//     let result=listingSchema.validate(req.body);
//     // console.log(result);
//     if(result.error){
//       throw new ExpressErorr(404,result.error);
//     }
//   const newListing= new Listing(req.body.listing);
//   newListing.owner=req.user._id;
//   await newListing.save();
//   req.flash("success","new Listing created!");
//   res.redirect("/listings");
// }

//editlisting
module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
    // res.redirect("/listings");
};

//updateListing
module.exports.updateListing=async(req,res)=>{
    if(!req.body.listing){
      throw new ExpressErorr(404,"Send Valid Data For Listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," Listing is updated!");
    res.redirect(`/listings/${id}`);
}

//destroye listing
module.exports.destroyeListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is deleted!");
    res.redirect("/listings");
};