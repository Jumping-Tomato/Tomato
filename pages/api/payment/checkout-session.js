import Stripe from 'stripe';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


export default async function checkoutSession(req, res) {
    
    if (req.method === 'POST') {
      const  {payment_data}  = req.body;
      try {
        const session = await stripe.checkout.sessions.create({
          line_items: [{
            price_data: {
              currency: 'usd',
              unit_amount: payment_data.unit_amount,
              product_data: payment_data.product_data,
              recurring: payment_data.recurring
            },
            quantity: 1,
          }],
          mode: 'subscription',
          success_url: `${req.headers.origin}/payment/success`,
          cancel_url: `${req.headers.origin}/payment/cancel`,
        });
        return res.status(200).send({"url": session.url})
      } catch (err) {
        console.error(err)
        res.status(err.statusCode || 500).json(err.message);
      }
    } else {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
  }