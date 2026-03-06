import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { User, LogOut } from "lucide-react";

const ProfileDropdown = ({
  user,
  isProfileOpen,
  setIsProfileOpen,
  handleLogout,
}) => {
  if (!user) return null;

  return (
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
          document.body,
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
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
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
  );
};

export default ProfileDropdown;
