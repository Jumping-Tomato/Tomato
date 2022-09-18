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
    const user = await usersRepo.getById(parseInt(req.query.id));
   
    if (!user) throw 'User Not Found';

    // split out password from user details 
    const { password, ...params } = req.body;

    // validate
    if (user.username !== params.username && await usersRepo.find(params.username))
        throw `User with the username "${params.username}" already exists`;

    // only update hashed password if entered
    if (password) {
        user.hash = bcrypt.hashSync(password, 10);
    }

    usersRepo.update(parseInt(req.query.id), params)
    .then(function(result){
        return res.status(200).json({"result":result});
    })
    .catch(function(error){
        throw error;
    });
    
}

function _delete(req, res) {
    usersRepo.delete(req.query.id);
    return res.status(200).json({});
}
