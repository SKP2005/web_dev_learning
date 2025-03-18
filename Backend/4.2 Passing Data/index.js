import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  var heading="Enter your name below ";
  res.render("index.ejs",{
    head:heading,
  });
});

app.post("/submit", (req, res) => {
  var f=req.body["fName"];
  var s=req.body["lName"];

  var heading=`Letters in your name are: ${f.length+s.length}`;
  res.render("index.ejs",{
    head:heading,
  })
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
