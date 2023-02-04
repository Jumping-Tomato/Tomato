import { usersRepo } from 'database/user-repo';
import { verifyCaptcha } from 'helpers/functions';
const bcrypt = require('bcryptjs');

export default async function registerHandler(req, res) {
    // split out password from user details 
    const { captchaValue, password, ...user } = req.body;

    const captchaIsValid = await verifyCaptcha(captchaValue);
    if(!captchaIsValid){
        return res.status(500).json({"error":`'Invalid Captcha Value'`});
    }
    // validate
    let existed_user = await usersRepo.find(user.email);
    if(existed_user){
        return res.status(500).json({"error":`User with the email "${user.email}" already exists`});
    }
        
    // hash password
    user.hash = bcrypt.hashSync(password, 10); 
    try{
        const result = await usersRepo.create(user);
        if(result){
            return res.status(200).json({"result": result});
        }
        return res.status(500).json({"error": "unable to create user"});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({"error": error.message});
    }
    
}
