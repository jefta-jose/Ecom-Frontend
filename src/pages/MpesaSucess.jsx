import { Link, useLocation, useNavigate } from "react-router-dom";
import { store } from "../lib/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Container from "../ui/Container";
import Loading from "../ui/Loading";

const MpesaSuccess = () => {
  const { currentUser, cartProduct, resetCart } = store();
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
    } else if (cartProduct.length > 0) {
      const saveOrder = async () => {
        try {
          setLoading(true);

          // Calculate total amount
          const totalAmount = cartProduct.reduce((total, item) => {
            const price = parseFloat(item.discountedPrice || item.regularPrice || 0);
            return total + price * (item.quantity || 1);
          }, 0);

          // Fetch user phone number (assuming it's stored in Firestore)
          const userRef = doc(db, "users", currentUser?.email);
          const userSnap = await getDoc(userRef);
          const phoneNumber = userSnap.exists() ? userSnap.data().phoneNumber : "Unknown";

          const orderRef = doc(db, "mpesaOrders", currentUser?.email);
          const docSnap = await getDoc(orderRef);

          const orderData = {
            userEmail: currentUser?.email,
            paymentId: sessionId,
            orderItems: cartProduct,
            paymentMethod: "mpesa",
            userId: currentUser?.id,
            phoneNumber, // Added phone number
            totalAmount, // Added total amount
          };

          if (docSnap.exists()) {
            await updateDoc(orderRef, {
              mpesaOrders: arrayUnion(orderData),
            });
          } else {
            await setDoc(orderRef, {
              mpesaOrders: [orderData],
            });
          }

          toast.success("Payment accepted successfully & order saved!");
          resetCart();
        } catch (error) {
          toast.error("Error saving order data");
        } finally {
          setLoading(false);
        }
      };

      saveOrder();
    }
  }, [sessionId, navigate, currentUser, cartProduct]);

  return (
    <Container>
      {loading && <Loading />}
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-y-5">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          {loading
            ? "Your order payment is processing"
            : "Your Payment Accepted by supergear.com"}
        </h2>
        <p>
          {loading ? "Once done" : "Now"} you can view your mpesaOrders or continue Shopping with us
        </p>
        <div className="flex items-center gap-x-5">
          <Link to={"/orders"}>
            <button className="bg-black text-slate-100 w-52 h-12 rounded-full text-base font-semibold hover:bg-primeColor duration-300">
              View mpesaOrders
            </button>
          </Link>
          <Link to={"/"}>
            <button className="bg-black text-slate-100 w-52 h-12 rounded-full text-base font-semibold hover:bg-primeColor duration-300">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default MpesaSuccess;
