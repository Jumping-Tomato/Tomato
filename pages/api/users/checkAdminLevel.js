const bcrypt = require('bcryptjs');

import { apiHandler, usersRepo } from 'helpers/api';


export default apiHandler({
    get: checkAdminLevel
});

async function checkAdminLevel(req, res) {
    const uid = parseInt(req.query.id);
 
    try{
        let isAdmin = await usersRepo.isAdmin(uid); 
        return res.status(200).json({"isAdmin":isAdmin});
    }
    catch (error) {
        return res.status(500).json({"error":error});
    };
    
}
