import { pricing } from "helpers/Stripe";
import { usersRepo } from "database/user-repo";


function getExpirationDate(month){
  var d = new Date();
  d.setMonth(d.getMonth() + month);
  return d;
}

export default async function postSubcriptionCreatedAction(request, response) {
    const event = request.body;
    var message = "";
    switch(event.type) {
      case "invoice.paid":
        const email = event.data.object.customer_email;
        const amount_paid = 3000;
        const month = pricing[amount_paid].recurring.interval_count;
        try {
          const membership_expiration_date = getExpirationDate(month)
          await usersRepo.updateByEmail(email,{membership_expiration_date:membership_expiration_date});
          message = `membership expiration date updated. Email: ${email}. Datetime: ${new Date().toISOString()}.`;
        }
        catch(error){
          console.error(error);
          message = `An error has occurrd in an "invoice.paid" event. Email: ${email}.
                      Datetime: ${new Date().toISOString()}.
                      Error: ${error.message}`;
          console.error(message);
        }
        break;

      default:
        message = "Event from Stripe Webhooks not recognized."
        break;
    }
    response.status(200).json({ message: message});
  }