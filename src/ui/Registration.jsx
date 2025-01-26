import { useState } from "react";
("./Login");
import Label from "./Label";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import Login from "./Login";
import ResetPassword from "@/sections/ResetPassword";

const Registration = () => {

  const [login, setLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const role = "customer";
  const isVerified = false;

  const handleRegistration = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { firstName, lastName, email, password } =
      Object.fromEntries(formData);
    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", res.user.uid), {
        firstName,
        lastName,
        email,
        avatar: "imageUrl",
        id: res.user.uid,
        role,
        isVerified
      });
      setLogin(true);

    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email.";
          break;
        case "auth/missing-password":
          errorMessage = "Please enter a password.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "This email is already in use. Try another email.";
          break;
        // Add more cases as needed
        default:
          errorMessage = "An error occurred. Please try again.";
      }
      console.log("Error", error);
      setErrMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {login ? (
        <Login setLogin={setLogin} />
      ) : (
        <div className="bg-gray-950 rounded-lg">
          <form
            onSubmit={handleRegistration}
            className="max-w-5xl mx-auto pt-10 px-10 lg:px-0 text-white"
          >
            <div className="border-b border-b-white/10 pb-5">
              <h2 className="text-lg font-semibold uppercase leading-7">
                Registration Form
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                You need to provide required information to get registered with
                us.
              </p>
            </div>
            <div className="border-b border-b-white/10 pb-5">
              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Label title="First name" htmlFor="firstName" />
                  <input
                    type="text"
                    name="firstName"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Label title="Last name" htmlFor="lastName" />
                  <input
                    type="text"
                    name="lastName"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>
                <div className="sm:col-span-4">
                  <Label title="Email address" htmlFor="email" />
                  <input
                    type="email"
                    name="email"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>
                <div className="sm:col-span-4">
                  <Label title="Password" htmlFor="password" />
                  <input
                    type="password"
                    name="password"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>

                {/**manually add a role */}
                {/* <div className="sm:col-span-2">
                  <Label title="Role" htmlFor="role" />
                  <input
                    type="role"
                    name="role"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div> */}

              </div>
            </div>
            {errMsg && (
              <p className="bg-white/90 text-red-600 text-center py-1 rounded-md tracking-wide font-semibold">
                {errMsg}
              </p>
            )}
            <button
              disabled={loading}
              type="submit"
              className={`mt-5 w-full py-2 uppercase text-base font-bold tracking-wide text-gray-300 rounded-md hover:text-white hover:bg-indigo-600 duration-200 ${
                loading ? "bg-gray-500 hover:bg-gray-500" : "bg-indigo-700"
              }`}
            >
              {loading ? "Loading..." : "Register"}
            </button>
          </form>
          <p className="text-sm leading-6 text-gray-400 text-center -mt-2 py-10">
            Already have an Account{" "}
            <button
              onClick={() => setLogin(true)}
              className="text-gray-200 font-semibold underline underline-offset-2 decoration-[1px] hover:text-white duration-200"
            >
              Login
            </button>
          </p>

          <ResetPassword/>

        </div>
      )}
    </div>
  );
};

export default Registration;
