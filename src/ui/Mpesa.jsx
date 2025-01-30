import { store } from "../lib/store";
import { getUserVerification } from "@/lib/localStore";

const IntaSendPayButton = ({ products }) => {
  const { currentUser } = store();
  const isVerified = getUserVerification();

  const handleMpesaCheckout = async () => {
    if(currentUser){
      const response = await fetch("http://localhost:5000/intasendCheckout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: products,
          user: currentUser,
        }),
      });
    }
  };

  return (
    <div className="mt-6">
      {currentUser && isVerified && (
          <button
          onClick={() => handleMpesaCheckout()}
          className="w-full rounded-md bg-green-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-green-800 duration-200"
        >
          Pay with M-Pesa
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
  );
};

export default IntaSendPayButton;