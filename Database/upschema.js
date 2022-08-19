var mongoose = require('mongoose');
  
var cardSchema = new mongoose.Schema({
    Name: {
        type:String,
        required:true
    },
    Type:{
        type:String,
        required:true
    },
    desc: {
        type:String,
        required:true
    },
    img:
    {   data:Buffer,
        contentType:String,
    },
    age: {
        type:String,
        required:true
    },
    breed:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    }
});
  
//Image is a model which has a schema imageSchema
const Image=mongoose.model('Image', cardSchema);
module.exports = {Image,cardSchema};