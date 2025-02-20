const Listing= require("./models/listning")
const Review= require("./models/review")
const expresserr = require("./utils/expresserr");
const { listingschema,reviewschema } = require("./schema");

module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated())
    {   req.session.redirecturl=req.originalUrl;
        req.flash("err","you must be logged in");
      return res.redirect("/login");
    }
    next();
}
module.exports.saveoriginalurl=(req,res,next)=>{
    
    if(req.session.redirecturl)
        {
            res.locals.Redirecturl=req.session.redirecturl

        } 
        next();
}

module.exports.isowner=async(req,res,next)=>{
    const { id } = req.params;
    const listing= await Listing.findById(id);
    if(!listing && listing.owner.equals(res.locals.curuser._id))
    { 
      req.flash("err","you have not permission to edit");
     return res.redirect(`/listings/${id}`);
      
    }
    next();
}
module.exports.isreviewauthor=async(req,res,next)=>{
    const {id, reviewid} = req.params;
    const review= await Review.findById(reviewid);
    console.log(review);
    console.log(res.locals.curuser);
    if(!review.author.equals(res.locals.curuser._id))
    { 
      req.flash("err","you have not permission to delete it");
     return res.redirect(`/listings/${id}`);
      
    }
    else
    {next();}
}
module.exports.validatelisting = (req, res, next) => {
    let {error} = listingschema.validate(req.body);
    if (error) { // { const errmsg= error.details.map((el)=>el.massage).join(",");
      errmsg=error.details.map((el)=>el.message).join(",")
      throw new expresserr(400, errmsg);
    }
    else {
      next();
    }
  }

module.exports.validatereview = (req, res, next) => {
    let {error} = reviewschema.validate(req.body);
    if (error) { // { const errmsg= error.details.map((el)=>el.massage).join(",");
      errmsg=error.details.map((el)=>el.message).join(",")
      throw new expresserr(400, errmsg);
    }
    else {
      next();
    }
  }