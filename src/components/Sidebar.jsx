import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  TrendingUp,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Users,
  User,
  Crown,
  ArchiveIcon,
  MessageCircle,
  Shield,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Sidebar = ({ onNavigate, currentPage = "dashboard", mobileMenuOpen = false, onCloseMobileMenu, isAdmin = false }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const menuItems = isAdmin ? [
    { id: "admin-tickets", icon: MessageCircle, label: "Support Tickets" },
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "workout", icon: Dumbbell, label: "Workouts" },
    { id: "nutrition", icon: Utensils, label: "Nutrition" },
    { id: "progress", icon: TrendingUp, label: "Progress" },
    { id: "achivements", icon: ArchiveIcon, label: "Achivements" },
    { id: "explore", icon: Users, label: "Explore" },
    { id: "creator", icon: Crown, label: "Creator" },
    { id: "support", icon: MessageCircle, label: "Support" },
    { id: "profile", icon: Bell, label: "Profile" },
    { id: "settings", icon: Settings, label: "Settings" },
  ] : [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "workout", icon: Dumbbell, label: "Workouts" },
    { id: "nutrition", icon: Utensils, label: "Nutrition" },
    { id: "progress", icon: TrendingUp, label: "Progress" },
    { id: "achivements", icon: ArchiveIcon, label: "Achivements" },
    { id: "explore", icon: Users, label: "Explore" },
    { id: "creator", icon: Crown, label: "Creator" },
    { id: "support", icon: MessageCircle, label: "Support" },
    { id: "profile", icon: Bell, label: "Profile" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const handleClick = (id) => {
    if (id === "admin" || id === "admin-tickets") {
      if (onNavigate) {
        onNavigate(id);
      } else {
        navigate("/admin/tickets");
      }
    } else if (onNavigate) {
      onNavigate(id);
    } else {
      navigate(id === "dashboard" ? "/" : `/${id}`);
    }
  };

  return (
    <aside
      className={`sidebar sticky top-0 h-full transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky z-50`}
    >
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleClick("dashboard")}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: theme.gradient }}
            >
              <Zap size={22} className="text-white" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold gradient-text">R-Fit</span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-[var(--theme-primaryLight)] transition-colors ml-auto"
            style={{ color: "var(--theme-textSecondary)" }}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`w-full flex items-center ${
                  collapsed ? "justify-center" : "space-x-3"
                } p-3 rounded-xl transition-all duration-200 text-left ${
                  isActive ? "nav-active" : "menu-item-hover"
                }`}
                style={!isActive ? { color: "var(--theme-textSecondary)" } : {}}
              >
                <Icon size={20} />
                {!collapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
