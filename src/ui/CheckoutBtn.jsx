import { loadStripe } from "@stripe/stripe-js";
import { store } from "../lib/store";
import { config } from "../../config";
import { getUserVerification } from "@/lib/localStore";

const CheckoutBtn = ({products}) => {
  const isVerified = getUserVerification();
  const { currentUser } = store();
  const publishableKey = import.meta.env.VITE_STRIPE_API_KEY;
  const stripePromise = loadStripe(publishableKey);

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise; // Ensure stripe is loaded properly
  
      if (!stripe) {
        console.error("Stripe not loaded correctly.");
        window.alert("Stripe is not available.");
        return;
      }
  
      // Make the request to the backend to create the checkout session
      const response = await fetch("https://ecom-backend-ten-rose.vercel.app/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: products, // Pass the products
          email: currentUser?.email, // Pass the current user's email
        }),
      });
  
      const checkoutSession = await response.json();
  
      if (!checkoutSession.success) {
        console.error("Error from server:", checkoutSession.error);
        window.alert("Error initiating checkout! " + checkoutSession.error);
        return;
      }
  
      // Log the session URL and redirect the user to the checkout page
      console.log("Redirecting to Stripe Checkout with URL:", checkoutSession.url);
      
      // Redirect the user to the Stripe Checkout URL
      window.location.href = checkoutSession.url;
    } catch (error) {
      console.error("Checkout error:", error);
      window.alert("An error occurred during checkout: " + error.message);
    }
  };

  const isButtonDisabled = !currentUser || (currentUser && !isVerified);

  return (
    <div className="mt-6">
      {currentUser ? (
        isVerified ? (
          <button
            onClick={handleCheckout}
            type="submit"
            className="w-full rounded-md border border-transparent bg-gray-800 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-skyText focus:ring-offset-2 focus:ring-offset-gray-50 duration-200"
          >
            Checkout
          </button>
        ) : (
          <button
            disabled
            className="w-full text-base text-white text-center rounded-md border border-transparent bg-gray-500 px-4 py-3 cursor-not-allowed"
          >
            Checkout - Verify Account First
          </button>
        )
      ) : (
        <button className="w-full text-base text-white text-center rounded-md border border-transparent bg-gray-500 px-4 py-3 cursor-not-allowed">
          Checkout
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

export default CheckoutBtn;
