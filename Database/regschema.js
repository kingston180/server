const mongoose=require("mongoose")
var {cardSchema} = require('./upschema');
const jwt=require("jsonwebtoken")
const user=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    password_c:{
        type:String,
        required:true
    },
    token:{
        type:String
    },
    adopted:{
        type:[cardSchema]
    },
    sold:{
        type:[cardSchema]
    },
    countAdopted:{
        type:Number
    }
})

user.methods.generateAuthToken= function(){
    let token=jwt.sign({_id:this._id},process.env.secret);
    this.token=token;
    this.save();
    return token;
}

const USER=mongoose.model('USER',user)

module.exports=USER