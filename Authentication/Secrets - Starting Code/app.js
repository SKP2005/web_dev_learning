//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const pg=require("pg");
const bcrypt=require("bcryptjs");
const saltRounds=10;
const session = require("express-session");
const passport = require("passport");

var LocalStrategy = require('passport-local');

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

app.use(session({
    secret:"our secret.",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());


// var strategy = new LocalStrategy(function verify(username, password, cb) {
//   db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, user) {
//     if (err) { return cb(err); }
//     if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
    
//     crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//       if (err) { return cb(err); }
//       if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
//         return cb(null, false, { message: 'Incorrect username or password.' });
//       }
//       return cb(null, user);
//     });
//   });
// });

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
    const email = req.body.username.trim();
    const password = req.body.password.trim();
    bcrypt.hash(password, saltRounds, async(err, hash)=> {
        await db.query("INSERT INTO users(email,password) VALUES($1,$2)",[email,hash]);
        console.log(hash);
        console.log(typeof(hash));
        res.render("secrets");
    });
});

app.post("/login", async (req, res) => {
    const email = req.body.username.trim();
    const password = req.body.password.trim();

    try {
        const response = await db.query("SELECT password FROM users WHERE email = $1", [email]);

        if (response.rows.length === 0) {
            console.log("User not found");
            return res.redirect("/");
        }
        //whitespace errors
        const hashedPassword = response.rows[0].password.trim();

        bcrypt.compare(password, hashedPassword, function (err, result) {
            if (err) {
                console.error("Bcrypt error:", err);
                return res.redirect("/");
            }

            if (result === true) {
                console.log("Login successful");
                return res.render("secrets");
            } else {
                console.log("Incorrect password");
                return res.redirect("/");
            }
        });

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Internal Server Error");
    }
});










app.listen(3000,()=>{
    console.log("Server is running on port 3000. ");
})
