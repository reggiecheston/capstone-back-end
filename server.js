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

app.get('/', (req, res) => {
    res.send('Home Page');
})

app.get('/login', (req, res) => {
    res.send('Login');
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

// const db = mysql2.createConnection({
//     host: "localhost",
//     database: "MeowMatchmaker1",
//     user: "root",
//     password: "password",
    
//   });
  
// need another server to connect back end to
// need to make login server that sends the data to database after user logs in
// need to hash the password before sending to database

// post request allows user to sign up and send data to database 


// validates login information from database and then sends user to dashboard or admin page
 // login page, staff, dev, admin, page
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    pool.query('SELECT * FROM staff', [username], async (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows.length > 0) {
        const user = results.rows[0];
        if (await bcrypt.compare(password, user.password)) {
          req.userId = user.id && req.isAdmin !== user.isadmin;
          res.send('Logged in!');
          console.log('logged in');
          // create another function that redirects then
          // res.send json to make sure it is working, if it is function that redirects after response is recieved
        //   res.redirect('/dashboard');
        } else  if (await bcrypt.compare(password, user.password)) {
            req.userId = user.id && req.isAdmin == user.isadmin;
            res.send('Logged in!');
            console.log('logged in');
        }
       else {
          res.send('Username or password is incorrect');
          console.log('not working');
        }
      } else {
        res.send('Username does not exist');
        console.log('Username does not exist');
      }
    });
  });  
// erick posts that login info to a  server, then fetch from server, then run query to validate login info
// req.session.userId = user.id;
//   req.session.isAdmin = user.isadmin;

app.listen(3001);