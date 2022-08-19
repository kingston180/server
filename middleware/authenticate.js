const jwt=require("jsonwebtoken");
const User=require("../Database/regschema");

const Authenticate=async (req,res,next)=>{
    try{
      const token=req.cookies.botoken;
      const verifyTok=jwt.verify(token,process.env.secret);
      const genUser=await User.findOne({_id:verifyTok._id});
      if(!genUser){throw new Error();}

      req.token=token;
      req.genUser=genUser;
      req.userId=genUser._id;
      next();
    }catch(err){
      res.status(401).send("Unauthorized person!");
      console.log(err);
    }
}

module.exports=Authenticate;