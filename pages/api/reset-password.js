import ResetPassword from "pages/auth/reset-password";
import { usersRepo } from 'database/user-repo';
const bcrypt = require('bcryptjs');

export default async function resetPasswordHandler(req, res) {
    const { id, password, newPassword } = req.body;
    let user;
    try{
        user = await usersRepo.getById(id);
    }
    catch(erorr){
        console.error("user id: "+ id);
        console.error(error);
        return res.status(500).json({"error": "Unable to reset password. Please contact customer service."});
    }
    if(!bcrypt.compareSync(password, user.hash)){
        return res.status(500).json({"error": "Password is incorrect."});
    }
    try{
        user.hash = bcrypt.hashSync(newPassword, 10);
        await usersRepo.update(id,user);
        return res.status(200).send("success");
    }
    catch(error){
        console.error("user id: "+ id);
        console.error(error);
        return res.status(500).json({"error": "Unable to reset password. Please try again later"});
    }
}

