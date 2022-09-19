const bcrypt = require('bcryptjs');

import { apiHandler } from 'helpers/api';
import { usersRepo, omit } from 'helpers/api';

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete
});

async function getById(req, res) {
    const user = await usersRepo.getById(parseInt(req.query.id));
    
    if (!user) throw 'User Not Found';

    return res.status(200).json(omit(user, 'hash'));
}

async function update(req, res) {
    let user;
    try{
        user = await usersRepo.getById(parseInt(req.query.id));
    }
    catch(error){
        console.error(error);
        return res.status(500).json({"error":error});
    }
        
    if (!user) {
        throw 'User Not Found';
    }

    // split out password from user details 
    const { password, ...params } = req.body;

    // validate
    if (user.email !== params.email && await usersRepo.find(params.email)){
        throw `User with the email "${params.email}" already exists`;
    }
        
    // only update hashed password if entered
    if (password) {
        user.hash = bcrypt.hashSync(password, 10);
    }

    try{
        let result = await usersRepo.update(parseInt(req.query.id), params);
        return res.status(200).json({"result":result});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({"error":error});
    }
}

async function _delete(req, res) {
    try{
        let result = usersRepo.delete(parseInt(req.query.id));
        return res.status(200).json({"result": result});
    }
    catch(error){
        return res.status(500).json({"error": error});
    };   
}
