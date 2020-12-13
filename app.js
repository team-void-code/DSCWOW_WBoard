const express = require("express");
const ejs = require("ejs");
const app = express();

app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("landing");
});
app.get("/home",(req,res)=>{
    res.render("dashboard");
});
app.get("/waiting/:meetingId",(req,res)=>{
    const id = req.params.meetingId;
    res.render("waiting",{meetingId : id});
});
app.get("/board/:meetingId",(req,res)=>{
    const id = req.params.meetingId;
    res.render("board",{meetingId : id});
});

app.listen(4100,()=>{
    console.log("Server started at http://localhost:4100");
});