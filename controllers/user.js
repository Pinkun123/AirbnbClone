const User=require("../models/users.js");

//signup form
module.exports.rendersignupFrom=(req,res)=>{
    res.render("users/signup.ejs");
};
//signup
module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({username,email});
        let registerUser=await User.register(newUser,password);
        // console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Wellcome to wanderlaust");
            res.redirect("/listings");
        });
    }
    catch(err){
         req.flash("erorr",err.message);
         res.redirect("/signup");
    }
}

//login Form
module.exports.renderLoginFrom=(req,res)=>{
    res.render("users/login.ejs")
};

//login
module.exports.login=async(req,res)=>{
    req.flash("success","wellcome to wanderlaust! You are login");
    let val=res.locals.redirectUrl;
    let redirectUrl=  val || "/listings";
    res.redirect(redirectUrl);
};

//logout
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are now logout");
        res.redirect("/listings");
    })
}