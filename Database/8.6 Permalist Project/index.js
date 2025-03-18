import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Sanjeet@postgres",
  port: 5432,
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework2" },
];

app.get("/", async(req, res) => {
  const response=await db.query("SELECT * from items ORDER BY id ASC");
  items=response.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items(title) VALUES($1)",[item]);
  // items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  const itemId=req.body.updatedItemId;
  const itemTitle=req.body.updatedItemTitle;
  await db.query("UPDATE items SET title=($1) WHERE id=($2)",[itemTitle,itemId]);
  res.redirect("/");
});

app.post("/delete", async(req, res) => {
  // console.log(req.body);
  const itemId=req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id=($1)",[itemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
