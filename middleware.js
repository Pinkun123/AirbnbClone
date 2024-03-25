const Listing=require("./models/listing.js");
module.exports.islogedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("erorr","u must be login!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
      res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.userLogin._id)){
      req.flash("erorr","You are not owner of this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
}