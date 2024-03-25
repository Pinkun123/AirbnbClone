const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


main().then((res)=>{
    console.log("conncet db");
  })
  .catch((err)=>{
    console.log(err);
  })
  
  async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDb= async()=>{
   await Listing.deleteMany();
   initData.data= initData.data.map((obj)=>({...obj,owner:"65e83a5e622ab4f983b641a6"}))
   await Listing.insertMany(initData.data);

   console.log("datat is save");
}

initDb();