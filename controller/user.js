const User = require("../models/user");
module.exports.signupform=async(req,res)=>{
    res.render("signup.ejs")
}
module.exports.signupuser=async(req,res)=>{
  try{
    let {username,email,password}=req.body;
    const newuser= new User({email,username});
   let registerusr=await User.register(newuser,password);
    console.log(registerusr);
    req.login(registerusr,(err)=>{
      if(err)
      {
        return next();
      }
      req.flash("key","welcome to wonderlust")
      res.redirect(`/listings`);
    }) 
  }
  catch(err)
  {
    req.flash("err",err.message);
    res.redirect("/signup");
  }
}
module.exports.loginform=(req,res)=>{
  res.render("login.ejs")
}
module.exports.loginuser=async(req,res)=>{
    req.flash("key","welcome to wonderlust");
    let redirecturl=res.locals.Redirecturl || "listings";
    res.redirect(redirecturl);
    }

    module.exports.logoutuser=(req,res)=>{
        req.logOut((err)=>{
          if(err)
          {
            return next(err);
          }
          req.flash("key","you successfully logout")
          res.redirect("/listings");
        })
      }