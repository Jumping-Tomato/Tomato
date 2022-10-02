import { passwordResetRepo } from 'database/password-reset-repo';

export default async function sendPasswordResetLink(req, res) {
    // split out password from user details 
    const { email } = req.body;
    try{
        await passwordResetRepo.sendPasswordResetLink(email);
        //need to send an email that contains the reset link here 
        //to the user here. Not Yet implemented, but will do.
        return res.status(200).send("success");
    }
    catch(error){
        console.error(error)
        return res.status(500).json({"error":error});
    }
}
