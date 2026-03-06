import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, X } from "lucide-react";
import api from "../../services/api";
import { removeUser } from "../../store/userSlice";
import icon from "../../../public/icon.webp";

// Subcomponents
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import ProfileDropdown from "./ProfileDropdown";

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
              <DesktopNav />

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

              <ProfileDropdown
                user={user}
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
                handleLogout={handleLogout}
              />
            </div>
          )}
        </div>
      </div>

      <MobileNav
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={user}
      />
    </nav>
  );
};

export default NavBar;
