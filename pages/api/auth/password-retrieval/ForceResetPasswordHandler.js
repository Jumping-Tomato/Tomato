import { passwordResetRepo } from 'database/password-reset-repo';
import { usersRepo } from "database/user-repo";
const bcrypt = require('bcryptjs');

/**
 * This API endpoint is for un-authenticated users 
 * to reset their password from the password reset 
 * link they receive in their email.
 * @param {*} req 
 * @param {*} res 
 */
export default async function ForceResetPasswordHandler(req, res) {
    const { pwResetId, user_id, newPassword } = req.body;
    /*verify whether the user has requested to reset the password from
    * the "forgot password" page, whether the user_id received matches the 
    * user_id in the database, and whether the password reset link
    * is expired
    */
    let passwordResetDocument;
    try{
        passwordResetDocument = await passwordResetRepo.find(pwResetId);
    }
    catch(error){
        console.error(error);
        return res.status(500).json({"error": "unable to reset password."});
    }
    if(!passwordResetDocument || passwordResetDocument.user_id != user_id || 
        new Date() > new Date(passwordResetDocument.expire)){
            return res.status(500).json({"error": "unable to reset password."});
    }
    try{
        const new_hash = bcrypt.hashSync(newPassword, 10);
        await usersRepo.update( user_id,{hash:new_hash});
        return res.status(200).send("Password has been reset")
    } 
    catch(error){
        console.error(error);
        return res.status(500).json({"error": "unable to reset password."}); 
    }   
}
