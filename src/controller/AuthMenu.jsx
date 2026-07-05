import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

export default function AuthMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); 
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>
        <UserCircleIcon className="h-12 w-12 text-blue-600" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg p-4">
          {!user ? (
            <>
              <button className="w-full bg-blue-600 text-white p-2 rounded mb-2" onClick={() => navigate("/login")}>Login</button>
              <button className="w-full bg-green-600 text-white p-2 rounded" onClick={() => navigate("/signup")}>Sign Up</button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="font-bold text-gray-900">{user.username}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <button className="w-full bg-red-600 text-white p-2 rounded" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}