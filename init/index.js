const mongoose=require("mongoose");
const listing= require("../models/listning.js");
const initData=require("./data.js");
main().then(res=> console.log("connected sucessful")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

}
const initdb= async ()=>
{
     await listing.deleteMany({});
     let indata=initData.data.map((obj)=>({...obj , owner: "67ab6b037110d26f71faa715"}))
  await  listing.insertMany(indata);
    console.log("database intailized");
}
initdb();