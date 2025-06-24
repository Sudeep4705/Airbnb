const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")

const { isloggedIn, checkowner, validateSchema } = require("../middleware.js")
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudconfig.js")
const upload = multer({storage})    


// for schema
// const validateSchema =((req,res,next)=>{
//     let {error} =listingSchema.validate(req.body);
// let errMsg=error.details.map((el)=>el.message).join(",");
// if(error){
//     throw new ExpressError(400,errMsg)
//   }else{
//     next();
//   }
// })

// index route  // create route
router.route("/")
.get( wrapAsync(listingController.index))
.post(isloggedIn, upload.single('listing[image]'),validateSchema, wrapAsync(listingController.createListing))


// new route
router.get("/new", isloggedIn, listingController.renderNewform)

// update // show route // delete
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isloggedIn, checkowner,upload.single('listing[image]'), validateSchema, wrapAsync(listingController.updateListing))
.delete( isloggedIn, checkowner, listingController.destroyListing)


// edit
router.get("/:id/edit", isloggedIn, checkowner, wrapAsync(listingController.EditListing));












module.exports = router
