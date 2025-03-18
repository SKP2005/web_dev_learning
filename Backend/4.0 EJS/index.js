import express from "express";
import ejs from "ejs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

var port=3000;

const app=express();

const d=new Date();
var day=d.getDay();
var message;
if(day==0 || day==6){
    message=" the weekend, it's time to have fun!";
}else{
    message=" a weekday, it's time to work hard!";
}
app.get("/",(req,res)=>{
    res.render(__dirname+"/views/index.ejs",{
        Message:message
    });
});

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
});