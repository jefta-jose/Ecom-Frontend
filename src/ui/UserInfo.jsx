import { auth, db } from "../lib/firebase";
import Container from "./Container";
import { useEffect, useState } from "react";
import UpdateUserDetails from "./updateUserDetails";
import axios from "axios";
import { getUserEmail } from "@/lib/localStore";
import { useGetUserByIdQuery } from "@/redux/userSlice";
import { doc, onSnapshot } from "firebase/firestore";
import toast from "react-hot-toast";


const UserInfo = ( {currentUser} ) => {
  const { data: singleUser, isLoading: isFetchingUser } = useGetUserByIdQuery(currentUser?.id);
  
  const [updateDetails, setUpdateDetails] = useState(false);
  
  // Directly initialize the state based on the fetched user data
  const [isUserEmailVerified, setIsUserEmailVerified] = useState(singleUser?.isVerified);
  const [isUserEmailVerifying, setIsUserEmailVerifying] = useState(singleUser?.isVerifying);
  
    useEffect(() => {
      console.log(`UserId: ${currentUser.id}`)
      console.log(`User is verified : ${singleUser?.isVerified || "null"}`)
      // Listen for changes in the user's verification status
      const userRef = doc(db, "users", currentUser.id);

      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setIsUserEmailVerified(userData.isVerified);
          setIsUserEmailVerifying(userData.isVerifying);
        }
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    }, [currentUser.id]);

  const sendVerificationEmail = async () => {
    const userEmail = getUserEmail();

    try {
      if(!singleUser?.isVerified){
        const response = await axios.post(
          "https://ecom-backend-rho-taupe.vercel.app/send-verification-email",
          { email: userEmail }
        );
  
        toast.success(response.data);

      }

    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error(error.response?.data || "Error sending email.");
    }
  };

  return (
    <Container className="py-5 text-white">
      <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-16">
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-10">
          <img
            src={
              currentUser?.avatar
                ? currentUser?.avatar
                : "https://i.ibb.co/mJRkRRV/png-clipart-profile-logo-computer-icons-user-user-blue-heroes-thumbnail.png"
            }
            alt="userImage"
            className="w-40 h-40 rounded-full border border-gray-700 object-cover p-1"
          />
          <div className="text-start flex-1">
            <h2 className="text-xl font-bold tracking-tight sm:text-4xl">
              Welcome back,
              <span className="underline underline-offset-2 decoration-[1px] font-medium pl-2">
                {currentUser?.firstName} {currentUser?.lastName}
              </span>
              <br />
              <span className="tracking-wider text-lg underline-offset-2 decoration-[1px] font-medium pl-2">
                {currentUser?.email}
              </span>
              <br />
              <span className="tracking-wider text-lg underline-offset-2 decoration-[1px] font-medium pl-2">
                0712345678
              </span>
            </h2>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center gap-x-5 px-4 gap-y-4">
          <button
            onClick={() => auth.signOut()}
            className="rounded-md bg-white px-8 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Logout
          </button>

          <button
            onClick={() => setUpdateDetails(true)}
            className="rounded-md bg-white px-8 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Update Profile
          </button>

          <button
            onClick={sendVerificationEmail}
            className={`rounded-md px-8 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
              ${
                isUserEmailVerified
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : isUserEmailVerifying
                  ? "bg-yellow-500 text-white cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-600"
              }`}
          >
            {isUserEmailVerified
              ? "Account Is Verified"
              : isUserEmailVerifying
              ? "Verifying... Check Your Email"
              : "Click here to verify your email"}
          </button>
        </div>

        {updateDetails && <UpdateUserDetails currentUser={currentUser} />}

        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          aria-hidden="true"
        >
          <circle
            cx={512}
            cy={512}
            r={512}
            fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
            fillOpacity="0.7"
          />
          <defs>
            <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
              <stop stopColor="#7775D6" />
              <stop offset={1} stopColor="#E935C1" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </Container>
  );
};

export default UserInfo;
