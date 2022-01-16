// jshint esversion:6

require("dotenv").config();

express=require("express");
bodyParser=require("body-parser");
ejs=require("ejs");
mongoose=require("mongoose");
encryption=require("mongoose-encryption");
app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine',"ejs");
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/secretDB');

const userSchema= new mongoose.Schema({
  email:String,
  password:String
});
userSchema.plugin(encryption, {secret:process.env.secret,encryptedFields:["password"]});
const User= mongoose.model("user", userSchema);

app.get("/",function(req,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/login",function(req,res){
User.findOne({email:req.body.username},function(err,founduser){
if(err){
  console.log(err);
}else{
  if(founduser){
    if(founduser.password===req.body.password){
      res.render("secrets");
    }else{
      res.send("wrong password");
    }
  }else{
    res.send("User not found, you need to register")
  }
}

});
});

app.post("/register",function(req,res){
  User.findOne({email:req.body.username},function(err,founduser){
  if(err){
    console.log(err);
  }else{
    if(founduser){
    res.send("you are already registered");
    }else{  const newuser=new User({
      email:req.body.username,
      password:req.body.password
      });
      newuser.save(function(err,result){
        if (err){
          console.log(err);
        }else{
          res.render("secrets");
        }
      })

    }
  }

  });

});
app.get("/login",function(req,res){
  res.render("login");
});



app.listen(3000,function(){
  console.log("start server on port 3000");
})
