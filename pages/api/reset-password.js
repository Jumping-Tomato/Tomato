import { usersRepo } from 'database/user-repo';
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb')

export default async function resetPasswordHandler(req, res) {
    const { id, password, newPassword } = req.body;
    let user;
    try{
        user = await usersRepo.getById(ObjectId(id));
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
        const hash = bcrypt.hashSync(newPassword, 10);
        await usersRepo.update(id,{hash:hash});
        return res.status(200).send("success");
    }
    catch(error){
        console.error("user id: "+ id);
        console.error(error);
        return res.status(500).json({"error": "Unable to reset password. Please try again later"});
    }
}

