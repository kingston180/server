const express=require("express")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
var multer = require('multer');
const fs=require("fs");
const router=express.Router()
const User=require("./Database/regschema")
var {Image} = require('./Database/upschema');
const authenticate=require("./middleware/authenticate");
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage }).single('testImg');
router.get("/",(req,res)=>{
    res.send("Hello world");
})

router.post("/register",(req,res)=>{
    const { name,email,number,password,password_c,countAdopted}=req.body
     if(!name || !email || !number || !password || !password_c){
       return res.status(410).json({ERROR: "Please fill all the required fields"});
     }
     else if(password!==password_c) return res.status(410).json({Error:"Passwords must match!"});

     User.findOne({email:email},(err,element)=>{
        if(element) return res.status(410).json({Error:"Email already in use"});
        else{
        const user= new User({name,email,number,password,password_c,countAdopted});

        user.password=bcrypt.hashSync(user.password,12);
        user.password_c=bcrypt.hashSync(user.password_c,12);

        user.save((err)=>{
           if(err) res.status(410).json({Error:"Error occured"});
        })
        return res.status(201).json({Message:"User registered succesfully!!"});}
     })
     
})

router.post("/signin",(req,res)=>{
    const { email, password}=req.body;
    let token={};
    if(!email || !password){
        return res.status(410).json({error:"Plz fill all the fields"});
    }
    User.findOne({email:email},(err,element)=>{
        if(!element) return res.status(410).json({"ERROR":"Invalid credentials!"});
        else{
            bcrypt.compare(password,element.password,(err,result)=>{
                if(result) {
                    token=element.generateAuthToken();
                    User.updateOne({email:element.email},{token:token});
                    res.status(200).cookie("botoken",token,{
                        path:"/",
                        expires: new Date(Date.now()+30*24*60*60*1000),
                        httpOnly:true,
                        sameSite:"strict"
                    });
                return res.status(200).json({"Message":"Login Succesful"});
                }
                else return res.status(410).json({"ERROR":"Invalid credentials!"});
            });     
        }
    })


})

router.delete("/register",(req,res)=>{
    User.deleteMany(err=>{
        if(!err) return res.status(200).json({Msg:"Delete successful"})
    });
})
router.delete("/sell",(req,res)=>{
    Image.deleteMany(err=>{
        if(!err) return res.status(200).json({Msg:"Delete successful"})
    })
})

router.post("/sell",upload,(req,res)=>{
    const {Name,Type,age,breed,desc,gender}=req.body;
    if(!Name||!Type||!breed||!age||!desc||!gender) return res.status(410).json({error:"Plz fill all the fields properly"});

    var obj = new Image({Name, Type, desc, age, breed,gender,img:{data:fs.readFileSync('uploads/'+req.file.filename),contentType:"image/png"}});
    obj.save(err=>{
        return res.status(200).json({Msg:"Good"});
    });
});

router.get("/adopt",async (req,res)=>{
    const all=await Image.find();
    res.json(all);
})

router.post("/adoptT",async (req,res)=>{
    const {id}=await req.body;
    let arr=[];
    console.log(id);
    User.findOne({_id:id},function(er,cb){if(!er) arr.push(cb); console.log(arr);});
    res.status(200).send(arr);
})
router.get("/adoptS",authenticate,async (req,res)=>{
    console.log("Authenticate user");
    res.status(200).send(req.genUser);
})

router.post("/delAdopt",async (req,res)=>{
    const {id,Uid}=req.body;
    const arr= await Image.findOne({_id:id});
    if(arr){
    User.updateOne({_id:Uid},{$push:{'adopted':arr},$inc:{"countAdopted":1} })
    .then((obj) => {
        console.log(obj);
    })
    .catch((err) => {
        console.log('Error: ' + err);
    })
    Image.deleteOne({_id:id},function(er,cb){
        if(!er) console.log(cb);
    })
    res.status(200).send({'name':arr.Name});}
})

router.get("/logout",async (req,res)=>{
    res.clearCookie("botoken",{path:"/"});
    res.status(200).send("User logged out");
})

module.exports=router

