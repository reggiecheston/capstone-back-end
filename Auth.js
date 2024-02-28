
// only logged in user can access page
function authUser(req, res, next) {
    // if user is not logged in, send 403 status code and message
  if (req.user == null) {
    res.status(403)
    return res.send('Please sign in')
  }
  next()
}

// authenticating role

function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            res.status(401)
            return res.send('not allowed')
        }

        next()
    }
}

  
//   app.get('/users',(req,res)=> {
//       const sql = "SELECT * from cats";
//       db.query(sql, (error, data) => {
//           if (error) return res.json(error);
//           return res.json(data);
//   })
//   })

module.exports = {
    authUser,
    authRole
}

