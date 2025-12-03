import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LogOut,
  User,
  MessageCircle,
  Home,
  Users,
  Bell,
  Search,
} from "lucide-react";
import api from "../services/api";
import { removeUser } from "../store/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <nav
      className="bg-white border-b border-gray-200 fixed w-full top-0 left-0 z-50"
      style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/feed" className="flex items-center space-x-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #FF6B5A 0%, #FF8777 100%)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12H16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "Outfit", color: "#1A1A1A" }}
            >
              LinkUp
            </span>
          </Link>

          {user && (
            <div className="flex items-center space-x-1">
              {/* Navigation Links */}
              <Link
                to="/feed"
                className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all ${
                  isActive("/feed")
                    ? "text-[#FF6B5A]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium hidden sm:block">
                  Home
                </span>
              </Link>

              <Link
                to="/search"
                className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all ${
                  isActive("/search")
                    ? "text-[#FF6B5A]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Search className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium hidden sm:block">
                  Search
                </span>
              </Link>

              <Link
                to="/connections"
                className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all relative ${
                  isActive("/connections")
                    ? "text-[#FF6B5A]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium hidden sm:block">
                  Network
                </span>
              </Link>

              <Link
                to="/chat"
                className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all relative ${
                  isActive("/chat")
                    ? "text-[#FF6B5A]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium hidden sm:block">
                  Messages
                </span>
              </Link>

              {/* Divider */}
              <div className="h-8 w-px bg-gray-200 mx-2"></div>

              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white"
                    style={{ boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05)" }}
                  >
                    <img
                      src={
                        user.photoUrl ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName || user.name}
                    </p>
                    <p className="text-xs text-gray-500">View profile</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 animate-slideDown">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName || user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
    </nav>
  );
};

export default NavBar;
