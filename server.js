const express = require('express');
const app = express();
const { users, projects, ROLE } = require('./data')
const {authUser, authRole} = require('./Auth');
const projectsRouter = require('./routes/projects');
const mysql2 = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
const axios = require('axios');



app.use(express.json());
// app.use(setUser);
app.use('/projects', projectsRouter);

app.use(cors({
    origin: 'http://localhost:3000'
  }));

// session middleware
app.use(session({
    // need to put secret in env file
    secret: 'supersecretkey',
    cookie: { maxAge: 60000 },
    saveUninitialized: false
}));



app.get('/', (req, res) => {
    res.send('Home Page');
})

const database = mysql2.createConnection({
    host: 'database-1.c1suigess9hp.us-east-1.rds.amazonaws.com',
    user: 'admin', 
    password: 'password',
    database: 'capstone_team_3'
});

database.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database successfully');
});

database.query('SELECT * FROM staff', (error, results) => {
  
    const users = results.map(result => {
      return {
        email: result.email,
        password: result.user_password,
        role: result.admin_id ? ROLE.ADMIN : ROLE.STAFF
      };
    });
    console.log(users);
});



function authAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === ROLE.ADMIN) {
        axios.post('http://localhost:4000/authAdmin', req.session.user)
            .then(response => {
                console.log(response.data);
                next();
            })
            .catch(error => {
                console.error(error);
                res.status(403).send('Forbidden');
            });
    } else {
        res.status(403).send('Forbidden');
    }
}

