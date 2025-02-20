const Listing = require("../models/listning");



module.exports.index = async (req, res) => {
    const alllisting = await Listing.find();
    res.render("index.ejs", { alllisting });
}

module.exports.newform = (req, res) => {
    res.render("new.ejs");
}
module.exports.showlisting = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("err", "listing does not exits");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("show.ejs", { listing });
}

module.exports.createlisting = async (req, res, next) => {
    let listing = req.body.listing;
    let url=req.file.path;
    let filename=req.file.filename;
    // if (!req.body.listing) {
    //   throw new expresserr(400, "Invalid Listing Data");
    // }
    // console.log(listing);
    let newlisting = new Listing(listing);
    newlisting.owner = req.user._id;
    newlisting.image={url,filename}

    await newlisting.save();
    req.flash("key", "new listing added");
    res.redirect("/listings");

}
module.exports.updatelisting = async (req, res) => {
    const { id } = req.params;
    let url=req.file.path;
    let filename=req.file.filename;
   let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if( typeof req.file!="undefined")
   {
    listing.image={url,filename};
    await listing.save();
   
   }
    req.flash("key", "listing updated");
    res.redirect(`/listings/${id}`);

}
module.exports.destroylisting = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("key", "listing deleted");
    res.redirect(`/listings`);
}   