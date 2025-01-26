import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import upload from "../lib/upload";

import { getAuth } from "firebase/auth";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, } from "firebase/auth";
import { MdPhotoLibrary } from "react-icons/md";
import toast from "react-hot-toast";

const UpdateUserDetails = ( {currentUser} ) => {
  const auth = getAuth();
  
  const user = auth.currentUser;

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleUpdatingDetails = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { firstName, lastName, email } = Object.fromEntries(formData);

    try {
      setLoading(true);
      let imageUrl = currentUser?.avatar;

      if (avatar.file) {
        imageUrl = await upload(avatar.file);
      }

      const userRef = doc(db, "users", currentUser?.id);
      await updateDoc(userRef, {
        firstName,
        lastName,
        email,
        avatar: imageUrl,
      });

      setErrMsg("");
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrMsg("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const { currentPassword, newPassword } = Object.fromEntries(formData);

    console.log("currentPassword:" , currentPassword , "newPassword:" , newPassword);

    try {
      setLoading(true);

      if (user) {
        // Re-authenticate the user
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);

        // Update the password
        await updatePassword(user, newPassword);

        setErrMsg("");
        toast.success("Password updated successfully!");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setErrMsg("Failed to update password. Ensure current password is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="bg-gray-950 rounded-lg mt-10">
      <form
        onSubmit={handleUpdatingDetails}
        className="max-w-5xl mx-auto pt-10 px-10 lg:px-0 text-white"
      >
        <div className="border-b border-b-white/10 pb-5">
          <h2 className="text-lg font-semibold uppercase leading-7">
            Update Your Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Fill In Your Details To Update Your Profile
          </p>
        </div>

        <div className="border-b border-b-white/10 pb-5">
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="firstName" className="block text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                defaultValue={currentUser?.firstName}
                required
                className="mt-1 p-2 block w-full rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-gray-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="lastName" className="block text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                defaultValue={currentUser?.lastName}
                required
                className="mt-1 p-2 block w-full rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-gray-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="sm:col-span-3 mt-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={currentUser?.email}
              required
              className="mt-1  p-2 block w-full rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-gray-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="file-upload" className="block text-sm font-medium">
            Profile Picture
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <div className="flex-1">
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 border border-gray-600 rounded-full p-1">
                    {avatar?.url ? (
                      <img
                        src={avatar?.url}
                        alt="userImage"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <MdPhotoLibrary className="mx-auto h-full w-full text-gray-500" />
                    )}
                  </div>
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md px-2 py-1 bg-gray-900 font-semibold text-gray-200 hover:bg-gray-800"
                  >
                    Upload a file
                    <input
                      type="file"
                      id="file-upload"
                      className="sr-only"
                      onChange={handleAvatarChange}
                    />
                  </label>
                  <p className="text-xs leading-5 text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>

        {errMsg && <p className="mt-2 text-sm text-red-500">{errMsg}</p>}
      </form>

      {/* Password Change Section */}
      <form
        onSubmit={handleChangePassword}
        className="max-w-5xl mx-auto mt-8 pt-10 px-10 lg:px-0 text-white"
      >
        <div className="border-b border-b-white/10 pb-5">
          <h2 className="text-lg font-semibold uppercase leading-7">
            Change Password
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Update your password securely.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium"
            >
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              required
              className="mt-1 p-2 block w-full rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-gray-600 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium"
            >
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              required
              className="mt-1 p-2 block w-full rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-gray-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full mb-5 py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </div>

        {errMsg && <p className="mt-2 text-sm text-red-500">{errMsg}</p>}
      </form>
    </div>


  );
};

export default UpdateUserDetails;
