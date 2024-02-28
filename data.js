const ROLE = {
    ADMIN: 'admin',
    STAFF: 'staff',
    USER: 'user'
}

module.exports = {
    ROLE: ROLE,
    users: [
        {id: 1, name: 'Admin', role: ROLE.ADMIN},
        {id: 2, name: 'Staff', role: ROLE.STAFF}, 
        {id: 3, name: 'User', role: ROLE.USER}
    ],
    projects: [
        {id: 1, name: 'AdminProject', userId: 1},
        {id: 2, name: 'StaffProject', userId: 2},
        {id: 3, name: 'UserProject', userId: 3}
    ]
}