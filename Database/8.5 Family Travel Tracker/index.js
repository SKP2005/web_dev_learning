import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Sanjeet@postgres",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id=($1)",[currentUserId]);
  let countries = [];
  result.rows.forEach((country) => {
    // console.log(country.country_code);
    countries.push(country.country_code);
  });
  return countries;
}
app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  let response=await db.query("SELECT * from users");
  let response2=await db.query("SELECT color from users where id=($1)",[currentUserId]);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: response.rows,
    color: response2.rows[0].color,
  });
  console.log(countries);
  console.log(response2.rows);
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code,user_id) VALUES ($1,$2)",
        [countryCode,currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/user", async (req, res) => {
  if(req.body.add=="new"){
    res.render("new.ejs");
  }else{
    currentUserId=req.body.user;
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  console.log(req.body);
  var name1=req.body.name;
  var color1=req.body.color||'teal';
  await db.query(
    "INSERT INTO users (name,color) VALUES ($1,$2)",[name1,color1]
  );
  const response=await db.query("SELECT id from users where name=($1)",[name1]);
  console.log(response);
  currentUserId=response.rows[0].id;
  res.redirect("/");
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
