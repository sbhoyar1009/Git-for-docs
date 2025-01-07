
const env = require('dotenv').config();
const express = require("express");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)// Replace with your secret key
const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  try {
    // Create a new Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sample Product',
            },
            unit_amount: 5000,  // Amount in cents ($50)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.HOST_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.HOST_URL}/cancel`,
    });
    
    // Send the session ID back to the frontend
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post("/webhook", async (req, res) => {
    console.log("Hitttedd")
    const sig = req.headers["stripe-signature"];
    let event;
  
    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig);
  
      // Handle the successful payment event
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const customerEmail = session.customer_email;
        const amount = session.amount_total / 100; // Amount in dollars
  
        // Save the session data and payment info to your database
        // Example: Save customer info and payment status in your database
        const paymentData = {
          email: customerEmail,
          amount,
          paymentStatus: "completed",
          sessionId: session.id,
        };
  
        // You can save this data to your database
        console.log(paymentData); // Save this info to your database
      }
  
      res.status(200).send("Webhook received");
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });


module.exports = router;
