import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showTokenVerificationModal, setShowTokenVerificationModal] = useState(false);
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [resetPasswordParentModal, setResetPasswordParentModal] = useState(false);

    // Send reset link to email
    const handleSendResetLink = async () => {
        setLoading(true);
        try {
            // Normalize the email to lowercase
            const normalizedEmail = email.toLowerCase();
    
            const response = await axios.post("https://ecom-backend-rho-taupe.vercel.app/api/send-password-reset-email", { email: normalizedEmail });
            toast.success(response.data);
            setShowTokenVerificationModal(true);
        } catch (error) {
            toast.error("Error sending password reset link");
        } finally {
            setLoading(false);
        }
    };
    

    // Verify the token before allowing password reset
    const handleVerifyToken = async () => {
        setLoading(true);
        try {
            const response = await axios.post("https://ecom-backend-rho-taupe.vercel.app/api/verify-token", { token });
            toast.success(response.data);
            setShowPasswordResetModal(true);
            setShowTokenVerificationModal(false);
        } catch (error) {
            toast.error("Invalid token");
        } finally {
            setLoading(false);
        }
    };

    // Reset password after token verification
    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
    
        setLoading(true);
        try {
            const response = await axios.post("https://ecom-backend-rho-taupe.vercel.app/api/reset-password", { token, newPassword });
            toast.success(response.data);
            setShowPasswordResetModal(false);  // Close the password reset modal
            setShowModal(false);  // Close the initial modal
            setShowSuccessModal(true);  // Open the success confirmation modal
        } catch (error) {
            toast.error("Error resetting password");
            console.log(error);
        } finally {
            setLoading(false);
            navigate("/profile"); // Redirect to login page after successful reset
        }
    };
    
    const showResetModal = ()=>{
        setResetPasswordParentModal(true)
        setShowModal(true)
    }

    const closoModal = ()=>{
        setResetPasswordParentModal(false)
    }

    return (
        <div>
            {/* Request reset link */}
            <div>
                <p className="text-sm leading-6 text-gray-400 text-center -mt-2 pb-10">
                    Forgotten Password{" "}
                    <button
                        className="text-gray-200 font-semibold underline underline-offset-2 decoration-[1px] hover:text-white duration-200"
                        onClick={() => showResetModal()}
                    >
                        Reset
                    </button>
                </p>
            </div>
    
            {resetPasswordParentModal && (
                <div>
                    {/* Modal for entering email */}
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                            <div className="bg-gray-900 rounded-lg w-full max-w-md mx-4 sm:mx-auto p-6">
                                <button
                                    className="text-sm px-3 py-1 bg-red-600 text-white rounded mb-4 hover:bg-red-700 duration-200"
                                    onClick={() => closoModal()}
                                >
                                    Cancel
                                </button>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-3 mb-4 w-full text-gray-900 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                                <button
                                    onClick={handleSendResetLink}
                                    disabled={loading}
                                    className={`p-3 bg-blue-600 text-white rounded w-full ${
                                        loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                                    }`}
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </button>
                            </div>
                        </div>
                    )}
    
                    {/* Modal for verifying token */}
                    {showTokenVerificationModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                            <div className="bg-gray-900 rounded-lg w-full max-w-md mx-4 sm:mx-auto p-6">
                                <button
                                    className="text-sm px-3 py-1 bg-red-600 text-white rounded mb-4 hover:bg-red-700 duration-200"
                                    onClick={() => closoModal()}
                                >
                                    Cancel
                                </button>
                                <input
                                    type="text"
                                    placeholder="Enter verification code"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="p-3 mb-4 w-full text-gray-900 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                                <button
                                    onClick={handleVerifyToken}
                                    disabled={loading}
                                    className={`p-3 bg-green-600 text-white rounded w-full ${
                                        loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
                                    }`}
                                >
                                    {loading ? "Verifying..." : "Verify Token"}
                                </button>
                            </div>
                        </div>
                    )}
    
                    {/* Modal for resetting password */}
                    {showPasswordResetModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                            <div className="bg-gray-900 rounded-lg w-full max-w-md mx-4 sm:mx-auto p-6">
                                <button
                                    className="text-sm px-3 py-1 bg-red-600 text-white rounded mb-4 hover:bg-red-700 duration-200"
                                    onClick={() => closoModal()}
                                >
                                    Cancel
                                </button>
                                <input
                                    type="password"
                                    placeholder="New password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="p-3 mb-4 w-full text-gray-900 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="p-3 mb-4 w-full text-gray-900 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                                <button
                                    onClick={handlePasswordReset}
                                    disabled={loading}
                                    className={`p-3 bg-red-600 text-white rounded w-full ${
                                        loading ? "opacity-70 cursor-not-allowed" : "hover:bg-red-700"
                                    }`}
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>
                            </div>
                        </div>
                    )}
    
                    {/* Success modal */}
                    {showSuccessModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                            <div className="bg-green-600 text-white rounded-lg w-full max-w-md mx-4 sm:mx-auto p-6 text-center">
                                <h3 className="text-lg font-semibold">Password Reset Successful</h3>
                                <p className="mt-2">
                                    Your password has been successfully reset. You can now log in with your new password.
                                </p>
                                <button
                                    onClick={() => closoModal()}
                                    className="p-3 bg-blue-600 text-white rounded mt-4 hover:bg-blue-700 duration-200 w-full"
                                >
                                    Go to Login
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
    
};

export default ResetPassword;
