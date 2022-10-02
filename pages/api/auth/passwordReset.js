import { passwordResetRepo } from 'database/password-reset-repo';

export default async function passwordReset(req, res) {
    // split out password from user details 
    const { email } = req.body;
    try{
        let result = await passwordResetRepo.sendPasswordResetLink(email);
        return res.status(200).send("success");
    }
    catch(error){
        console.error(error)
        return res.status(500).json({"error":error});
    }
}
