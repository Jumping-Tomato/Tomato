import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Checkout({cart}) {
    const handleCheckout = async () => {
      try {
        const stripe = await stripePromise;
        console.log(cart)
        const checkoutSession = await axios.post("/api/payment/checkout-session", {
          cart,
        });
  
        const result = await stripe.redirectToCheckout({
          sessionId: checkoutSession.data.id,
        });
  
        if (result.error) {
          alert(result.error.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    return (
        <button onClick={handleCheckout}>
            Checkout
        </button>
    );
  }