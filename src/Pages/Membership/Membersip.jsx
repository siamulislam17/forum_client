import React from 'react';

import Swal from 'sweetalert2';
import UseAxiosSecure from '../../UrlInstance/UseURlSecure';

const Membership = () => {
  const axiosSecure = UseAxiosSecure();

  const handlePay = async () => {
    try {
      const res = await axiosSecure.post('/create-checkout-session')
      .than(res=>{
        console.log(res)
        Swal.fire({
          title: 'Success!',
          text: 'Payment successful!',
          icon: 'success',
          confirmButtonText: 'OK'
        })
      })
     
    } catch (error) {
      console.error('Stripe checkout error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Payment failed. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center bg-white shadow rounded mt-20">
      <h2 className="text-2xl font-bold mb-4">Become a Member</h2>
      <p className="mb-4">Pay $5.00 to get access to premium features.</p>
      <button
        onClick={handlePay}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
      >
        Pay with Stripe
      </button>
    </div>
  );
};

export default Membership;
