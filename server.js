const express = require("express");
const app = express();
const { users, projects, ROLE } = require("./data");
const { authUser, authRole } = require("./Auth");
const projectsRouter = require("./routes/projects");
const mysql2 = require("mysql2/promise");
const bcrypt = require("bcrypt");

require('dotenv').config();
const database = mysql2.createConnection({
  host: process.env.database_HOST,
  user: process.env.database_USER,
  password: process.env.database_PASSWORD,
  database: process.env.databse_NAME,
  waitForConnections: true,
});

app.use((req, res, next) => {
  req.database = pool;
  next();
});

app.use(express.json());
app.use("/projects", projectsRouter);
const cors = require("cors");
app.use(cors());
 
app.get("/", (req, res) => {
  res.send("Home Page");
});
 
app.get("/login", (req, res, next) => {
  res.send("TEST TEST");
});
 
app.get("/staff", (req, res) => {
  res.send("users");
});
app.get("/dev", (req, res) => {
  res.send("users");
});
 
app.get("/admin", authUser, authRole(ROLE.ADMIN), (req, res) => {
  res.send("admin page");
});
 
app.post("/login", async (req, res, next) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  try {
    const sql = `SELECT * FROM staff WHERE email = "${email}" and user_password = "${password}"`;
    database.query(sql, [req.body.email], async (error, result) => {
      if (error) {
        throw error;
      }
      if (result.length > 0) {
        const email = req.body.email;
        const password = req.body.password;
        res.send({ message: "Logged in!", user: result });
        console.log("logged in");
        const role = `SELECT admin_id, developer_id FROM staff WHERE email = "${email}"`;
        if (res.ok) {
          console.log(res);
          const data = await res.json();
          if (res.body.admin_id) {
            navigate("/Admin");
          } else {
            navigate("/dashboard");
          }
        }
      } else {
        res.send({ message: "Invalid email or password" });
      }
    });
  } catch (error) {
    res.status(500).send({ error: "hi ):" });
  }
});

app.post("/staff", async (req, res, next) => {
  console.log(req.body);
  const title = req.body.title
  const summary = req.body.summary;
  const category = req.body.category.trim();
  const priority = req.body.priority;
  const dueDate = req.body.dueDate;
  const staffId = req.body.staff_id;
  try {
      const sql = `INSERT INTO reports (title, summary, category, priority, due_date, staff_id) VALUES 
      ('${title}', '${summary}', '${category}', '${priority}', '${dueDate}', '7')`;
      console.log(req.body);
      console.log(dueDate);
      database.query(sql, [req.body], async (error, result) => {

          if (error) {
              throw error;
          } // category, priority, due_date, summary, title, staff ID
          if (result.length > 0) {
              res.send({ message: "Your report has been submitted" });
              console.log('report submitted');

              
if (res.ok) {
  console.log(res)
  const data = await res.json();
}
          } else {
              res.send({ message: "Could not send report" });
            
          }
      });
  } catch (error) {
      res.status(500).send({ error: "error" });
  }
});
 
app.listen(4000, () => {
  console.log("Server is listening on port 4000.");
});
 
