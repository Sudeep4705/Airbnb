const { log } = require("console");
const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async (req, res, next) => {
    let lists = await Listing.find({});
    res.render("listings/index", { lists });
}

module.exports.renderNewform = (req, res) => {

    res.render("listings/new");
}


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listdata = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner")
    if (!listdata) {
        req.flash("error", "Listing you requested for doesnt exist")
        res.redirect("/listings")
    }
    res.render("listings/show", { listdata })
}


module.exports.createListing = async (req, res, next) => {
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if (result.error) {
    //     throw new ExpressError(400, result.error)
    // }
    // geo coding
  let   response = await  geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
       
    
   
   
let url=req.file.path;
let filename =req.file.filename


    const newListing = new Listing(req.body.listing)
    console.log(req.user);

    newListing.owner = req.user._id;
    newListing.image ={url,filename}
    newListing.geometry =response.body.features[0].geometry
 


    await newListing.save().then((res) => {
        console.log(res);

    })
    req.flash("success", "New listing created")
    res.redirect("/listings")



}

module.exports.EditListing = async (req, res) => {
    // res.send("your about to editt")
    let { id } = req.params
    const list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Listing you requested for doesnt exist")
        res.redirect("/listings")
        
    }
    let originalImageUrl=list.image.url;
        originalImageUrl =originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit", { list,originalImageUrl})


}


module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing")
    }
    let { id } = req.params;

   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
   if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename =req.file.filename
    listing.image = {url,filename}
    await listing.save();
   }
  
    req.flash("success", " listing updated")
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " listing deleted")
    res.redirect("/listings")

}