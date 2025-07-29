// pages/Membership.jsx
import React, { useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../../Stripe/Pay/PaymentForm';
import { AuthContext } from '../../Context/AuthContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHER_KEY);

const Membership = () => {
  const { user, toggleDarkMode } = useContext(AuthContext);
  const price = 10; // Membership cost

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className={`bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center ${toggleDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${toggleDarkMode ? 'text-white' : 'text-gray-800'}`}>Get Membership</h2>
        <p className={`mb-6 ${toggleDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Become a premium member for just ${price}!</p>

        <Elements stripe={stripePromise}>
          <PaymentForm price={price} />
        </Elements>
      </div>
    </div>
  );
};

export default Membership;
