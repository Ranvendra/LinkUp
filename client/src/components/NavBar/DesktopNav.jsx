import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Rss, Users, Search } from "lucide-react";

// eslint-disable-next-line no-unused-vars
const NavLink = ({ to, icon: Icon, label, isActive }) => (
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

const DesktopNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="hidden md:flex items-center space-x-1">
      <NavLink to="/feed" icon={Rss} label="Feed" isActive={isActive} />
      <NavLink to="/search" icon={Search} label="Search" isActive={isActive} />
      <NavLink
        to="/connections"
        icon={Users}
        label="Network"
        isActive={isActive}
      />
      <NavLink
        to="/chat"
        icon={MessageCircle}
        label="Messages"
        isActive={isActive}
      />

      {/* Divider */}
      <div
        className="h-8 w-px mx-2"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%)",
        }}
      ></div>
    </div>
  );
};

export default DesktopNav;
