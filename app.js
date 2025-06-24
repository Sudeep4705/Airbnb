if(process.env.NODE_ENV!="production"){ //
  require('dotenv').config()
}

// console.log(process.env.SECRET) // remove this after you've confirmed it is working
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing =require("./models/listing.js")
const Review =require("./models/review.js")
const path = require("path");
const methodOverride =require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError =require("./utils/expreessError.js");

const review= require("./models/review.js")
const listingRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/signup.js")

const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash  = require("connect-flash")
const passport = require("passport");
const LocalStrategy  = require("passport-local")
const User = require("./models/user.js")
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate);

const AtlasUrl = process.env.ATLASDB

main().then(()=>{
    console.log("connected");
    
})
.catch((err)=>{
    console.log(err);
    
})
async function main() {
    // await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
    await mongoose.connect(AtlasUrl)


}
app.listen(8080,()=>{
  console.log("server started");
  
  })


const store =MongoStore.create({
  mongoUrl:AtlasUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter:24*3600

 });

 store.on("error",()=>{
  console.log("errorrrrrr");
  
 })

const sessionOptions ={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+ 7 * 24 *60 * 60 * 1000,
    maxAge: 7 * 24 *60 * 60 * 1000,
    httpOnly:true

  }
}


// app.get("/",(req,res)=>{
//   res.send("hi im root")
// })



app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());  // store  info
passport.deserializeUser(User.deserializeUser());  // remove info


app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user;
  next();
})
// app.get("/cookies",(req,res)=>{
// res.cookie("greet")
// })

// app.get("/demouser", async(req,res)=>{
// let fakeuser  =  new User({
//   email:"stewie@gamil.com",
//   username:"stewie"
// });
// let newRegUser = await User.register(fakeuser,"helloworld")  // it will save the fake user data along password in database (register)
// res.send(newRegUser)
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


// for all invalid route
app.all("*",(req,res,next)=>{
  next( new ExpressError(404,"Page not found"))
  })
  

  // middleware
app.use((err,req,res,next)=>{
  let {status=500,message="Something went wrong"}=err;
  // res.status(status).send(message);
  res.status(status).render("error.ejs",{message});
 
})


// port
