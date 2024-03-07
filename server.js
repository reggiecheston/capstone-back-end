const express = require("express");
const app = express();
const { users, projects, ROLE } = require("./data");
const { authUser, authRole } = require("./Auth");
const projectsRouter = require("./routes/projects");
const mysql2 = require("mysql2");
const bcrypt = require("bcrypt");
const axios = require("axios");
 
app.use(express.json());
// app.use(setUser);
app.use("/projects", projectsRouter);
const cors = require("cors");
 
app.use(cors());
 
app.get("/", (req, res) => {
  res.send("Home Page");
});
const database = mysql2.createConnection({
  host: "database-1.c1suigess9hp.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "password",
  database: "capstone_team_3",
});
 
database.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database successfully");
});
 
app.get("/login", (req, res, next) => {
  res.send("TEST TEST");
});
 
app.get("/data", (req, res, next) => {
  res.send("TEST TEST");
});


app.get("/staff", (req, res) => {
  res.send("users");
});
app.get("/dev", (req, res) => {
  res.send("users");
});
 
// authUser in auth.js
 

 
 
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
        // req.userId = user.userId;
        // req.isAdmin = user.isAdmin;
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
 
//Need to add staff POST
 
// need to do res.send ticket object
app.post("/staff", async (req, res, next) => {
  console.log(req.body);
  const title = req.body.title;
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
              if (res.ok) {
                 res.send({
                   message: "Your report has been submitted",
                   title: title,
                   summary: summary,
                   category: category,
                   priority: priority,
                   dueDate: dueDate
                 });
              console.log('report submitted');
                console.log(res)
                const data = await res.json();
                console.log(data)
              }
           else {
              res.send({ message: "Could not send report" });
            
          }
      });
  } catch (error) {
      res.status(500).send({ error: "error" });
  }
});
 

 
// module.exports = loginUser;
 
// all 3 queries need to be run one after another


function fetchTicketData(callback) {
  const sql = `SELECT * FROM tickets AND reports`;
  database.query(sql, (error, result) => {
    if (error) {
      console.error(`Error fetching data: ${error}`);
      callback(error, null);
    } else {
      let ticketData = result.map(ticket => ({
        title: ticket.title,
        summary: ticket.summary,
        category: ticket.category,
        priority: ticket.priority,
        dueDate: ticket.dueDate
      }));
      callback(null, ticketData);
    }
  });
}

app.post('/admin', (req, res) => {
  fetchTicketData((error, ticketData) => {
    if (error) {
      res.status(500).send('Error fetching data from database');
    } else {
      res.json(ticketData);
    }
  });
});

app.get("/admin", (req, res) => {
  fetchTicketData((error, ticketData) => {
    if (error) {
      res.status(500).send('Error fetching data from database');
    } else {
      res.json(ticketData);
    }
  });
});





app.listen(4000, () => {
  console.log("Server is listening on port 4000.");
});

module.exports = fetchTicketData;