const mongoose=require("mongoose")

mongoose.connect(process.env.db,{
    useNewUrlParser:true,
}).then(()=>console.log("Connection successful")).catch((err)=>console.log("Error Occured!"));

