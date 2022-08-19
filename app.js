const express=require("express")
const dotenv=require("dotenv")
const path=require("path")
const cookieParser=require("cookie-parser");
const app=express();
app.use(express.static(path.join(__dirname+"/public")));
const mongoose=require("mongoose")
var cors = require('cors')

app.use(cors({origin:"http://localhost:3000",credentials:true})) ;
app.use(cookieParser());

  
app.use(express.json())
dotenv.config({path:'./config.env'})
require("./Database/connection");
app.use(require("./auth"))
const port=process.env.port;
app.listen(port,()=>{
    console.log("Server is running on port no. 3000...")
})