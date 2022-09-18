const bcrypt = require('bcryptjs');

import { apiHandler, usersRepo } from 'helpers/api';

export default apiHandler({
    post: register
});

async function register(req, res) {
    // split out password from user details 
    const { password, ...user } = req.body;

    // validate
    let existed_users = await usersRepo.find(user);
    if(existed_users){
        throw `User with the username "${user.username}" already exists`;
    }
        
    // hash password
    user.hash = bcrypt.hashSync(password, 10);    

    usersRepo.create(user);
    return res.status(200).json({});
}
