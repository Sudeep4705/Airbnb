const Listing =require("./models/listing.js")
const ExpressError =require("./utils/expreessError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review =require("./models/review.js")


module.exports.isloggedIn = (req, res, next) => {
  // console.log(req.path,"..",req.originalUrl);
  
    if (!req.isAuthenticated()) {
      req.session.redirectUrl =req.originalUrl;
      req.flash("error", "You must be logged in to create a listing!");
      return res.redirect("/login");
    }
    next();
  };
  

  module.exports.saveredirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
  }


  module.exports.checkowner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(! listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","You are the not owner of the this listing");
     return res.redirect(`/listings/${id}`);
    }
    next();
  }

  module.exports.validateSchema = (req, res, next) => {
    try {
        const { error } = listingSchema.validate(req.body);
        
        if (error) {
            const errMsg = error.details.map((el) => el.message).join(", ");
            return res.status(400).json({ error: errMsg }); // Send error response instead of crashing
        }
  
        next(); // Proceed if validation passes
    } catch (err) {
        next(err); // Pass unexpected errors to Express error handler
    }
  };



  module.exports.validateReview = (req, res, next) => {
    try {
        const { error } = reviewSchema.validate(req.body);
        
        if (error) {
            const errMsg = error.details.map((el) => el.message).join(", ");
            return res.status(400).json({ error: errMsg });
        }
  
        next();
    } catch (err) {
        next(err);
    }
  };
  

  
  module.exports.isauthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(! review.author.equals(res.locals.currUser._id)){
      req.flash("error","You are the not owner of the this review");
     return res.redirect(`/listings/${id}`);
    }
    next();
  }