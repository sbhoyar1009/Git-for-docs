import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Button } from 'antd';
import axios from "axios";

const stripePromise = loadStripe(process.env.REACT_APP_PAYMENT_SECRET);  // Replace with your public key

const Checkout = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const response = await axios.post("http://localhost:5001/api/payment/create-checkout-session", {
      method: "POST",

    });
    console.log(response)
    
    const stripe = await stripePromise;
    window.location.href = response.data.url;
    // Redirect to the Stripe Checkout page
    const { error } = await stripe.redirectToCheckout({
      sessionId: response.data.id,
    });

    if (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <Button
        type="primary"
        loading={loading}
        onClick={handleCheckout}
      >
        Pay with Stripe
      </Button>
    </div>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <Checkout />
  </Elements>
);

export default Payment;
