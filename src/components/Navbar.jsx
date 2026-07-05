import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthMenu from "../controller/AuthMenu"; 
import { useAuth } from "../context/AuthContext"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useAuth(); 

  const closeMenu = () => setIsOpen(false);

  
  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="px-6 flex justify-between items-center h-16">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
          Incredibo
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:flex-row md:space-x-8 items-center font-bold text-xl">
          <Link to="/" className="hover:text-blue-400 transition">Home</Link>
          <Link to="/about" className="hover:text-blue-400 transition">About</Link>
          <Link to="/contact" className="hover:text-blue-400 transition">Contact Us</Link>
          <Link to="/ai" className="hover:text-blue-400 transition">Yatri(AI)</Link>

          {user ? (
            <AuthMenu />
          ) : (
            <>
              <Link to="/login" className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition">Login</Link>
              <Link to="/signup" className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500 transition">Signup</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="outline-none">
            {isOpen ? (
              <span className="text-2xl font-black">✕</span>
            ) : (
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden w-full bg-slate-800 border-t border-slate-700 flex flex-row`}>
        {/* Left Side */}
        <div className="flex w-1/2 flex-col p-4 space-y-4 border rounded-lg">
          <Link onClick={closeMenu} to="/" className="block hover:text-blue-400 transition font-semibold">Home</Link>
          <Link onClick={closeMenu} to="/about" className="block hover:text-blue-400 transition font-semibold">About</Link>
          <Link onClick={closeMenu} to="/contact" className="block hover:text-blue-400 transition font-semibold">Contact</Link>
          <Link onClick={closeMenu} to="/ai" className="block hover:text-blue-400 font-bold">Yatri(AI)</Link>
        </div>

        {/* Right Side */}
        <div className="p-2 w-1/2 border rounded-lg flex flex-col items-center justify-center gap-3">
          {user ? (
            <>
              <div className="text-center">
                <h3 className="font-bold">{user.username}</h3>
                <p className="text-xs text-gray-300">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="bg-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-500 transition">Logout</button>
            </>
          ) : (
            <>
              <Link onClick={closeMenu} to="/signup" className="bg-green-600 px-8 py-2 rounded-lg font-bold hover:bg-green-500 transition">Signup</Link>
              <Link onClick={closeMenu} to="/login" className="bg-blue-600 px-10 py-2 rounded-lg font-bold hover:bg-blue-500 transition">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;