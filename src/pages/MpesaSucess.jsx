import { Link, useLocation, useNavigate } from "react-router-dom";
import { store } from "../lib/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Container from "../ui/Container";
import Loading from "../ui/Loading";

const MpesaSuccess = () => {
  const { resetCart } = store();
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
    } else {
      // Show success message and reset cart
      setLoading(true);
      setTimeout(() => {
        toast.success("Payment successful!");
        resetCart();
        setLoading(false);
      }, 2000); // Simulating processing delay
    }
  }, [sessionId, navigate, resetCart]);

  return (
    <Container>
      {loading && <Loading />}
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-y-5">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          {loading
            ? "Your order payment is processing..."
            : "Your Payment Was Successful!"}
        </h2>
        <p>
          {loading ? "Please wait..." : "You can now view your orders or continue shopping."}
        </p>
        <div className="flex items-center gap-x-5">
          <Link to={"/orders"}>
            <button className="bg-black text-slate-100 w-52 h-12 rounded-full text-base font-semibold hover:bg-primeColor duration-300">
              View Orders
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
