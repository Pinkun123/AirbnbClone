const express=require("express");
const router=express.Router();

//Posts
// index route
router.get("/posts",(req,res)=>{
    res.send("Get for posts");
})

//show route
router.get("/posts/:id",(req,res)=>{
    res.send("this is posts route");
})

//post route
router.post("/posts",(req,res)=>{
    res.send("post for posts");
})

//delete route
router.delete("/posts/:id",(req,res)=>{
    res.send("Delete for posts id");
})

module.exports=router;