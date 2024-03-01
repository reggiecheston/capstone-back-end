const express = require('express');
const app = express();
const { users, projects, ROLE } = require('./data')
const {authUser, authRole} = require('./Auth');
const projectsRouter = require('./routes/projects');
const mysql2 = require('mysql2');
const bcrypt = require('bcrypt');

app.use(express.json());
// app.use(setUser);
app.use('/projects', projectsRouter);
const cors = require('cors');


app.use(cors());

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


app.get('/login', (req, res, next) => {
    res.send('TEST TEST');
})

app.get('/staff', (req, res) => {
    res.send('users');
})
app.get('/dev', (req, res) => {
    res.send('users');
})

// authUser in auth.js


app.get('/admin', authUser, authRole(ROLE.ADMIN), 
(req, res) => {
    res.send('admin page');
})



// middleware to set user
// set user based on user.id from data inside of data.js

// function setUser(req, res, next) {
//     const userId = req.body.userId;
//     if (userId) {
//         req.user = users.find(user => user.id === userId);
//     }
//     next();
// }
// are you guys hashing passwords in database
// function loginUser(email, password) {
//   return new Promise((resolve, reject) => {
//       database.query('SELECT * FROM staff WHERE email = ="${req.body.email}" and password= "${req.body.password}"', [email], async (error, results) => {
//           if (error) {
//               reject(error);
//           }
//           if (results.rows.length > 0) {
//               const user = results.rows[0];
//               if (await compare(password, user.password)) {
//                   resolve({ userId: user.id, isAdmin: user.isadmin });
//               } else {
//                   reject('email or password is incorrect');
//               }
//           } else {
//               reject('email does not exist');
//           }
//       });
//   });
// }

// insde post request , run sql query 
// have sql that checks if login is correct
// then if hashed correctly, do inside post itself
// write query then do validation
// do res.send then send back is admin or not , user id , etc
// then front end grab 


app.post("/login", async (req, res, next) => {
    console.log(req.body);
    const email = req.body.email
    const password = req.body.password;
    try {
        const sql = `SELECT * FROM staff WHERE email = "${req.body.email}" and user_password = "${req.body.password}"`;
        database.query(sql, [req.body.email], async (error, result) => {
    
            if (error) {
                throw error;
            }
            if (result.length > 0) {
                const email = req.body.email
                const password = req.body.password;
                // req.userId = user.userId;
                // req.isAdmin = user.isAdmin;
                res.send({ message: "Logged in!", user: result });
                console.log('logged in');
                const role = `SELECT admin_id, developer_id FROM staff WHERE email = "${email}"`;
  if (res.ok) {
    console.log(res)
    const data = await res.json();
    if (res.body.admin_id) {
      navigate('/Admin');
    } else {
      navigate('/dashboard');
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



   //   req.session.userId = user.id;
 //   req.session.isAdmin = user.isadmin;

app.listen(4000, ()  => {
    console.log('Server is listening on port 4000.')
});

// module.exports = loginUser;

// all 3 queries need to be run one after another
