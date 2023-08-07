import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

async function Checkout({cart}) {
    try {
        const stripe = await stripePromise;
        const checkoutSession = await axios.post("/api/payment/checkout-session", {
            cart,
        });

        const result = await stripe.redirectToCheckout({
            sessionId: checkoutSession.data.id,
        });

        if (result.error) {
            alert(result.error.message);
        }
    } 
    catch (error) {
        console.log(error);
    }
}


export {
    Checkout
};