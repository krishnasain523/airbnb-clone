const { number } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review");
const listingschema= new Schema(
    {
        title:{
            type:String,
            require:true
        },
        description:String,
        image: {
            filename: { type: String },
            url: { type: String }
          },
        price:Number,
        location:String,
        country:String,
        reviews:[{type:Schema.Types.ObjectId,ref:"review"
        }],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    }
);

listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    {
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const listing= mongoose.model("listing" , listingschema);
module.exports=listing;