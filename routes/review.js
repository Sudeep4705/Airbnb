const express = require("express");

const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing =require("../models/listing.js")
const Review =require("../models/review.js")
const ExpressError =require("../utils/expreessError.js");
const reviewController = require("../controllers/reviews.js")

const {validateReview,isloggedIn,isauthor}=require("../middleware.js")


// for review schema

// const validateReview =((req,res,next)=>{
//   let {error} =reviewSchema.validate(req.body);
// let errMsg=error.details.map((el)=>el.message).join(",");
// if(error){
//   throw new ExpressError(400,errMsg)
// }else{
//   next();
// }
// })

  




// reviews route
  
router.post("/",isloggedIn,validateReview,wrapAsync( reviewController.createreview))






// delete review route
router.delete("/:reviewId", isloggedIn,isauthor,wrapAsync(reviewController.destroyReview))


module.exports = router;