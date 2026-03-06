import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { MessageCircle, Rss, Users, Search } from "lucide-react";

const MobileNavLink = ({ to, icon: Icon, label, isActive }) => (
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

const MobileNav = ({ isMenuOpen, setIsMenuOpen, user }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  if (!isMenuOpen || !user) return null;

  return (
    <>
      {createPortal(
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>,
        document.body,
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
          <MobileNavLink
            to="/feed"
            icon={Rss}
            label="Feed"
            isActive={isActive}
          />
          <MobileNavLink
            to="/search"
            icon={Search}
            label="Search"
            isActive={isActive}
          />
          <MobileNavLink
            to="/connections"
            icon={Users}
            label="Network"
            isActive={isActive}
          />
          <MobileNavLink
            to="/chat"
            icon={MessageCircle}
            label="Messages"
            isActive={isActive}
          />
        </div>
      </div>
    </>
  );
};

export default MobileNav;
