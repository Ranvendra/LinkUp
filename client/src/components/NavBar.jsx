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
} from "lucide-react";
import api from "../services/api";
import { removeUser } from "../store/userSlice";
import icon from "../../public/icon.webp"

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
      className="fixed w-full top-0 left-0 z-50 rounded-b-4xl pb-2"
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 4px 15px 0 rgba(31, 38, 135, 0.08)',
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
            <span
              className="font-pacifico text-2xl sm:text-4xl lg:text-5xl xl:text-4xl pb-6 pr-2 pl-2 pt-2 sm:ml-3 lg:ml-2 mt-4 transition-all duration-500 group-hover:tracking-wider text-red-500"
  
        
            >
              Linkup
            </span>
          </Link>

          {user && (
            <div className="flex items-center space-x-1">
              {/* Navigation Links */}
              <Link
                to="/feed"
                className={`flex flex-col items-center px-4 py-2 rounded-2xl transition-all duration-300 relative overflow-hidden group/item ${
                  isActive("/feed")
                    ? "text-[#ff1c1c]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  isActive("/feed")
                    ? {
                        background: 'rgba(255, 28, 28, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }
                    : {}
                }
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255, 107, 90, 0.15) 0%, transparent 70%)',
                  }}
                />
                <Rss className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/item:scale-110"/>
                <span className="text-xs mt-1 font-bold font-momo hidden sm:block relative z-10">
                  Feed
                </span>
              </Link>

              <Link
                to="/search"
                className={`flex flex-col items-center px-4 py-2 rounded-2xl transition-all duration-300 relative overflow-hidden group/item ${
                  isActive("/search")
                    ? "text-[#ff1c1c]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  isActive("/search")
                    ? {
                        background: 'rgba(255, 107, 90, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }
                    : {}
                }
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255, 107, 90, 0.15) 0%, transparent 70%)',
                  }}
                />
                <Search className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/item:scale-110" />
                <span className="text-xs mt-1 font-bold font-momo hidden sm:block relative z-10">
                  Search
                </span>
              </Link>

              <Link
                to="/connections"
                className={`flex flex-col items-center px-4 py-2 rounded-2xl transition-all duration-300 relative overflow-hidden group/item ${
                  isActive("/connections")
                    ? "text-[#ff1c1c]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  isActive("/connections")
                    ? {
                        background: 'rgba(255, 107, 90, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }
                    : {}
                }
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255, 107, 90, 0.15) 0%, transparent 70%)',
                  }}
                />
                <Users className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/item:scale-110" />
                <span className="text-xs mt-1 font-bold font-momo hidden sm:block relative z-10">
                  Network
                </span>
              </Link>

              <Link
                to="/chat"
                className={`flex flex-col items-center px-4 py-2 rounded-2xl transition-all duration-300 relative overflow-hidden group/item ${
                  isActive("/chat")
                    ? "text-[#ff1c1c]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  isActive("/chat")
                    ? {
                        background: 'rgba(255, 107, 90, 0.1)',
                        backdropFilter: 'blur(10px)',
                       
                      }
                    : {}
                }
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255, 107, 90, 0.15) 0%, transparent 70%)',
                  }}
                />
                <MessageCircle className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/item:scale-110" />
                <span className="text-xs mt-1 font-bold font-momo hidden sm:block relative z-10">
                  Messages
                </span>
              </Link>

              {/* Divider */}
              <div 
                className="h-8 w-px mx-2"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%)',
                }}
              ></div>

              {/* Profile Dropdown */}
              <div className="relative group">
                <button 
                  className="flex items-center space-x-3 px-3 py-2 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(255, 107, 90, 0.1) 0%, transparent 70%)',
                    }}
                  />
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden relative z-10 transition-transform duration-300 group-hover:scale-110"
                    style={{ 
                      boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.8), 0 4px 12px rgba(0, 0, 0, 0.15)',
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
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">View profile</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 animate-slideDown">
                  <div 
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    }}
                  >
                    <div 
                      className="px-4 py-3"
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
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
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-all duration-200 relative group/link overflow-hidden"
                      >
                        <div 
                          className="absolute inset-0 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200"
                          style={{
                            background: 'linear-gradient(90deg, rgba(255, 107, 90, 0.1) 0%, transparent 100%)',
                          }}
                        />
                        <User className="w-4 h-4 mr-3 relative z-10" />
                        <span className="relative z-10">My Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-all duration-200 relative group/link overflow-hidden"
                      >
                        <div 
                          className="absolute inset-0 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200"
                          style={{
                            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, transparent 100%)',
                          }}
                        />
                        <LogOut className="w-4 h-4 mr-3 relative z-10" />
                        <span className="relative z-10">Sign Out</span>
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