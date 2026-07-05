import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // <-- Imported useAuth

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- Extracted login function

  const [view, setView] = useState("login");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [resetData, setResetData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetChange = (e) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", formData);

     
      login(res.data.accessToken, res.data.user);


      navigate("/"); 
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/forgot-password", {
        email: resetData.email,
      });
      alert("An OTP has been sent to your email.");
      setView("resetPassword");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/reset-password", {
        email: resetData.email,
        otp: resetData.otp,
        newPassword: resetData.newPassword,
      });
      alert("Password reset successfully. You can now login.");
      setView("login");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-900 via-blue-300 to-blue-200 mx-auto px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        {view === "login" && (
          <>
            <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg"
              />

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setView("requestOtp")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
            </form>

            <p className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 font-semibold">
                Sign Up
              </Link>
            </p>
          </>
        )}

        {view === "requestOtp" && (
          <>
            <h1 className="text-3xl font-bold text-center mb-6">Reset Password</h1>
            <p className="text-center text-gray-600 mb-4">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={resetData.email}
                onChange={handleResetChange}
                required
                className="w-full border p-3 rounded-lg"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              >
                Send OTP
              </button>
            </form>
            <p className="text-center mt-4">
              <button
                onClick={() => setView("login")}
                className="text-gray-500 hover:underline"
              >
                Back to Login
              </button>
            </p>
          </>
        )}

        {view === "resetPassword" && (
          <>
            <h1 className="text-3xl font-bold text-center mb-6">Create New Password</h1>
            <p className="text-center text-gray-600 mb-4">
              Enter the OTP sent to <strong>{resetData.email}</strong> and your new password.
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={resetData.otp}
                onChange={handleResetChange}
                required
                maxLength={6}
                className="w-full border p-3 rounded-lg text-center tracking-widest"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={resetData.newPassword}
                onChange={handleResetChange}
                required
                className="w-full border p-3 rounded-lg"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
              >
                Update Password
              </button>
            </form>
            <p className="text-center mt-4">
              <button
                onClick={() => setView("login")}
                className="text-gray-500 hover:underline"
              >
                Cancel and back to Login
              </button>
            </p>
          </>
        )}

      </div>
    </div>
  );
}