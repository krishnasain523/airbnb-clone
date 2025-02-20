require('dotenv').config()
console.log(process) 
const express = require("express");
const app = express();
const port = 8080;
const Path = require("path");
const mongoose = require('mongoose');
const methodoverride = require("method-override");
const Listing = require("./models/listning");


const ejsmate = require("ejs-mate");
const path = require("path");
const expresserr = require("./utils/expresserr");
const { listingschema,reviewschema } = require("./schema");
const listingrouter=require("./routes/listings");
const reviewrouter=require("./routes/review");
const userrouter=require("./routes/user.js");
app.engine('ejs', ejsmate);
app.set("view engine", "ejs");
app.set("views", Path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
const cookieparser=require("cookie-parser");
app.use(cookieparser("secretcode"))//for singed cookie
const wrapasync = require("./utils/wrapasync");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport=require("passport")
const Localstrategy=require("passport-local");
const User = require("./models/user.js");
const atlasurl=process.env.Atlas_url;
main().then(res => console.log("connected sucessful")).catch(err => console.log(err));

async function main() {
   mongoose.connect(atlasurl);
}

const store=MongoStore.create({
  mongoUrl:atlasurl,
  secret:process.env.Secret,
  touchAfter:24*3600,
})
const sessionoption={
   store,
  secret:process.env.Secret, resave: false, saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}
app.use(session(sessionoption));
app.use(flash());
//for implementing passpot local strategy
app.use(passport.initialize());
app.use(passport.session())
passport.use(new Localstrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());



app.get("/demouser",async(req,res)=>{
  const newuser=new User({
    email:"sainkrishna@gmail.com",
    username:"krishna sain"
  })
let registerusr=await User.register(newuser,"krish@123");
res.send(registerusr);

})

app.use((req,res,next)=>{
  res.locals.success=req.flash("key");
  res.locals.errmsg=req.flash("err");
  res.locals.curuser=req.user;
  next();
})


app.listen(port, () => {
  console.log(`the port is listning on port${port}`);
})


app.use("/listings",listingrouter);
app.use("/listings/:id/reviews",reviewrouter)
app.use("/",userrouter);



app.get("/setcookie",(req,res)=>{
  res.cookie("greet" ,"helo")
  res.cookie("country" ,"india");
  res.send("we send cookie");
})
app.get("/getcookie",(req,res)=>{
  let{greet="nameste"}=req.cookies
 console.log(greet);
})
//singed cookie
app.get("/getsingedcookies",(req,res)=>{
  res.cookie("name" ,"badmosh",{signed:true})
  res.cookie("country" ,"india");
  res.send("we send singedcookie");
})
app.get("/verify",(req,res)=>{
  res.send(req.signedCookies);
})

// const get=async()=>{
//   let listing= await Listing.findById('677ec5afe600e6bc53a6a99d').populate("reviews");
//   console.log(listing); 
// }
// // get();
//err handling middleware


app.all("*", wrapasync(async(err, req, res, next) => {
  throw new expresserr(404, "page not found");
}));

app.use((err, req, res, next) => {
  //  res.send(err);
  let { statuscode = 404, message } = err;
  //  res.status(statuscode).send(message);
  res.render("err.ejs", { message });
});
