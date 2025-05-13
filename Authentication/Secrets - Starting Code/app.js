//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const pg=require("pg");
const bcrypt=require("bcryptjs");
const saltRounds=10;


const app=express();

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "userDB",
    password: "Sanjeet@postgres",
    port: 5432,
});
db.connect();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",async(req,res)=>{
    var email=req.body.username;
    bcrypt.hash(req.body.password, saltRounds, async(err, hash)=> {
        await db.query("INSERT INTO users(email,password) VALUES($1,$2)",[email,hash]);
        res.render("secrets");
    });
});

app.post("/login",async(req,res)=>{
    var email=req.body.username;
    var password=req.body.password;
    const response=await db.query("SELECT password FROM users WHERE email=($1)",[email]);
    console.log(typeof(req.body.password));
    console.log(typeof(response.rows[0].password));
    bcrypt.compare(req.body.password, response.rows[0].password, function(err, result) {
        console.log(result);
        if(result==true){
            res.render("secrets");
            console.log(1);
        }else{
            res.redirect("/"); 
            console.log(2);
        }
    });
    console.log(password);
    console.log(response.rows[0].password);
});









app.listen(3000,()=>{
    console.log("Server is running on port 3000. ");
})
