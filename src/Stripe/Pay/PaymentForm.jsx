import React, { useContext, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = UseAxiosSecure();
  const { user, toggleDarkMode } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const { data } = await axiosSecure.post('/create-payment-intent', { amount: 5 });

      const { error: submitError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (submitError) throw submitError;

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: paymentMethod.id,
          receipt_email: user.email,
        }
      );

      if (confirmError) throw confirmError;

      if (paymentIntent.status === 'succeeded') {
        const updateRes = await axiosSecure.patch('/update-membership');
        if (updateRes.data.success) {
          Swal.fire({
            title: 'Success!',
            text: 'Payment successful and membership activated',
            icon: 'success',
            confirmButtonColor: '#2563eb',
          });
        } else {
          throw new Error('Failed to update membership');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Payment failed',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-16 p-6 border rounded-2xl shadow-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
    >
      <label className="block mb-2 text-gray-800 dark:text-gray-100 font-semibold text-lg">
        Enter Card Info
      </label>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#1a202c', // dark gray for light mode
              '::placeholder': {
                color: '#9ca3af', // gray-400
              },
            },
            invalid: {
              color: '#ef4444', // red-500
            },
          },
        }}
        className={`mb-4 p-3 rounded-lg border ${toggleDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}  `}
      />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
      >
        {processing ? 'Processing...' : 'Pay $5'}
      </button>
    </form>
  );
};

export default PaymentForm;
