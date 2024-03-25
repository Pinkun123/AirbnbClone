const { string } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
      type:String,
      required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://www.istockphoto.com/photo/potil-island-indonesia-gm481242721-36752164",
        set: (v)=>
           v===""?"https://www.istockphoto.com/photo/potil-island-indonesia-gm481242721-36752164":v,
    },
    // image:{
    //   url:String,
    //   filename:String
    // },
    price:Number,
    location:String,
    country:String,

    reviews:[{
       type:Schema.Types.ObjectId,
       ref:"Review",
    }],

    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;
