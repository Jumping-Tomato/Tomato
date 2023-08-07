import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);


const pricing = {
    1: {
        unit_amount: 1000,
        product_data: {
          name: 'Monthly Access',
          description: 'One Month Access to Jumping Tomato',
          images: ['https://i.imgur.com/fLWFlP3.png'],
        },
        recurring:{
          interval: "month",
          interval_count: 1
        }  
    },
    2: {
        unit_amount: 2100,
        product_data: {
          name: 'Three-Month Access',
          description: 'Three-Month Access to Jumping Tomato',
          images: ['https://i.imgur.com/fLWFlP3.png'],
        },
        recurring:{
          interval: "month",
          interval_count: 6
        }  
    },
    3: {
        unit_amount: 3000,
        product_data: {
          name: 'Six-month Access',
          description: 'One Year Access to Jumping Tomato',
          images: ['https://i.imgur.com/fLWFlP3.png'],
        },
        recurring:{
          interval: "month",
          interval_count: 12
        }  
    }
}
async function StripeCheckout(accessLevel, email) {
    try {
        const stripe = await stripePromise;
        const payment_data = pricing[accessLevel];
        payment_data.email = email;
        const checkoutSession = await axios.post("/api/Stripe/checkout-session", 
             {payment_data} 
        );
        if (checkoutSession.status == 200) {
            const checkoutUrl = checkoutSession.data.url;
            window.open(checkoutUrl);
        }
        else{
            alert('An error has occured')
        }
    } 
    catch (error) {
        console.error(error);
    }
}


export {
    StripeCheckout
};