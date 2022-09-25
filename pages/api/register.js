import { usersRepo } from 'database/user-repo';
const bcrypt = require('bcryptjs');

async function register(req, res) {
    // split out password from user details 
    const { password, ...user } = req.body;

    // validate
    let existed_user = await usersRepo.find(user.email);
    if(existed_user){
        return res.status(500).json({"errorMessage":`User with the email "${user.email}" already exists`});
    }
        
    // hash password
    user.hash = bcrypt.hashSync(password, 10);    

    usersRepo.create(user);
    return res.status(200);
}

export default register;
