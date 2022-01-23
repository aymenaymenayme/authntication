// jshint esversion:6

require("dotenv").config();
const session = require("express-session");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// encryption=require("mongoose-encryption");
// md5=require("md5");
// const bcrypt = require("bcrypt");
// const saltrounds = 10;
const passport = require("passport");
passportLocalMongoose = require("passport-local-mongoose");
var sessionStore = new session.MemoryStore();
// var beforesession = function(req, res, next) {
//   // console.log(req.session);
//   console.log("before session");
//   console.log(req.user);
//   console.log(req.session);
//   console.log(req.sessionID);
//   console.log(sessionStore);
//   console.log("##############################################################################################");
//   next();
// }
// var aftersession = function(req, res, next) {
//   // console.log(req.session);
//   console.log("after session");
//   console.log(req.user);
//   console.log(req.session);
//   console.log(req.sessionID);
//   console.log(sessionStore);
//   console.log("##############################################################################################");
//   next();
// }
// var afterpass = function(req, res, next) {
//   console.log("after passinit");
//   console.log(req.user);
//   console.log(req.sessionID);
//   console.log(req.session);
//   console.log(sessionStore);
//   console.log("##############################################################################################");
//   next();
// }
// var afterpasssession = function(req, res, next) {
//   // console.log(req.session);
//   console.log("after passport session");
//   console.log(req.user);
//   console.log(req.sessionID);
//   console.log(req.session);
//   console.log(sessionStore);
//   console.log("##############################################################################################");
//   next();
// }


app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', "ejs");
app.use(express.static("public"));
// app.use(beforesession);
app.use(session({
  store: sessionStore,
  secret: 'my secret',
  resave: false,
  saveUninitialized: false
}));
// app.use(aftersession);
app.use(passport.initialize());
// app.use(afterpass);
app.use(passport.session());
// app.use(afterpasssession);

mongoose.connect('mongodb://localhost:27017/secretDB');

const userSchema = new mongoose.Schema({
  // email: String,
  // password: String
});
userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(encryption, {secret:process.env.secret,encryptedFields:["password"]});
const User = mongoose.model("user", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
  res.render("home");
  // console.log("main page");
  // console.log(sessionStore);
  // console.log("###############################################");
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.post("/login", function(req, res) {
  // User.findOne({
  //   email: req.body.username
  // }, function(err, founduser) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //
  //     if (founduser) {
  //       bcrypt.compare(req.body.password, founduser.password, function(err, result) {
  //         // result == true
  //         if (result === true) {
  //           res.render("secrets");
  //         } else {
  //           res.send("wrong password");
  //         }
  //       });
  //     } else {
  //       res.send("User not found, you need to register")
  //     }
  //   }
  //
  // });
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (err) {
      console.log(err);
      res.redirect("login");
    } else {
      // console.log("after req.log");
      // console.log(req.user);
      // console.log(req.sessionID);
      // console.log(req.session);
      // console.log(sessionStore);
      passport.authenticate("local")(req, res, function() {
        // console.log("after authentication");
        // console.log(req.sessionID);
        // console.log(req.session);
        // console.log(req.user);
        // console.log(res);
        // console.log(sessionStore);
        res.redirect("/secret");
        // console.log(sessionStore);
      });


    }
  });

});


app.get("/secret", function(req, res) {
  // console.log("after secret");
  // console.log(req.sessionID);
  // console.log(req.session);
  // console.log(sessionStore);
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.render("login");

  }

});

app.post("/register", function(req, res) {
  // User.findOne({
  //   email: req.body.username
  // }, function(err, founduser) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     if (founduser) {
  //       res.send("you are already registered");
  //     } else {
  //       bcrypt.hash(req.body.password, saltrounds, function(err, hash) {
  //         // Store hash in your password DB.
  //         const newuser = new User({
  //           email: req.body.username,
  //           password: hash
  //         });
  //         newuser.save(function(err, result) {
  //           if (err) {
  //             console.log(err);
  //           } else {
  //             res.render("secrets");
  //           }
  //         })
  //
  //       });
  //
  //     }
  //   }
  //
  // });
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        // console.log("after authentication");
        // console.log(req.sessionID);
        // console.log(req.session);
        // console.log(req.user);
        // console.log(res);
        // console.log(sessionStore);
        res.redirect("/secret");
        // console.log(sessionStore);
      });
    }


  });

});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/logout",function(req, res) {
  req.logout();
  // console.log("after logout;");
  // console.log(req.sessionID);
  // console.log(req.session);
  // console.log(req.user);
  res.render("login");
  // console.log(sessionStore);
})


app.listen(3000, function() {
  console.log("start server on port 3000");
})
