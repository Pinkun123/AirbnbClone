const express=require("express");
const app=express();
const users=require("./routs/users.js");
const posts=require("./routs/posts.js");
const session = require("express-session");
const flash = require("connect-flash");
const path=require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

const sessionOption={
    secret:"mycode",
    resave:false,
    saveUninitialized:true,
}

// app.use(cookieParser("code"));
app.use(session(sessionOption));
app.use("/", users);
app.use("/",posts);
app.use(flash());

app.get("/register",(req,res)=>{
    let{name="Anymous"}=req.query;
    req.flash("succes","register successfull");
    req.session.name=name;
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    res.render("../views/page.ejs",{name:req.session.name,msg:req.flash("succes")});
})

// app.get("/test",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// })

// //cookies route
// app.get("/setCokies",(req,res)=>{
//     res.cookie("gautam","namste");
// })
// app.get("/getCokies",(req,res)=>{
//     console.log(req.cookies);
//     res.send("got the cookies");
// })

// //signed cookies
// app.get("/signedcookies",(req,res)=>{
//     res.cookie("namste","India",{signed:true});
//     res.send("cookie send");
// })

// //root route
// app.get("/",(req,res)=>{
//     res.send("this is root route");
// })
app.listen(3000,()=>{
    console.log("port is ready to listion 3000")
})