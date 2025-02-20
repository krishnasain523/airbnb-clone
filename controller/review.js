const Listing = require("../models/listning");
const Review = require("../models/review");
module.exports.createreview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    const newreview = new Review(req.body.reviews);
    newreview.author = req.user._id;
    await listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("key", "review added");
    res.redirect(`/listings/${listing.id}`);
}

module.exports.destroyreview = async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("key", "review deleted");
    res.redirect(`/listings/${id}`)
}