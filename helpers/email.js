import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MailerSend_API_KEY,
});


async function send_email(sender_address, sender_name, 
    recipient_address_name_array, subject, html){
    try{
        const sentFrom = new Sender(sender_address, sender_name);

        const recipient_array = [];
        recipient_address_name_array.forEach((each)=>{
            const recipient = new Recipient(each.address, each.name);
            recipient_array.push(recipient)
        });

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipient_array)
            .setReplyTo(sentFrom)
            .setSubject(subject)
            .setHtml(html);

        const result = await mailerSend.email.send(emailParams);
        if(result.statusCode == 202){
            return true;
        }
        return false;
    }
    catch(error){
        console.error(error);
        throw error;
    } 
}

async function send_no_reply_email(recipient_address_name_array, subject, html){
    const email_sent = await send_email('no-reply@jumpingtomato.com','No Reply', recipient_address_name_array, subject, html);
    return email_sent;
}

export {
    send_email,
    send_no_reply_email
};
