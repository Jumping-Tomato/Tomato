import { passwordResetRepo } from 'database/password-reset-repo';
import { send_email } from 'helpers/email';

export default async function sendPasswordResetLink(req, res) {
    // split out password from user details 
    const { email } = req.body;
    try{
        let password_reset_id = await passwordResetRepo.resetPassword(email);
        const recipients = [{
            address: email,
            name: email
        }];
        const password_reset_url = "https://jumpingtomato.com/auth/password-retrieval/" + password_reset_id.toString(); 
        const subject = "Your link to reset password on jumpingTomato.com";
        const html = `Please click on the link below to reset your password. The link will expire in 15 minutes. <a href="${password_reset_url}">link</a>\n
                      If the link above does not work. Please copy the following link and paste it to your browser:\n
                      ${password_reset_url}`;
        let email_sent = await send_email('no-reply@jumpingtomato.com', "Jumping Tomato", recipients,subject,html);
        if(email_sent){
            return res.status(200).send("success");
        }
        return res.status(500).json({"error":`unable to reset password`});
        
    }
    catch(error){
        console.error(error)
        return res.status(500).json({"error":error});
    }
}
