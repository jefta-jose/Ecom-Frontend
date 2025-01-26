import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useState } from "react";
import Label from "./Label";
import { useAddUserMutation } from "@/redux/userSlice";


const AdminCreateUser = ({setAddUserModal }) => {
  const [addUser] = useAddUserMutation();

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleRegistration = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { firstName, lastName, email, password, role } = Object.fromEntries(formData);
  
    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
  
      // Instead of setDoc, use the mutation to add the user
      const newUser = {
        firstName,
        lastName,
        email,
        avatar: "imageUrl", // Replace with actual image URL logic
        id: res.user.uid,
        role,
        isVerified: false,
        isVerifying: false
      };
  
      // Use the mutation here
      await addUser(newUser);  // Mutation call
  
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
      handleCancel();
    }
  };
  
  

  const handleCancel = () => {
    setAddUserModal(false);
  };

  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-gray-950 rounded-lg w-full max-w-5xl mx-4 sm:mx-auto py-10">
            <form
            onSubmit={handleRegistration}
            className="pt-10 px-6 sm:px-10 lg:px-16 text-white"
            >

            <button 
            onClick={handleCancel}
            className=" bg-red-500 px-5 py-2 cursor-pointer rounded-md">
                Cancel
            </button>

            <div className="border-b border-b-white/10 pb-5">
                <h2 className="text-lg font-semibold uppercase leading-7">
                Registration Form
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                You need to provide required information to get registered with us.
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

                <div className="sm:col-span-2">
                  <Label title="Role" htmlFor="role" />
                  <select
                      name="role"
                      id="role"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  >
                      <option className=" text-black font-semibold" value="admin">Admin</option>
                      <option className=" text-black font-semibold" value="customer">Customer</option>
                  </select>
              </div>


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
                {loading ? "Loading..." : "Send"}
            </button>
            </form>
        </div>
        </div>

  )
}

export default AdminCreateUser