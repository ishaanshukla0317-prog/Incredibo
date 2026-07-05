import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  
  const [authData, setAuthData] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    nationality: "",
    address: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/auth/register", formData);

      setAuthData(res.data);
      setIsOtpStep(true);
      
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    try {
      await api.post("/api/auth/verify-email", {
        email: formData.email,
        otp: otp
      });

      if (authData) {

        login(authData.accessToken, authData.user);
      }
      
     
      navigate("/"); 
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "OTP Verification Failed"
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 flex justify-center items-center bg-gradient-to-br from-blue-900 via-blue-300 to-blue-200 mx-auto px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          {isOtpStep ? "Verify Email" : "Create Account"}
        </h1>

        {!isOtpStep ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />

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

            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select Nationality</option>
              <option value="Indian">Indian</option>
              <option value="Foreigner">Foreigner</option>
            </select>

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select Role</option>
              <option value="Guide">Guide</option>
              <option value="Visitor">Visitor</option>
            </select>

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
            >
              Sign Up
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-center text-gray-600 mb-4">
              We've sent a one-time password to <strong>{formData.email}</strong>.
            </p>
            
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full border p-3 rounded-lg text-center text-xl tracking-widest"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 mt-2"
            >
              Verify OTP
            </button>
          </form>
        )}

        {!isOtpStep && (
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-semibold">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}