const User = require("../models/user.js");


module.exports.signupform = (req,res)=>{
    res.render("users/signup.ejs");
}


module.exports.signup =async(req,res)=>{
try{
    let {username,email,password} = req.body;
    const newuser =new User({email,username});
    const registerduser = await User.register(newuser,password);
    console.log(registerduser);
    req.login(registerduser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to wanderlust")
        res.redirect("/listings")

    })

}
catch(e){
req.flash("error",e.message);
res.redirect("/signup")
}
}


module.exports.loginform =((req,res)=>{
    res.render("users/login.ejs");
})

module.exports.login =async(req,res)=>{
req.flash("success","welcome back to wanderlust")
let redirectUrl = res.locals.redirectUrl || "/listings"
res.redirect(redirectUrl)
}

module.exports.logout =(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
          return  next(err)
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    })
}