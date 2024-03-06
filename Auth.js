
// only logged in user can access page
function authUser(req, res, next) {
    if (res.body.admin_id) {

        next(); // User is logged in, so continue to the next middleware
    } else {
        res.status(401).send('Unauthorized'); // User is not logged in, send Unauthorized response
    }
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

module.exports = {
    authUser,
    authRole
}

