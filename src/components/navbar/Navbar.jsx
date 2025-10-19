import { useState } from "react";
import { NavLink } from "react-router";
import {
  ShoppingCart,
  PlusCircle,
  Menu,
  X,
  UserCircle,
  LogOut,
  LogIn,
} from "lucide-react";

const BackOfficeNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    // 🔐 You can connect this to your logout logic (Firebase or JWT)
    console.log("Logged out!");
  };

  return (
    <nav className="bg-green-900 text-white px-6 py-4 flex items-center justify-between shadow-md relative">
      {/* Brand */}
      <div className="text-2xl font-bold tracking-wide flex items-center gap-2">
        🥥 <span>Coconut Back Office</span>
      </div>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex gap-6 items-center">
        <li>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                isActive ? "bg-green-700" : "hover:bg-green-800"
              }`
            }
          >
            <ShoppingCart size={20} /> Orders
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/add-product"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                isActive ? "bg-green-700" : "hover:bg-green-800"
              }`
            }
          >
            <PlusCircle size={20} /> Add Product
          </NavLink>
        </li>

        {/* Profile Section */}
        <li className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 hover:text-green-300 transition"
          >
            <UserCircle size={26} />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-green-900 rounded-lg shadow-md overflow-hidden z-50">
              <NavLink
                to="/profile"
                className="block px-4 py-2 hover:bg-green-100 transition"
              >
                Profile
              </NavLink>
              <NavLink
                to="/login"
                className="block px-4 py-2 hover:bg-green-100 transition flex items-center gap-2"
              >
                <LogIn size={16} /> Login
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-green-100 transition flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex items-center"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-green-950 text-white flex flex-col items-start px-6 py-4 space-y-3 md:hidden shadow-lg z-40">
          <NavLink
            to="/orders"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg w-full transition ${
                isActive ? "bg-green-800" : "hover:bg-green-800"
              }`
            }
          >
            <ShoppingCart size={20} /> Orders
          </NavLink>

          <NavLink
            to="/add-product"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg w-full transition ${
                isActive ? "bg-green-800" : "hover:bg-green-800"
              }`
            }
          >
            <PlusCircle size={20} /> Add Product
          </NavLink>

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-800 w-full transition"
          >
            <UserCircle size={20} /> Profile Options
          </button>

          {/* Mobile Profile Dropdown */}
          {profileOpen && (
            <div className="w-full bg-green-800 rounded-lg text-sm">
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-green-700 transition"
              >
                Profile
              </NavLink>
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-green-700 transition"
              >
                Login
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-green-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default BackOfficeNavbar;
