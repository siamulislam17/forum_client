import React, { useEffect, useState, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';


const PaymentForm = ({ price = 500 }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = UseAxiosSecure();
  const {  toggleDarkMode } = useContext(AuthContext); // Using user and toggleDarkMode

  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (price > 0) {
      axiosSecure.post('/create-payment-intent', { price })
        .then(res => {
          setClientSecret(res.data.clientSecret);
        })
        .catch(err => {
          console.error('Error getting client secret:', err);
        });
    }
  }, [price, axiosSecure]);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements || !clientSecret) return;

  const card = elements.getElement(CardElement);
  if (!card) return;

  setProcessing(true);

  // Create payment method
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card,
  });

  if (error) {
    Swal.fire('Error', error.message, 'error');
    setProcessing(false);
    return;
  }

  // Confirm payment
  const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: paymentMethod.id,
  });

  if (confirmError) {
    Swal.fire('Payment Failed', confirmError.message, 'error');
    setProcessing(false);
    return;
  }

  if (paymentIntent.status === 'succeeded') {
    try {
      // Call update-membership endpoint to update user's membership status
      await axiosSecure.patch('/update-membership');
      Swal.fire('Success', 'Payment successful and membership updated!', 'success');
    } catch (updateError) {
      console.error('Membership update error:', updateError);
      Swal.fire('Payment succeeded but failed to update membership', 'Please contact support.', 'warning');
    }
  }

  setProcessing(false);
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
  <CardElement
    className={`p-3 rounded border shadow-sm transition-colors duration-200 ${
      toggleDarkMode
        ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
        : 'bg-white text-black border-gray-300 placeholder-gray-500'
    }`}
    options={{
      style: {
        base: {
          fontSize: '16px',
          color: toggleDarkMode ? '#ffffff' : '#000000',
          backgroundColor: toggleDarkMode ? '#1f2937' : '#ffffff', // Optional for theme match
          '::placeholder': {
            color: toggleDarkMode ? '#9ca3af' : '#6b7280', // Tailwind gray-400 / gray-500
          },
        },
        invalid: {
          color: '#ef4444', // Tailwind red-500
        },
      },
    }}
  />

  <button
    type="submit"
    disabled={!stripe || !elements || !clientSecret || processing}
    className={`btn w-full ${
      toggleDarkMode ? 'btn-outline btn-accent' : 'btn-primary'
    }`}
  >
    {processing ? 'Processing...' : `Pay ৳${price}`}
  </button>
</form>

  );
};

export default PaymentForm;
