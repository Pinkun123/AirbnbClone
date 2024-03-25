if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}

// console.log(process.env.SECRET)

const atlasUrl=process.env.ATLAS_URL;
const express=require("express");
const app=express();
const mongoose = require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErorr=require("./utils/expressErorr.js");
const Review=require("./models/reviews.js");
const reviews = require("./models/reviews.js");
// const {reviewSchema}=require("./schema.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const { error } = require("console");
const session = require("express-session");
const flash = require('connect-flash');
const listingsRouter=require("./routes/listings.js");
const reviewRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/users.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded( {extended :true}));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"public")));

//create sesssion object
const sessionOption={
  secret: process.env.SECREET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
  }
}

main().then((res)=>{
  console.log("conncet db");
})
.catch((err)=>{
  console.log(err);
})

async function main() {
  // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  await mongoose.connect(atlasUrl);
}

// Validatereview

// const Validatereview=(req,res,next)=>{
//   let{err}=reviewSchema.validate(req.body);
//   if(error){
//     let errMsg=error.details.map((el)=>el.meesage).join(",");
//     throw new ExpressErorr(404,errMsg);
//   }else{
//     next();
//   }
// }


// // index route
// app.get("/listings",wrapAsync(async(req,res)=>{
//   const allListings=await Listing.find({});
//   res.render("listings/index.ejs",{allListings});
// }))
// //new route
// app.get("/listings/new",wrapAsync(async(req,res)=>{
//    res.render("listings/new.ejs");
// }))
// //show route
// app.get("/listings/:id",wrapAsync(async (req,res)=>{
//   let {id}=req.params;
//   const listing=await Listing.findById(id).populate("reviews");
//   res.render("listings/show.ejs",{listing});
// }))

// //create route

// app.post("/listings",wrapAsync(async(req,res)=>{
//   let result=listingSchema.validate(req.body);
//   console.log(result);
//   if(result.error){
//     throw new ExpressErorr(404,result.error);
//   }
// const newListing= new Listing(req.body.listing);
// await newListing.save();
// // req.flash("success","new Listing created");
// res.redirect("/listings");
// }));

// // edit route
// app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
//   let {id}=req.params;
//   const listing=await Listing.findById(id);
//   res.render("listings/edit.ejs",{listing});
//   // res.redirect("/listings");
// }))

// // update route
// app.put("/listings/:id",wrapAsync(async(req,res)=>{
//   if(!req.body.listing){
//     throw new ExpressErorr(404,"Send Valid Data For Listing");
//   }
//   let {id}=req.params;
//   await Listing.findByIdAndUpdate(id,{...req.body.listing});
//   res.redirect(`/listings/${id}`);
// }))

// //delete route
// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//   let {id}=req.params;
//   await Listing.findByIdAndDelete(id);
//   res.redirect("/listings");
// }))

//use flash
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//success ans error
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.erorr=req.flash("erorr");
  res.locals.userLogin=req.user;
  next();
})

//register user
app.get("/register",async(req,res)=>{
  let newUser=new User({
    email:"rahul123@gmail.com",
    username:"rahul123"
  })
  let registerUser=await User.register(newUser,"helloworld");
  res.send(registerUser);
})

app.use("/listings",listingsRouter);
// app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter)

// Review route
app.post("/listings/:id/reviews",wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","new review created");
    res.redirect(`/listings/${listing._id}`);
}))

//delete review route

app.delete("/listings/:id/reviews/reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params;
 await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`listings/${id}`);
}))

app.get("/testlisting",async(req,res)=>{
  let samplelisting=new  Listing({
    title:"My new villa",
    description:"by the beach",
    price:1200,
    location:"Odisha,Puri",
    country:"India"
  })
  await samplelisting.save();
  res.send("fine!");
})

// throw Erorr
app.all("*",(req,res,next)=>{
  next(new ExpressErorr(404,"Page not found"));
})
app.use((err,req,res,next)=>{
    let{statusCode=500,meesage="something went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{meesage})
    // res.status(statusCode).send(meesage);
    next();
})

app.get("/",(req,res)=>{
    res.send("Hi, worikng now");
})
app.listen("8080",()=>{
    console.log("app is ready to listion:8080");
})