const express = require('express');
const app = express();
const { users } = require('./data');
const projectsRouter = require('./routes/projects');

app.use(express.json());
app.use(setUser);
app.use('/projects', projectsRouter);

app.get('/', (req, res) => {
    res.send('Home Page');
})

app.get('/dashboard', (req, res) => {
    res.send('dashboard');
})

app.get('/admin', (req, res) => {
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

app.listen(3000);