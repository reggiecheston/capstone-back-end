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
  host: "sql5.freemysqlhosting.net",
  user: "sql5690210",
  password: "qpPEZD1FEa",
  database: "sql5690210"
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
        //req.isAdmin = user.isAdmin;
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
  const dueDate = req.body.due_date;
  const staffId = req.body.staff_id;
  try {
      const sql = `INSERT INTO reports (title, summary, category, priority, due_date, staff_id) VALUES 
      ('${title}', '${summary}', '${category}', '${priority}', '${dueDate}', '5')`;
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


function fetchReportData(callback) {
  const sql = `SELECT * FROM reports`;
  database.query(sql, (error, result) => {
    if (error) {
      console.error(`Error fetching data: ${error}`);
      callback(error, null);
    } else {
      let ticketData = result.map(report => ({
        title: report.title,
        summary: report.summary,
        category: report.category,
        priority: report.priority,
        dueDate: report.dueDate
      }));
      callback(null, ticketData);
    }
  });
}



// const sql = `INSERT INTO tickets (title, summary, category, size, priority, due_date, progress, isapproved, escalated, developer_assigned_id, staff_id, admin_assignor_id)
  //  VALUES ( '${title}', '${summary}', '${category}', "small", '${priority}', '${dueDate}', "not started", "0", "0", "1", "5", "3")`;


function fetchUpdatedData(callback) {
  console.log(req.body);
  const title = req.body.title;
  const summary = req.body.summary;
  const category = req.body.category.trim();
  const priority = req.body.priority;
  const dueDate = req.body.due_date;
  const staffId = req.body.staff_id;

  const sql = `INSERT INTO tickets (title, summary, category, size, priority, due_date, progress, isapproved, escalated, developer_assigned_id, staff_id, admin_assignor_id)
  VALUES ( '${title}', '${summary}', '${category}', "small", '${priority}', '${dueDate}', "not started", "0", "0", "1", "5", "3")`;

  database.query(sql, (error, result) => {
    if (error) {
      console.error(`Error fetching data: ${error}`);
      callback(error, null);
    } else {
      let updatedTicketData = result.map(report => ({
        title: report.title,
        summary: report.summary,
        category: report.category,
        priority: report.priority,
        dueDate: report.dueDate
      }));
      callback(null, updatedTicketData);
    }
  });
}

// app.post('/updatedTickets', (req, res) => {
//   fetchUpdatedData(req.body, (error, updatedTicketData) => {
//     if (error) {
//       res.status(500).send('Error fetching data from database');
//     } else {
//       res.json(updatedTicketData);
//     }
//   });
// });

app.post("/updatedTickets", async (req, res) => {
  const { title, summary, category, priority, dueDate, staffId } = req.body;
  try {
   
  const sql = `INSERT INTO tickets (title, summary, category, size, priority, due_date, progress, isapproved, escalated, developer_assigned_id, staff_id, admin_assignor_id)
  VALUES ( '${title}', '${summary}', '${category}', "small", '${priority}', '${dueDate}', "not started", "0", "0", "1", "5", "3")`;
    await database.query(sql, values);
    res.json({ message: "Your report has been submitted" });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).send({ error: "Could not send report" });
  }
});

app.get('/updatedTickets', (req, res) => {
  fetchUpdatedData((error, updatedTicketData) => {
    if (error) {
      res.status(500).send('Error fetching data from database');
    } else {
      res.json(updatedTicketData);
    }
  });
});


app.post('/reports', (req, res) => {
  fetchReportData((error, ticketData) => {
    if (error) {
      res.status(500).send('Error fetching data from database');
    } else {
      res.json(ticketData);
    }
  });
});

app.get("/reports", (req, res) => {
  fetchReportData((error, ticketData) => {
    if (error) {
      res.status(500).send('Error fetching data from database');
    } else {
      res.json(ticketData);
    }
  });
});




function fetchTicketData(callback) {
  const sql = `SELECT * FROM tickets`;
  database.query(sql, (error, result) => {
    if (error) {
      console.error(`Error fetching data: ${error}`);
      callback(error, null);
    } else {
      let ticketData = result.map(report => ({
        title: report.title,
        summary: report.summary,
        category: report.category,
        priority: report.priority,
        dueDate: report.dueDate
      }));
      callback(null, ticketData);
    }
  });
}


app.post('/tickets', (req, res) => {
  fetchTicketData((error, ticketData) => {
    if (error) {
      res.status(500).send('Error fetching data from database');
    } else {
      res.json(ticketData);
    }
  });
});

app.get("/tickets", (req, res) => {
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

module.exports = fetchUpdatedData;