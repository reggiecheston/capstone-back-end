const express = require('express');
const app = express();
const { users, projects, ROLE } = require('./data')
const {authUser, authRole} = require('./Auth');
const projectsRouter = require('./routes/projects');
const mysql2 = require('mysql2');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(setUser);
app.use('/projects', projectsRouter);

const database = mysql2.createConnection({
    host: 'database-1.c1suigess9hp.us-east-1.rds.amazonaws.com',
    user: 'admin', 
    password: 'password',
    databsase: 'capstone_team_3'
});

database.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database successfully');
});

app.get('/', (req, res) => {
    res.send('Home Page');
})

app.get('/login', (req, res) => {
    res.send('Home Page');
})

// authUser in auth.js
app.get('/dashboard', authUser, (req, res) => {
    res.send('dashboard');
})

app.get('/dashboardAdmin', authUser, authRole(ROLE.ADMIN), 
(req, res) => {
    res.send('admin page');
})

// middleware to set user
// set user based on user.id from data inside of data.js
// MAY NEED TO RECODE BASED ON DATA FROM SQL TABLE RATHER THAN DATA.JS

function setUser(req, res, next) {
    const userId = req.body.userId;
    if (userId) {
        req.user = users.find(user => user.id === userId);
    }
    next();
}

app.post("/login", async (req, res, next) => {
  console.log(req.body);
  const email = req.body.email
  const password = req.body.password;
  try {
      const sql = `SELECT * FROM staff WHERE email ="${req.body.email}" and password= "${req.body.password}"`;
      database.query(sql, [req.body.email], async (error, result) => {
          if (error) {
              throw error;
          }
          if (result.length > 0) {
              const email = req.body.email
              const password = req.body.password;
              req.userId = user.userId;
              req.isAdmin = user.isAdmin;
              res.send({ message: "Logged in!", user: result[0] });
              console.log('logged in');
              res.redirect(req.isAdmin ? '/dashboardAdmin' : '/dashboard');
          } else {
              res.send({ message: "Invalid email or password" });
          }
      });
  } catch (error) {
      res.status(500).send({ error: "hi ):" });
  }
});
   //   req.session.userId = user.id;
 //   req.session.isAdmin = user.isadmin;

app.listen(4000, ()  => {
    console.log('Server is listening on port 4000.')
});