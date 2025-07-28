import React, { useContext } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../../Stripe/Pay/PaymentForm';
import { AuthContext } from '../../Context/AuthContext';


const Membership = () => {
  const {toggleDarkMode} = useContext(AuthContext);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHER_KEY);

  
  return (
    <div className={`p-6 h-screen max-w-xl mx-auto text-center shadow rounded ${toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold mb-4">Become a Member</h2>
      <Elements stripe={stripePromise}>
            <PaymentForm></PaymentForm>
        </Elements>  
      
    </div>
  );
};

export default Membership;
