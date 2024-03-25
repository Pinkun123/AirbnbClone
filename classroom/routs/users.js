const express=require("express");
const router=express.Router();


// index route
router.get("/users",(req,res)=>{
    res.send("this is index route");
})

//show route
router.get("/users/:id",(req,res)=>{
    res.send("this is show route");
})

//post route
router.post("/users",(req,res)=>{
    res.send("post for users");
})

//delete route
router.delete("/users/:id",(req,res)=>{
    res.send("this is delete route");
})

module.exports=router