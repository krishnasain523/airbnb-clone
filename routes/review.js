const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync");
const Listing = require("../models/listning");
const Review = require("../models/review");
const { validatereview, isloggedin, isreviewauthor } = require("../middleware")
const reviewcantroller = require("../controller/review")
//create reviews
router.post("/", isloggedin, validatereview, wrapasync(reviewcantroller.createreview))

//delete review
router.delete("/:reviewid", isloggedin, isreviewauthor, wrapasync(reviewcantroller.destroyreview))

module.exports = router;