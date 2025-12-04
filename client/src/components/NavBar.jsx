import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LogOut,
  User,
  MessageCircle,
  Rss,
  Users,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import api from "../services/api";
import { removeUser } from "../store/userSlice";
import icon from "../../public/icon.webp";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      dispatch(removeUser());
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex flex-col items-center px-4 py-2 rounded-2xl transition-all duration-300 relative overflow-hidden group/item ${
        isActive(to) ? "text-[#ff1c1c]" : "text-gray-600 hover:text-gray-900"
      }`}
      style={
        isActive(to)
          ? {
              background: "rgba(255, 28, 28, 0.1)",
              backdropFilter: "blur(10px)",
            }
          : {}
      }
    >
      <div
        className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255, 107, 90, 0.15) 0%, transparent 70%)",
        }}
      />
      <Icon className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/item:scale-110" />
      <span className="text-xs mt-1 font-bold font-momo hidden sm:block relative z-10">
        {label}
      </span>
    </Link>
  );

  const MobileNavLink = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
        isActive(to)
          ? "bg-red-50 text-[#ff1c1c]"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="font-bold text-lg">{label}</span>
      {isActive(to) && (
        <div className="ml-auto w-2 h-2 bg-[#ff1c1c] rounded-full" />
      )}
    </Link>
  );

  return (
    <nav
      className="fixed w-full top-0 left-0 z-50 rounded-b-4xl pb-2"
      style={{
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
        boxShadow: "0 4px 15px 0 rgba(31, 38, 135, 0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/feed" className="flex items-center space-x-[-10px] group">
            <img
              className="h-15 w-20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
              src={icon}
              alt=""
            />
            <span className="font-pacifico text-2xl sm:text-4xl lg:text-5xl xl:text-4xl pb-6 pr-2 pl-2 pt-2 sm:ml-3 lg:ml-2 mt-4 transition-all duration-500 group-hover:tracking-wider text-red-500">
              Linkup
            </span>
          </Link>

          {user && (
            <div className="flex items-center gap-2">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                <NavLink to="/feed" icon={Rss} label="Feed" />
                <NavLink to="/search" icon={Search} label="Search" />
                <NavLink to="/connections" icon={Users} label="Network" />
                <NavLink to="/chat" icon={MessageCircle} label="Messages" />

                {/* Divider */}
                <div
                  className="h-8 w-px mx-2"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%)",
                  }}
                ></div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Profile Dropdown (Desktop & Mobile) */}
              <div className="relative group">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 px-2 py-2 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden relative z-10 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      boxShadow:
                        "0 0 0 2px rgba(255, 255, 255, 0.8), 0 4px 12px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    <img
                      src={
                        user.profilePicture ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden md:block text-left relative z-10">
                    <p className="text-sm font-medium text-red-500">
                      {user.name || "User"}
                    </p>
                  </div>
                </button>

                {/* Mobile Backdrop for Profile - Portaled to body */}
                {isProfileOpen &&
                  createPortal(
                    <div
                      className="fixed inset-0 z-40 md:hidden"
                      onClick={() => setIsProfileOpen(false)}
                    ></div>,
                    document.body
                  )}

                {/* Profile Menu */}
                <div
                  className={`absolute right-0 mt-2 w-64 z-50 origin-top-right transition-all duration-300 
                      ${
                        isProfileOpen
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      } 
                      md:opacity-0 md:invisible md:-translate-y-2 md:group-hover:opacity-100 md:group-hover:visible md:group-hover:translate-y-0`}
                >
                  <div
                    className="rounded-2xl overflow-hidden mx-4 md:mx-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                    }}
                  >
                    <div className="px-6 py-4 border-b border-gray-100">
                      <p className="text-sm font-bold text-red-500">
                        {user.firstName || user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && user && (
        <>
          {/* Backdrop for Mobile Menu - Portaled to body */}
          {createPortal(
            <div
              className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setIsMenuOpen(false)}
            ></div>,
            document.body
          )}

          <div className="md:hidden absolute top-full left-0 w-full animate-slideDown z-40">
            <div
              className="mx-4 mt-2 rounded-3xl overflow-hidden p-2 space-y-1"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
              }}
            >
              <MobileNavLink to="/feed" icon={Rss} label="Feed" />
              <MobileNavLink to="/search" icon={Search} label="Search" />
              <MobileNavLink to="/connections" icon={Users} label="Network" />
              <MobileNavLink to="/chat" icon={MessageCircle} label="Messages" />
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
