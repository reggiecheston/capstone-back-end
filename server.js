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
const cors = require('cors');


app.use(cors());

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
    res.send('TEST TEST');
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

function setUser(req, res, next) {
    const userId = req.body.userId;
    if (userId) {
        req.user = users.find(user => user.id === userId);
    }
    next();
}
// are you guys hashing passwords in database
function loginUser(username, password) {
  return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM users WHERE username = $1', [username], async (error, results) => {
          if (error) {
              reject(error);
          }
          if (results.rows.length > 0) {
              const user = results.rows[0];
              if (await bcrypt.compare(password, user.password)) {
                  resolve({ userId: user.id, isAdmin: user.isadmin });
              } else {
                  reject('Username or password is incorrect');
              }
          } else {
              reject('Username does not exist');
          }
      });
  });
}


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      const user = await loginUser(username, password);
      req.userId = user.userId;
      req.isAdmin = user.isAdmin;
      res.send('Logged in!');
      console.log('logged in');
      res.redirect(req.isAdmin ? '/dashboardAdmin' : '/dashboard');
  } catch (error) {
      res.send(error);
  }
});



   //   req.session.userId = user.id;
 //   req.session.isAdmin = user.isadmin;

app.listen(4000, ()  => {
    console.log('Server is listening on port 4000.')
});

module.exports = loginUser;

// all 3 queries need to be run one after another
