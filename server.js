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

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    pool.query('SELECT * FROM users', [username], async (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows.length > 0) {
        const user = results.rows[0];
        if (await bcrypt.compare(password, user.password)) {
          req.userId = user.id && req.isAdmin !== user.isadmin;
          res.send('Logged in!');
          res.redirect('/dashboard');
        } else  if (await bcrypt.compare(password, user.password)) {
            req.userId = user.id && req.isAdmin == user.isadmin;
            res.send('Logged in!');
            res.redirect('/dashboardAdmin');
        }
       else {
          res.send('Username or password is incorrect');
        }
      } else {
        res.send('Username does not exist');
      }
    });
  });  

   //   req.session.userId = user.id;
 //   req.session.isAdmin = user.isadmin;

app.listen(3000, ()  => {
    console.log('Server is listening on port 3000.')
});