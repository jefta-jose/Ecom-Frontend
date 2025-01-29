import React from 'react'
import { store } from '../lib/store';
import { getUserVerification } from '@/lib/localStore';

const Mpesa = ({products}) => {
  const { currentUser } = store();
  const isVerified = getUserVerification();

  const handleMpesaCheckout = async () => {
    const response = await fetch(`http://localhost:5000/stkpush`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: products,
        phoneNumber: currentUser?.phoneNumber,
      }),
    });

    const data = await response.json();
    console.log(data, "data")

    if (data.status) {
      window.location.href = data.redirectUrl;
    }
  };


  return (
    <div>
      {currentUser && (
            <button
            onClick={()=> handleMpesaCheckout()}
            className="w-full mt-2 rounded-md border border-transparent bg-green-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-skyText focus:ring-offset-2 focus:ring-offset-gray-50 duration-200">
              Mpesa
            </button>
      )}

    {!currentUser && (
        <p className="mt-2 text-sm font-medium text-red-500 text-center">
          Need to sign in to make checkout
        </p>
      )}

      {currentUser && !isVerified && (
            <p className="mt-2 text-sm font-medium text-red-500 text-center">
              You need to be verified to complete checkout.
            </p>
          )}
    </div>
  )
}

export default Mpesa