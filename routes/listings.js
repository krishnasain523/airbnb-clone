const express = require("express");
const router = express.Router();
const expresserr = require("../utils/expresserr");
const wrapasync = require("../utils/wrapasync");
const Listing = require("../models/listning");
const { isloggedin, isowner, validatelisting } = require("../middleware");
const user = require("../models/user");
const listingcontroller = require("../controller/listings")

const multer  = require('multer')
const{storage}=require("../cloudconfig.js");
const upload = multer({ storage })

//index route
router.get("/", wrapasync(listingcontroller.index))
//new route
router.get("/new", isloggedin, listingcontroller.newform)

// show route
router.get("/:id", wrapasync(listingcontroller.showlisting))


//create route
router.post("/create", isloggedin,upload.single('listing[image]'), validatelisting, wrapasync(listingcontroller.createlisting));
//edit route
router.get("/:id/edit", isloggedin, wrapasync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  let originalimage=listing.image.url;
   let originalimageurl=originalimage.replace("/upload","/upload/w_400/e_blur:300")
  if (!listing) {
    req.flash("err", "listing does not exits");
    res.redirect("/listings");
  }
  res.render("edit.ejs", { listing, originalimageurl });
}));
//update route
router.patch("/:id", isloggedin, isowner,upload.single('listing[image]'), validatelisting, wrapasync(listingcontroller.updatelisting));
//delete route
router.delete("/:id", isloggedin, isowner, wrapasync(listingcontroller.destroylisting))
module.exports = router;