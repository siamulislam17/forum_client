import React from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../../Stripe/Pay/PaymentForm';


const Membership = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHER_KEY);

  
  return (
    <div className="p-6 max-w-xl mx-auto text-center bg-white shadow rounded mt-20">
      <h2 className="text-2xl font-bold mb-4">Become a Member</h2>
      <Elements stripe={stripePromise}>
            <PaymentForm></PaymentForm>
        </Elements>  
      
    </div>
  );
};

export default Membership;
