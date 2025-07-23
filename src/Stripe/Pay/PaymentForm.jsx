// 📁 PaymentForm.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';


import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = UseAxiosSecure();
  const { user } = useContext(AuthContext);

  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await axiosSecure.post('/create-payment-intent', { amount: 500 });
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        Swal.fire('Error', 'Failed to create payment intent', 'error');
      }
    };
    if (user?.email) {
      createPaymentIntent();
    }
  }, [user, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      Swal.fire('Card Error', error.message, 'error');
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      Swal.fire('Payment Failed', confirmError.message, 'error');
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        await axiosSecure.patch('/update-membership');
        Swal.fire('Success', 'Membership Activated!', 'success');
      } catch (err) {
        Swal.fire('Update Error', 'Payment succeeded but failed to update membership.', 'error');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded shadow">
      <CardElement className="mb-4 p-2 border rounded" />
      <button
        type="submit"
        disabled={!stripe || !clientSecret}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Pay $5
      </button>
      
    </form>
  );
};

export default PaymentForm;
