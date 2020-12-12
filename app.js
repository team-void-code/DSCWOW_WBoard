const express = require("express");
const ejs = require("ejs");
const app = express();

app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("landing");
});

app.get("/test",(req,res)=>{
    res.render("testing");
});
app.get("/home",(req,res)=>{
    res.render("home");
});

app.listen(4100,()=>{
    console.log("Server started at http://localhost:4100");
});